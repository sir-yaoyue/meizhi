"""Isolated gateway tests for job retry and admin user management.
Never calls a model or uses the production database."""
import asyncio
import gc
import importlib.util
import json
import os
import tempfile
import time
import unittest
from pathlib import Path
from unittest.mock import patch

import httpx


class RetryAdminTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="kaishi-admin-test-")
        with patch.dict(os.environ, {"KAISHI_BASE_DIR": self.temp.name}):
            spec = importlib.util.spec_from_file_location("retry_admin_app", Path(__file__).with_name("app.py"))
            self.gateway = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(self.gateway)
        self.gateway.init_db()
        self.admin = {"id": 1, "username": "admin", "role": "admin"}
        self.auth = patch.object(self.gateway, "current_user", return_value=self.admin)
        self.auth.start()
        self.client = httpx.AsyncClient(
            transport=httpx.ASGITransport(app=self.gateway.app), base_url="http://test"
        )

    async def asyncTearDown(self):
        await self.client.aclose()
        self.auth.stop()
        self._release_temp()

    def _release_temp(self):
        # 释放可能残留的 sqlite 句柄（Windows 上打开中的文件无法删除）
        try:
            conn = self.gateway.db_connect()
            conn.execute("PRAGMA wal_checkpoint(TRUNCATE)")
            conn.close()
        except Exception:
            pass
        gc.collect()
        for _ in range(20):
            try:
                self.temp.cleanup()
                return
            except PermissionError:
                time.sleep(0.1)
            gc.collect()

    def make_failed_video_job(self, files=None):
        gw = self.gateway
        local_id = f"video_job_{os.urandom(8).hex()}"
        job_dir = gw.QUEUE_DIR / local_id
        job_dir.mkdir(parents=True, exist_ok=True)
        manifest_files = []
        for index, content in enumerate(files or []):
            path = job_dir / f"upload_{index}.png"
            path.write_bytes(content)
            manifest_files.append(
                {
                    "field": "input_reference",
                    "filename": path.name,
                    "content_type": "image/png",
                    "media_kind": "image",
                    "path": str(path),
                }
            )
        manifest = {"fields": [["prompt", "测试重提交"]], "files": manifest_files}
        now = int(time.time())
        with gw.db_connect() as conn:
            conn.execute(
                """
                INSERT INTO jobs (
                    id, status, prompt, model, progress, created_at, updated_at,
                    user_id, request_json, task_type, result_type, upstream_base
                ) VALUES (?, 'failed', ?, 'MiniMaxH3', 0, ?, ?, ?, ?, 'fl2va', 'video', ?)
                """,
                (local_id, "测试重提交", now, now, 1, json.dumps(manifest, ensure_ascii=False),
                 gw.FL2VA_UPSTREAM),
            )
        return local_id

    async def test_retry_failed_job_keeps_manifest_and_queues_new_job(self):
        old_id = self.make_failed_video_job(files=[b"first"])
        response = await self.client.post(f"/api/jobs/{old_id}/retry")
        self.assertEqual(response.status_code, 202, response.text)
        payload = response.json()
        self.assertNotEqual(payload["id"], old_id)
        self.assertTrue(payload["id"].startswith("video_job_"))
        self.assertEqual(payload["status"], "queued")
        self.assertEqual(payload["task_type"], "fl2va")
        old_row = self.gateway.get_job_row(old_id)
        new_row = self.gateway.get_job_row(payload["id"])
        self.assertEqual(json.loads(new_row["request_json"]), json.loads(old_row["request_json"]))
        self.assertEqual(new_row["upstream_base"], old_row["upstream_base"])
        self.assertEqual(new_row["user_id"], old_row["user_id"])
        queued_retry = await self.client.post(f"/api/jobs/{payload['id']}/retry")
        self.assertEqual(queued_retry.status_code, 409, queued_retry.text)

    async def test_retry_missing_files_rejected(self):
        old_id = self.make_failed_video_job(files=[b"first"])
        (self.gateway.QUEUE_DIR / old_id / "upload_0.png").unlink()
        response = await self.client.post(f"/api/jobs/{old_id}/retry")
        self.assertEqual(response.status_code, 400, response.text)
        self.assertIn("素材", response.json()["detail"])

    async def test_retry_other_user_job_hidden(self):
        old_id = self.make_failed_video_job(files=[b"first"])
        with patch.object(
            self.gateway, "current_user", return_value={"id": 999, "username": "other", "role": "user"}
        ):
            response = await self.client.post(f"/api/jobs/{old_id}/retry")
        self.assertEqual(response.status_code, 404, response.text)

    async def test_admin_reset_password(self):
        created = await self.client.post(
            "/api/admin/users", json={"username": "reset-me", "password": "orig-pass-123"}
        )
        self.assertEqual(created.status_code, 201, created.text)
        user_id = created.json()["user"]["id"]

        short = await self.client.post(f"/api/admin/users/{user_id}/password", json={"password": "short"})
        self.assertEqual(short.status_code, 400, short.text)

        missing = await self.client.post("/api/admin/users/40404/password", json={"password": "new-pass-123"})
        self.assertEqual(missing.status_code, 404, missing.text)

        reset = await self.client.post(f"/api/admin/users/{user_id}/password", json={"password": "new-pass-123"})
        self.assertEqual(reset.status_code, 200, reset.text)

        old_login = await self.client.post(
            "/api/auth/login", json={"username": "reset-me", "password": "orig-pass-123"}
        )
        self.assertEqual(old_login.status_code, 401)
        new_login = await self.client.post(
            "/api/auth/login", json={"username": "reset-me", "password": "new-pass-123"}
        )
        self.assertEqual(new_login.status_code, 200, new_login.text)

    async def test_admin_status_toggle_and_session_revoke(self):
        created = await self.client.post(
            "/api/admin/users", json={"username": "toggle-me", "password": "pass-toggle-1"}
        )
        self.assertEqual(created.status_code, 201, created.text)
        user_id = created.json()["user"]["id"]
        login = await self.client.post(
            "/api/auth/login", json={"username": "toggle-me", "password": "pass-toggle-1"}
        )
        self.assertEqual(login.status_code, 200)
        session_cookie = login.cookies.get("kaishi_session")
        self.assertTrue(session_cookie)

        deactivated = await self.client.post(f"/api/admin/users/{user_id}/status", json={"is_active": False})
        self.assertEqual(deactivated.status_code, 200, deactivated.text)
        # 恢复真实鉴权路径：被停用用户的现有会话必须立即失效
        self.auth.stop()
        blocked = await self.client.get(
            "/api/auth/me", headers={"Cookie": f"kaishi_session={session_cookie}"}
        )
        relogin = await self.client.post(
            "/api/auth/login", json={"username": "toggle-me", "password": "pass-toggle-1"}
        )
        self.auth.start()
        self.assertEqual(blocked.status_code, 401)
        self.assertEqual(relogin.status_code, 401)

        reactivated = await self.client.post(f"/api/admin/users/{user_id}/status", json={"is_active": True})
        self.assertEqual(reactivated.status_code, 200, reactivated.text)
        restored = await self.client.post(
            "/api/auth/login", json={"username": "toggle-me", "password": "pass-toggle-1"}
        )
        self.assertEqual(restored.status_code, 200, restored.text)

    async def test_admin_protections(self):
        self_response = await self.client.post("/api/admin/users/1/status", json={"is_active": False})
        self.assertEqual(self_response.status_code, 400, self_response.text)
        self.assertIn("当前登录", self_response.json()["detail"])

        second_admin = await self.client.post(
            "/api/admin/users",
            json={"username": "second-admin", "password": "admin-pass-123", "role": "admin"},
        )
        self.assertEqual(second_admin.status_code, 201, second_admin.text)
        admin_id = second_admin.json()["user"]["id"]
        # 仍有其他活跃管理员时，停用第二管理员允许
        deactivated = await self.client.post(f"/api/admin/users/{admin_id}/status", json={"is_active": False})
        self.assertEqual(deactivated.status_code, 200, deactivated.text)
        # 停用后该管理员无法登录
        self.auth.stop()
        login = await self.client.post(
            "/api/auth/login", json={"username": "second-admin", "password": "admin-pass-123"}
        )
        self.auth.start()
        self.assertEqual(login.status_code, 401)

    async def test_admin_endpoints_forbidden_for_regular_user(self):
        with patch.object(
            self.gateway, "current_user", return_value={"id": 999, "username": "other", "role": "user"}
        ):
            password = await self.client.post("/api/admin/users/1/password", json={"password": "new-pass-123"})
            status = await self.client.post("/api/admin/users/1/status", json={"is_active": False})
        self.assertEqual(password.status_code, 403, password.text)
        self.assertEqual(status.status_code, 403, status.text)


if __name__ == "__main__":
    unittest.main()
