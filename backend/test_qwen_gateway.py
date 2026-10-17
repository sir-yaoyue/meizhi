"""Isolated gateway tests: never call a model or use the production database."""
import base64
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import AsyncMock, patch

import httpx


class QwenGatewayTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="qwen-gateway-test-")
        with patch.dict(os.environ, {"KAISHI_BASE_DIR": self.temp.name}):
            spec = importlib.util.spec_from_file_location("qwen_test_app", Path(__file__).with_name("app.py"))
            self.gateway = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(self.gateway)
        self.gateway.init_db()
        self.user = {"id": 1, "username": "test-admin", "role": "admin"}
        self.auth = patch.object(self.gateway, "current_user", return_value=self.user)
        self.auth.start()
        self.model_check = patch.object(self.gateway, "require_image_model", AsyncMock())
        self.model_check.start()
        self.client = httpx.AsyncClient(transport=httpx.ASGITransport(app=self.gateway.app), base_url="http://test")

    async def asyncTearDown(self):
        await self.client.aclose()
        self.auth.stop()
        self.model_check.stop()
        self._release_temp()

    def _release_temp(self):
        # 释放可能残留的 sqlite 句柄（Windows 上打开中的文件无法删除）
        try:
            conn = self.gateway.db_connect()
            conn.execute("PRAGMA wal_checkpoint(TRUNCATE)")
            conn.close()
        except Exception:
            pass
        import gc
        import time
        gc.collect()
        for _ in range(20):
            try:
                self.temp.cleanup()
                return
            except PermissionError:
                time.sleep(0.1)
            gc.collect()

    def _symlink_capable(self) -> bool:
        probe = Path(self.temp.name) / "symlink-probe"
        target = Path(self.temp.name) / "symlink-probe-target"
        target.write_bytes(b"x")
        try:
            probe.symlink_to(target)
            probe.unlink()
            return True
        except OSError:
            return False
        finally:
            target.unlink(missing_ok=True)

    async def submit(self, **params):
        return await self.client.post("/api/qwen-image-jobs", json={"prompt": "中文海报：美超科技", **params})

    async def test_generate_routes_to_qwen_and_saves_authorized_output(self):
        response = await self.submit(model="wrong-model")
        self.assertEqual(response.status_code, 202, response.text)
        job_id = response.json()["id"]
        row = self.gateway.get_job_row(job_id)
        self.assertEqual(row["upstream_base"], "http://127.0.0.1:8001")
        manifest = json.loads(row["request_json"])
        self.assertEqual(manifest["json"]["model"], "Qwen-Image-2.1")
        self.assertEqual(manifest["json"]["num_inference_steps"], 50)
        self.assertEqual(manifest["json"]["true_cfg_scale"], 1.0)
        mock = AsyncMock(return_value={"data": [{"b64_json": base64.b64encode(b"test-png").decode()}], "output_format": "png"})
        with patch.object(self.gateway, "upstream_json", mock):
            await self.gateway.dispatch_job(job_id)
        self.assertEqual(mock.call_args.args, ("POST", "/v1/images/generations"))
        self.assertEqual(mock.call_args.kwargs["base_url"], "http://127.0.0.1:8001")
        self.assertEqual(mock.call_args.kwargs["json"]["prompt"], "中文海报：美超科技")
        result = (await self.client.get(f"/api/jobs/{job_id}")).json()
        self.assertEqual(result["status"], "completed")
        output = await self.client.get(result["outputs"][0]["url"])
        self.assertEqual(output.status_code, 200)
        self.assertTrue(output.headers["x-accel-redirect"].startswith("/protected-images/"))
        with patch.object(self.gateway, "current_user", return_value={"id": 999, "role": "user"}):
            self.assertEqual((await self.client.get(result["outputs"][0]["url"])).status_code, 404)

    async def test_edit_upload_order_is_preserved_as_files(self):
        response = await self.client.post(
            "/api/qwen-image-jobs",
            data={"mode": "edit", "prompt": "将第1张图片的人物放入第2张图片", "size": "1024x1024"},
            files=[("image", ("first.png", b"first-image", "image/png")),
                   ("image", ("second.png", b"second-image", "image/png"))],
        )
        self.assertEqual(response.status_code, 202, response.text)
        mock = AsyncMock(return_value={"data": [{"b64_json": base64.b64encode(b"edited-png").decode()}]})
        with patch.object(self.gateway, "upstream_json", mock):
            await self.gateway.dispatch_job(response.json()["id"])
        self.assertEqual(mock.call_args.args, ("POST", "/v1/images/edits"))
        files = mock.call_args.kwargs["files"]
        images = [value for key, value in files if key == "image"]
        self.assertEqual([value[1] for value in images], [b"first-image", b"second-image"])
        self.assertTrue(all(value[2] == "image/png" for value in images))
        prompt = next(value for key, value in files if key == "prompt")
        self.assertIsNone(prompt[0])
        self.assertIn("第1张图片", prompt[1])

    async def test_validation_and_unauthenticated_access(self):
        for values in ({"size": "1000x1000"}, {"size": "9000x1024"}, {"n": 0},
                       {"num_inference_steps": 201}, {"seed": 1.5}, {"true_cfg_scale": "nan"},
                       {"negative_prompt": "模糊"}, {"true_cfg_scale": 4}, {"mode": "edit"}):
            response = await self.submit(**values)
            self.assertEqual(response.status_code, 400, (values, response.text))
        self.assertEqual((await self.submit(negative_prompt="模糊", true_cfg_scale=4)).status_code, 202)
        self.auth.stop()
        self.assertEqual((await self.submit()).status_code, 401)

    async def test_z_image_routes_and_persists_output(self):
        response = await self.client.post("/api/z-image-jobs", json={"prompt": "中文海报", "model": "wrong"})
        self.assertEqual(response.status_code, 202, response.text)
        job_id = response.json()["id"]
        row = self.gateway.get_job_row(job_id)
        self.assertEqual(row["task_type"], "z_image_base_text_to_image")
        self.assertEqual(row["upstream_base"], "http://127.0.0.1:8003")
        params = json.loads(row["request_json"])["json"]
        self.assertEqual(params["model"], "Z-Image")
        self.assertEqual(params["num_inference_steps"], 50)
        self.assertEqual(params["size"], "1024x1024")
        self.assertEqual(params["guidance_scale"], 4)
        self.assertNotIn("true_cfg_scale", params)
        self.assertNotIn("output_compression", params)
        mock = AsyncMock(return_value={"data": [{"b64_json": base64.b64encode(b"z-image-png").decode()}]})
        with patch.object(self.gateway, "upstream_json", mock):
            await self.gateway.dispatch_job(job_id)
        self.assertEqual(mock.call_args.args, ("POST", "/v1/images/generations"))
        self.assertEqual(mock.call_args.kwargs["base_url"], "http://127.0.0.1:8003")
        job = (await self.client.get(f"/api/jobs/{job_id}")).json()
        self.assertEqual(job["status"], "completed")
        self.assertEqual((await self.client.get(job["outputs"][0]["url"])).status_code, 200)
        self.assertEqual(self.gateway.model_log_path("z_image_base_text_to_image"), self.gateway.Z_IMAGE_LOG_PATH)
        self.assertEqual(self.gateway.model_log_path("z_image_text_to_image"), Path("/tmp/z-image-turbo.log"))

    async def test_z_image_rejects_invalid_parameters(self):
        for params in ({"mode": "edit"}, {"true_cfg_scale": 4}, {"guidance_scale": "nan"}, {"guidance_scale": 21}, {"num_inference_steps": 201}):
            response = await self.client.post("/api/z-image-jobs", json={"prompt": "测试", **params})
            self.assertEqual(response.status_code, 400, response.text)
        self.auth.stop()
        self.assertEqual((await self.client.post("/api/z-image-jobs", json={"prompt": "测试"})).status_code, 401)

    async def test_z_image_single_reference_multipart_and_strength(self):
        response = await self.client.post("/api/z-image-jobs",
            data={"mode": "edit", "prompt": "将画面变为水彩风格", "strength": "0.6", "num_inference_steps": "9",
                  "generator_device": "cpu", "output_format": "webp", "output_compression": "95", "size": "1040x768", "guidance_scale": "3.5", "negative_prompt": "模糊"},
            files=[("image", ("reference.png", b"single-reference", "image/png"))])
        self.assertEqual(response.status_code, 202, response.text)
        job_id = response.json()["id"]
        row = self.gateway.get_job_row(job_id)
        self.assertEqual(row["task_type"], "z_image_base_image_to_image")
        self.assertEqual(self.gateway.model_log_path(row["task_type"]), self.gateway.Z_IMAGE_LOG_PATH)
        clean = json.loads(row["request_json"])["json"]
        self.assertEqual(clean["strength"], 0.6)
        self.assertEqual(clean["generator_device"], "cpu")
        self.assertEqual(clean["output_compression"], 95)
        self.assertEqual(clean["guidance_scale"], 3.5)
        self.assertEqual(clean["negative_prompt"], "模糊")
        mock = AsyncMock(return_value={"data": [{"b64_json": base64.b64encode(b"redrawn-webp").decode()}], "output_format": "webp"})
        with patch.object(self.gateway, "upstream_json", mock):
            await self.gateway.dispatch_job(job_id)
        self.assertEqual(mock.call_args.args, ("POST", "/v1/images/edits"))
        self.assertEqual(mock.call_args.kwargs["base_url"], "http://127.0.0.1:8003")
        parts = mock.call_args.kwargs["files"]
        self.assertEqual([value[1] for key, value in parts if key == "image"], [b"single-reference"])
        self.assertEqual(next(value[1] for key, value in parts if key == "strength"), "0.6")
        self.assertEqual((await self.client.get(f"/api/jobs/{job_id}")).json()["status"], "completed")

    async def test_z_image_rejects_multiple_references_and_bad_strength(self):
        files = [("image", ("a.png", b"image-a", "image/png")), ("image", ("b.png", b"image-b", "image/png"))]
        response = await self.client.post("/api/z-image-jobs", data={"mode": "edit", "prompt": "测试"}, files=files)
        self.assertEqual(response.status_code, 400)
        for strength in ("nan", "0", "1.1", "0.01", "bad"):
            response = await self.client.post("/api/z-image-jobs", data={"mode": "edit", "prompt": "测试", "strength": strength}, files=files[:1])
            self.assertEqual(response.status_code, 400, (strength, response.text))
        for values in ({"strength": 0.6}, {"generator_device": "gpu"}, {"mask_image": "bad"}, {"flow_shift": 3}):
            response = await self.client.post("/api/z-image-jobs", json={"prompt": "测试", **values})
            self.assertEqual(response.status_code, 400, response.text)
        with self.gateway.db_connect() as conn:
            self.assertEqual(conn.execute("SELECT COUNT(*) FROM jobs").fetchone()[0], 0)

    async def test_wrong_model_is_rejected_before_queueing(self):
        self.model_check.stop()
        with patch.object(self.gateway, "upstream_json", AsyncMock(return_value={"data": [{"id": "Z-Image-Turbo"}]})):
            response = await self.submit()
        self.assertEqual(response.status_code, 503)
        with self.gateway.db_connect() as conn:
            self.assertEqual(conn.execute("SELECT COUNT(*) FROM jobs").fetchone()[0], 0)

    def completed_video(self, job_id="video_delete_fixture", status="completed", result_type="video"):
        target = self.gateway.VIDEO_DIR / f"{job_id}.mp4"
        target.write_bytes(b"test-video-only")
        with self.gateway.db_connect() as conn:
            conn.execute("INSERT INTO jobs (id,status,prompt,model,progress,created_at,updated_at,user_id,task_type,result_type,video_path) VALUES (?,?,?,?,100,1,1,1,'t2va',?,?)",
                         (job_id,status,"test","MiniMaxH3",result_type,str(target)))
        return target

    async def test_delete_completed_video_removes_only_owned_output_and_record(self):
        target = self.completed_video()
        other = self.gateway.VIDEO_DIR / "unrelated.mp4"
        other.write_bytes(b"keep")
        with patch.object(self.gateway, "current_user", return_value={"id": 1, "role": "user"}):
            response = await self.client.delete("/api/jobs/video_delete_fixture/video")
        self.assertEqual(response.status_code, 200, response.text)
        self.assertFalse(target.exists())
        self.assertIsNone(self.gateway.get_job_row("video_delete_fixture"))
        self.assertEqual(other.read_bytes(), b"keep")
        self.assertEqual((await self.client.delete("/api/jobs/video_delete_fixture/video")).status_code, 404)
        self.assertEqual((await self.client.get("/api/jobs/video_delete_fixture/download")).status_code, 404)
        with self.assertRaisesRegex(RuntimeError, "任务已删除"):
            await self.gateway.save_completed_video("video_delete_fixture", "never-call-upstream")

    async def test_video_deletion_authorization_and_active_task_protection(self):
        target = self.completed_video()
        with patch.object(self.gateway, "current_user", return_value={"id": 999, "role": "user"}):
            self.assertEqual((await self.client.delete("/api/jobs/video_delete_fixture/video")).status_code, 404)
        self.assertTrue(target.exists())
        for job_id,status,result_type in (("video_running", "in_progress", "video"), ("video_queued", "queued", "video"), ("image_done", "completed", "image")):
            path = self.completed_video(job_id,status,result_type)
            self.assertEqual((await self.client.delete(f"/api/jobs/{job_id}/video")).status_code, 409)
            self.assertTrue(path.exists())
        self.auth.stop()
        self.assertEqual((await self.client.delete("/api/jobs/video_delete_fixture/video")).status_code, 401)

    async def test_video_deletion_rejects_outside_path_and_rolls_back_on_failure(self):
        if not self._symlink_capable():
            self.skipTest("当前系统不允许创建符号链接（如未提权的 Windows）")
        target = self.completed_video()
        outside = Path(self.temp.name) / "outside.mp4"
        outside.write_bytes(b"keep-outside")
        with self.gateway.db_connect() as conn:
            conn.execute("UPDATE jobs SET video_path=? WHERE id='video_delete_fixture'", (str(outside),))
        self.assertEqual((await self.client.delete("/api/jobs/video_delete_fixture/video")).status_code, 409)
        self.assertEqual(outside.read_bytes(), b"keep-outside")
        with self.gateway.db_connect() as conn:
            conn.execute("UPDATE jobs SET video_path=? WHERE id='video_delete_fixture'", (str(target),))
        target.unlink();target.symlink_to(outside)
        self.assertEqual((await self.client.delete("/api/jobs/video_delete_fixture/video")).status_code, 409)
        target.unlink();target.write_bytes(b"test-video-only")
        with patch.object(Path, "unlink", side_effect=PermissionError("test denial")):
            self.assertEqual((await self.client.delete("/api/jobs/video_delete_fixture/video")).status_code, 500)
        self.assertIsNotNone(self.gateway.get_job_row("video_delete_fixture"))
        self.assertTrue(target.exists())

    def completed_images(self):
        job_id = "image_delete_fixture"
        paths = [self.gateway.IMAGE_DIR / f"{job_id}_{i}.png" for i in range(2)]
        for path in paths:
            path.write_bytes(b"fixture-image")
        with self.gateway.db_connect() as conn:
            conn.execute("INSERT INTO jobs (id,status,prompt,model,progress,created_at,updated_at,user_id,task_type,result_type,result_paths) VALUES (?,'completed','test','Z-Image',100,1,1,1,'z_image_base_text_to_image','image',?)",
                         (job_id,json.dumps([str(p) for p in paths])))
        return job_id, paths

    async def test_delete_all_completed_images_and_preserve_other_outputs(self):
        job_id, paths = self.completed_images()
        other = self.gateway.IMAGE_DIR / "unrelated.png"
        other.write_bytes(b"keep")
        with patch.object(self.gateway, "current_user", return_value={"id": 1, "role": "user"}):
            response = await self.client.delete(f"/api/jobs/{job_id}/images")
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json()["image_count"], 2)
        self.assertTrue(all(not path.exists() for path in paths))
        self.assertEqual(other.read_bytes(), b"keep")
        self.assertIsNone(self.gateway.get_job_row(job_id))
        self.assertEqual((await self.client.get(f"/api/jobs/{job_id}/outputs/0")).status_code, 404)

    async def test_image_deletion_permissions_status_and_all_paths_validated_first(self):
        job_id, paths = self.completed_images()
        with patch.object(self.gateway, "current_user", return_value={"id": 999, "role": "user"}):
            self.assertEqual((await self.client.delete(f"/api/jobs/{job_id}/images")).status_code, 404)
        with self.gateway.db_connect() as conn:
            conn.execute("UPDATE jobs SET status='in_progress' WHERE id=?", (job_id,))
        self.assertEqual((await self.client.delete(f"/api/jobs/{job_id}/images")).status_code, 409)
        outside = Path(self.temp.name) / "outside.png"
        outside.write_bytes(b"keep")
        with self.gateway.db_connect() as conn:
            conn.execute("UPDATE jobs SET status='completed',result_paths=? WHERE id=?", (json.dumps([str(paths[0]),str(outside)]),job_id))
        self.assertEqual((await self.client.delete(f"/api/jobs/{job_id}/images")).status_code, 409)
        self.assertTrue(all(path.exists() for path in paths))
        self.assertTrue(outside.exists())
        with self.gateway.db_connect() as conn:
            conn.execute("UPDATE jobs SET result_paths=? WHERE id=?", (json.dumps([str(p) for p in paths]),job_id))
        with patch.object(Path, "unlink", side_effect=PermissionError("fixture")):
            self.assertEqual((await self.client.delete(f"/api/jobs/{job_id}/images")).status_code, 500)
        self.assertIsNotNone(self.gateway.get_job_row(job_id))
        self.assertTrue(all(path.exists() for path in paths))
        self.auth.stop()
        self.assertEqual((await self.client.delete(f"/api/jobs/{job_id}/images")).status_code, 401)

    async def test_qwen_runtime_uses_qwen_log_only(self):
        response = await self.submit()
        job_id = response.json()["id"]
        qwen_log = Path(self.temp.name) / "qwen.log"
        qwen_log.write_text("0%| | 0/50 [00:00]\n20%|xx| 10/50 [00:01]\n")
        with self.gateway.db_connect() as conn:
            conn.execute("UPDATE jobs SET status='in_progress', log_start_offset=0 WHERE id=?", (job_id,))
        with patch.object(self.gateway, "QWEN_IMAGE_LOG_PATH", qwen_log):
            runtime = (await self.client.get(f"/api/jobs/{job_id}/runtime")).json()
        self.assertEqual(runtime["step"], 10)
        self.assertEqual(runtime["total_steps"], 50)
        self.assertEqual(runtime["source"], "model_log")
        self.assertEqual((await self.client.delete(f"/api/jobs/{job_id}")).status_code, 409)


if __name__ == "__main__":
    unittest.main()
