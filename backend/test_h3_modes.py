import json
import os
import tempfile


test_root = tempfile.TemporaryDirectory(prefix="kaishi-h3-test-")
os.environ["KAISHI_BASE_DIR"] = test_root.name

import app  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402


async def idle_dispatcher():
    import asyncio

    await asyncio.Event().wait()


app.dispatcher_loop = idle_dispatcher
app.init_db()
credentials = dict(
    line.split("=", 1)
    for line in (app.DATA_DIR / "initial_admin_credentials.txt").read_text().splitlines()
)

with TestClient(app.app) as client:
    login = client.post("/api/auth/login", json=credentials)
    assert login.status_code == 200
    current_admin_id = login.json()["user"]["id"]
    key_response = client.post("/api/auth/api-key")
    assert key_response.status_code == 200, key_response.text
    api_key = key_response.json()["api_key"]
    bearer = {"Authorization": f"Bearer {api_key}"}
    assert client.get("/api/auth/me", headers=bearer).status_code == 200

    created_user = client.post(
        "/api/admin/users",
        json={"username": "delete-me", "password": "test-pass-123", "role": "user"},
    )
    assert created_user.status_code == 201, created_user.text
    deleted_user_id = created_user.json()["user"]["id"]
    deleted_user = client.delete(f"/api/admin/users/{deleted_user_id}")
    assert deleted_user.status_code == 200, deleted_user.text
    assert client.post(
        "/api/auth/login",
        json={"username": "delete-me", "password": "test-pass-123"},
    ).status_code == 401
    assert client.delete(f"/api/admin/users/{current_admin_id}").status_code == 400

    t2va = client.post(
        "/api/v1/generations",
        headers=bearer,
        data={
            "task_type": "t2va",
            "prompt": "测试文本生成音视频",
            "seconds": "4",
            "num_inference_steps": "5",
            "size": "768x1344",
            "aspect_ratio": "16:9",
        },
    )
    assert t2va.status_code == 202, t2va.text

    fl2va = client.post(
        "/api/jobs",
        data={"task_type": "fl2va", "frame_mode": "first_last", "prompt": "测试首尾帧", "seconds": "4"},
        files=[
            ("input_references", ("first.png", b"first", "image/png")),
            ("input_references", ("last.png", b"last", "image/png")),
        ],
    )
    assert fl2va.status_code == 202, fl2va.text

    ref2va = client.post(
        "/api/jobs",
        data={"task_type": "ref2va", "prompt": "测试多参考", "seconds": "4"},
        files=[
            ("input_references", ("one.png", b"one", "image/png")),
            ("input_references", ("motion.mp4", b"video", "video/mp4")),
            ("input_references", ("voice.wav", b"audio", "audio/wav")),
        ],
    )
    assert ref2va.status_code == 202, ref2va.text

    too_many = client.post(
        "/api/jobs",
        data={"task_type": "ref2va", "prompt": "超过图片上限", "seconds": "4"},
        files=[
            ("input_references", (f"{index}.png", str(index).encode(), "image/png"))
            for index in range(10)
        ],
    )
    assert too_many.status_code == 400, too_many.text
    assert "图片≤9" in too_many.text

    audio_only = client.post(
        "/api/jobs",
        data={"task_type": "ref2va", "prompt": "只有音频", "seconds": "4"},
        files={"input_references": ("voice.mp3", b"audio", "audio/mpeg")},
    )
    assert audio_only.status_code == 400, audio_only.text
    assert "必须与图片或视频" in audio_only.text

    for response, expected, expected_files in (
        (t2va, "t2va", 0),
        (fl2va, "fl2va", 2),
        (ref2va, "ref2va", 3),
    ):
        row = app.get_job_row(response.json()["id"])
        manifest = json.loads(row["request_json"])
        fields = dict(manifest["fields"])
        extra = json.loads(fields["extra_params"])
        assert row["task_type"] == expected
        assert extra["task"] == expected
        assert extra["duration"] == 4.0
        assert len(manifest["files"]) == expected_files

    fl_manifest = json.loads(app.get_job_row(fl2va.json()["id"])["request_json"])
    assert json.loads(dict(fl_manifest["fields"])["extra_params"])["frame_indices"] == [0, -1]

    t2_fields = dict(json.loads(app.get_job_row(t2va.json()["id"])["request_json"])["fields"])
    assert t2_fields["width"] == "768" and t2_fields["height"] == "1344"
    assert t2_fields["aspect_ratio"] == "9:16"

    ref_manifest = json.loads(app.get_job_row(ref2va.json()["id"])["request_json"])
    assert [item["media_kind"] for item in ref_manifest["files"]] == ["image", "video", "audio"]

    assert client.delete("/api/auth/api-key").status_code == 200
    assert client.get("/api/auth/me", headers=bearer).status_code == 401

print("T2VA/FL2VA/Ref2VA request assembly tests passed")
