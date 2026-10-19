"""Isolated gateway tests for multi-turn conversations. Never calls a model or uses the production database."""
import importlib.util
import json
import os
import tempfile
import time
import unittest
from pathlib import Path
from unittest.mock import patch

import httpx

CONV_ID = "conv_test_0001"


class ConversationTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="kaishi-conv-test-")
        with patch.dict(os.environ, {"KAISHI_BASE_DIR": self.temp.name}):
            spec = importlib.util.spec_from_file_location("conv_test_app", Path(__file__).with_name("app.py"))
            self.gateway = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(self.gateway)
        self.gateway.init_db()
        self.user = {"id": 1, "username": "test-admin", "role": "admin"}
        self.auth = patch.object(self.gateway, "current_user", return_value=self.user)
        self.auth.start()
        self.client = httpx.AsyncClient(
            transport=httpx.ASGITransport(app=self.gateway.app), base_url="http://test"
        )

    async def asyncTearDown(self):
        await self.client.aclose()
        self.auth.stop()
        self._release_temp()

    def _release_temp(self):
        try:
            conn = self.gateway.db_connect()
            conn.execute("PRAGMA wal_checkpoint(TRUNCATE)")
            conn.close()
        except Exception:
            pass
        import gc

        gc.collect()
        for _ in range(20):
            try:
                self.temp.cleanup()
                return
            except PermissionError:
                time.sleep(0.1)
            gc.collect()

    async def submit_video_job(self, conversation_id=None, prompt="测试对话任务"):
        data = {"task_type": "t2va", "prompt": prompt, "seconds": "4"}
        if conversation_id:
            data["conversation_id"] = conversation_id
        response = await self.client.post("/api/jobs", data=data)
        self.assertEqual(response.status_code, 202, response.text)
        return response.json()

    async def make_completed_video_job(self, conversation_id, prompt="已完成的对话任务"):
        gw = self.gateway
        local_id = f"video_job_{os.urandom(8).hex()}"
        now = int(time.time())
        video_file = gw.VIDEO_DIR / f"{local_id}.mp4"
        video_file.write_bytes(b"fake-mp4")
        with gw.db_connect() as conn:
            conn.execute(
                """
                INSERT INTO jobs (
                    id, status, prompt, model, progress, created_at, updated_at, completed_at,
                    user_id, request_json, task_type, result_type, upstream_base, conversation_id, video_path
                ) VALUES (?, 'completed', ?, 'MiniMaxH3', 100, ?, ?, ?, 1, '{}', 't2va', 'video', ?, ?, ?)
                """,
                (local_id, prompt, now - 60, now - 50, now - 50, gw.FL2VA_UPSTREAM, conversation_id, str(video_file)),
            )
        return local_id, video_file

    async def test_submit_with_conversation_creates_and_groups(self):
        first = await self.submit_video_job(CONV_ID, "第一轮：雪山攀登")
        second = await self.submit_video_job(CONV_ID, "第二轮：镜头拉近")
        self.assertEqual(first["conversation_id"], CONV_ID)
        self.assertEqual(second["conversation_id"], CONV_ID)
        row = self.gateway.get_job_row(first["id"])
        self.assertEqual(row["conversation_id"], CONV_ID)
        # 对话行懒创建，标题取首轮提示词
        with self.gateway.db_connect() as conn:
            conv_row = conn.execute(
                "SELECT * FROM conversations WHERE id = ?", (CONV_ID,)
            ).fetchone()
        self.assertIsNotNone(conv_row)
        self.assertEqual(conv_row["title"], "第一轮：雪山攀登")
        listing = (await self.client.get("/api/conversations")).json()["data"]
        entry = next(item for item in listing if item["id"] == CONV_ID)
        self.assertEqual(entry["turn_count"], 2)
        self.assertEqual(entry["latest_status"], "queued")
        detail = (await self.client.get(f"/api/conversations/{CONV_ID}")).json()
        self.assertEqual([job["prompt"] for job in detail["data"]], ["第一轮：雪山攀登", "第二轮：镜头拉近"])
        self.assertEqual(detail["conversation"]["title"], "第一轮：雪山攀登")

    async def test_submit_without_conversation_and_invalid_id(self):
        plain = await self.submit_video_job(None, "无对话任务")
        self.assertIsNone(plain["conversation_id"])
        bad = await self.client.post("/api/jobs", data={"task_type": "t2va", "prompt": "x", "conversation_id": "bad id!"})
        self.assertEqual(bad.status_code, 400, bad.text)
        too_short = await self.client.post("/api/jobs", data={"task_type": "t2va", "prompt": "x", "conversation_id": "abc"})
        self.assertEqual(too_short.status_code, 400, too_short.text)
        listings = (await self.client.get("/api/conversations")).json()["data"]
        self.assertEqual(listings, [])

    async def test_retry_inherits_conversation(self):
        job = await self.submit_video_job(CONV_ID, "可重试任务")
        with self.gateway.db_connect() as conn:
            conn.execute("UPDATE jobs SET status = 'failed' WHERE id = ?", (job["id"],))
        retry = await self.client.post(f"/api/jobs/{job['id']}/retry")
        self.assertEqual(retry.status_code, 202, retry.text)
        self.assertEqual(retry.json()["conversation_id"], CONV_ID)
        detail = (await self.client.get(f"/api/conversations/{CONV_ID}")).json()
        self.assertEqual(detail["conversation"]["turn_count"] if "turn_count" in detail["conversation"] else len(detail["data"]), 2)

    async def test_rename_title_validation_and_permission(self):
        await self.submit_video_job(CONV_ID, "改名测试")
        ok = await self.client.post(f"/api/conversations/{CONV_ID}/title", json={"title": "我的雪山故事"})
        self.assertEqual(ok.status_code, 200, ok.text)
        self.assertEqual(ok.json()["title"], "我的雪山故事")
        bad = await self.client.post(f"/api/conversations/{CONV_ID}/title", json={"title": ""})
        self.assertEqual(bad.status_code, 400, bad.text)
        other_user = {"id": 999, "username": "other", "role": "user"}
        with patch.object(self.gateway, "current_user", return_value=other_user):
            forbidden = await self.client.post(f"/api/conversations/{CONV_ID}/title", json={"title": "hacked"})
            missing = await self.client.get(f"/api/conversations/{CONV_ID}")
        # 非所有者一律 404（不泄露对话存在性）
        self.assertEqual(forbidden.status_code, 404, forbidden.text)
        self.assertEqual(missing.status_code, 404, missing.text)

    async def test_delete_blocked_while_active_then_cascades_files(self):
        job, video_file = await self.make_completed_video_job(CONV_ID)
        queued = await self.submit_video_job(CONV_ID, "还在排队的任务")
        blocked = await self.client.delete(f"/api/conversations/{CONV_ID}")
        self.assertEqual(blocked.status_code, 409, blocked.text)
        self.assertTrue(video_file.exists())
        with self.gateway.db_connect() as conn:
            conn.execute("UPDATE jobs SET status = 'cancelled', error = '任务已取消', completed_at = ?, updated_at = ? WHERE id = ?",
                         (int(time.time()), int(time.time()), queued["id"]))
        deleted = await self.client.delete(f"/api/conversations/{CONV_ID}")
        self.assertEqual(deleted.status_code, 200, deleted.text)
        self.assertEqual(deleted.json()["deleted_jobs"], 2)
        self.assertEqual(deleted.json()["deleted_files"], 1)
        self.assertFalse(video_file.exists())
        self.assertIsNone(self.gateway.get_job_row(job))
        self.assertIsNone(self.gateway.get_job_row(queued["id"]))
        listings = (await self.client.get("/api/conversations")).json()["data"]
        self.assertEqual(listings, [])

    async def test_qwen_json_conversation_not_forwarded_upstream(self):
        response = await self.client.post(
            "/api/qwen-image-jobs",
            json={"mode": "generate", "prompt": "对话图像测试", "size": "1024x1024", "conversation_id": CONV_ID},
        )
        # 图像接口会先检查上游模型可用性；本机没有模型，预期 503 —— 但 conversation 行不应被创建
        self.assertIn(response.status_code, (201, 202, 503), response.text)
        with self.gateway.db_connect() as conn:
            conv_row = conn.execute(
                "SELECT title FROM conversations WHERE id = ?", (CONV_ID,)
            ).fetchone()
        if response.status_code in (201, 202):
            job = response.json()
            self.assertEqual(job["conversation_id"], CONV_ID)
            row = self.gateway.get_job_row(job["id"])
            manifest = json.loads(row["request_json"])
            self.assertNotIn("conversation_id", manifest["json"], "conversation_id 不应转发给上游")
            self.assertEqual(conv_row["title"], "对话图像测试")
        else:
            self.assertIsNone(conv_row, "上游不可用时不应创建对话")


if __name__ == "__main__":
    unittest.main()
