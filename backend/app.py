from __future__ import annotations

import asyncio
import base64
import hashlib
import hmac
import json
import logging
import math
import os
import re
import secrets
import sqlite3
import time
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any
from urllib.parse import quote

import aiofiles
import httpx
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from starlette.datastructures import UploadFile


BASE_DIR = Path(os.getenv("KAISHI_BASE_DIR", "/data/kaishi_h3"))
DATA_DIR = BASE_DIR / "data"
VIDEO_DIR = BASE_DIR / "videos"
IMAGE_DIR = BASE_DIR / "images"
QUEUE_DIR = DATA_DIR / "queue"
DB_PATH = DATA_DIR / "jobs.db"
UPSTREAM = os.getenv("VLLM_OMNI_URL", "http://127.0.0.1:8000").rstrip("/")
FL2VA_UPSTREAM = os.getenv("VLLM_OMNI_FL2VA_URL", UPSTREAM).rstrip("/")
REF2VA_UPSTREAM = os.getenv("VLLM_OMNI_REF2VA_URL", UPSTREAM).rstrip("/")
TEXT2IMAGE_UPSTREAM = os.getenv("VLLM_OMNI_TEXT2IMAGE_URL", UPSTREAM).rstrip("/")
QWEN_IMAGE_UPSTREAM = os.getenv("QWEN_IMAGE_URL", "http://127.0.0.1:8001").rstrip("/")
QWEN_IMAGE_MODEL = os.getenv("QWEN_IMAGE_MODEL", "Qwen-Image-2.1")
QWEN_IMAGE_TASKS = {"qwen_text_to_image", "qwen_image_edit"}
QWEN_IMAGE_LOG_PATH = Path(os.getenv("QWEN_IMAGE_LOG_PATH", "/tmp/qwen-image21.log"))
Z_IMAGE_UPSTREAM = os.getenv("Z_IMAGE_URL", "http://127.0.0.1:8003").rstrip("/")
Z_IMAGE_MODEL = os.getenv("Z_IMAGE_MODEL", "Z-Image")
Z_IMAGE_TASKS = {"z_image_text_to_image", "z_image_image_to_image", "z_image_base_text_to_image", "z_image_base_image_to_image"}
Z_IMAGE_LOG_PATH = Path(os.getenv("Z_IMAGE_LOG_PATH", "/tmp/z-image-base.log"))
POLL_SECONDS = float(os.getenv("JOB_POLL_SECONDS", "3"))
DISPATCH_SECONDS = float(os.getenv("QUEUE_DISPATCH_SECONDS", "2"))
MAX_TOTAL_JOBS = int(os.getenv("MAX_TOTAL_QUEUED_JOBS", "300"))
MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", str(256 * 1024 * 1024)))
MAX_IMAGE_BYTES = 30 * 1024 * 1024
MAX_VIDEO_BYTES = 50 * 1024 * 1024
MAX_AUDIO_BYTES = 15 * 1024 * 1024
SESSION_DAYS = int(os.getenv("SESSION_DAYS", "7"))
SESSION_COOKIE = "kaishi_session"
SESSION_SECURE = os.getenv("KAISHI_SESSION_SECURE", "false").lower() == "true"
MODEL_LOG_PATH = Path(os.getenv("VLLM_OMNI_LOG_PATH", "/tmp/h3.log"))
MODEL_LOG_TAIL_BYTES = min(
    max(int(os.getenv("MODEL_LOG_TAIL_BYTES", str(512 * 1024))), 64 * 1024),
    4 * 1024 * 1024,
)
MODEL_LOG_MAX_EVENTS = min(max(int(os.getenv("MODEL_LOG_MAX_EVENTS", "12")), 1), 50)

SAFE_ID = re.compile(r"^[A-Za-z0-9_-]+$")
USERNAME_PATTERN = re.compile(r"^[A-Za-z0-9_.-]{3,32}$")
SIZE_PATTERN = re.compile(r"^\d{2,5}x\d{2,5}$")
ANSI_ESCAPE = re.compile(r"\x1b\[[0-?]*[ -/]*[@-~]")
TQDM_PROGRESS = re.compile(
    r"(?P<percent>\d{1,3})%\|.*?\|\s*(?P<step>\d+)/(?P<total>\d+)\s*\["
)
TERMINAL_STATUSES = {"completed", "failed", "cancelled"}
ACTIVE_STATUSES = {"submitting", "in_progress"}
logger = logging.getLogger("kaishi_h3")

IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"}
VIDEO_SUFFIXES = {".mp4", ".mov"}
AUDIO_SUFFIXES = {".wav", ".mp3"}


def reference_media_kind(filename: str, content_type: str) -> tuple[str | None, int]:
    suffix = Path(filename).suffix.lower()
    mime = content_type.lower().split(";", 1)[0].strip()
    if suffix in IMAGE_SUFFIXES and mime.startswith("image/"):
        return "image", MAX_IMAGE_BYTES
    if suffix in VIDEO_SUFFIXES and mime in {"video/mp4", "video/quicktime"}:
        return "video", MAX_VIDEO_BYTES
    if suffix in AUDIO_SUFFIXES and mime in {"audio/wav", "audio/x-wav", "audio/mpeg", "audio/mp3"}:
        return "audio", MAX_AUDIO_BYTES
    return None, 0


def aspect_ratio_for_dimensions(width: int, height: int) -> str:
    ratio = width / height
    supported = {
        "21:9": 21 / 9,
        "16:9": 16 / 9,
        "4:3": 4 / 3,
        "1:1": 1.0,
        "3:4": 3 / 4,
        "9:16": 9 / 16,
    }
    return min(supported, key=lambda name: abs(supported[name] - ratio))

monitor_tasks: dict[str, asyncio.Task[Any]] = {}
download_locks: dict[str, asyncio.Lock] = {}
dispatcher_task: asyncio.Task[Any] | None = None
dispatcher_wakeup = asyncio.Event()


def db_connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, timeout=30)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA busy_timeout = 30000")
    return conn


def add_column(conn: sqlite3.Connection, name: str, declaration: str) -> None:
    columns = {row["name"] for row in conn.execute("PRAGMA table_info(jobs)")}
    if name not in columns:
        conn.execute(f"ALTER TABLE jobs ADD COLUMN {name} {declaration}")


def password_hash(password: str) -> str:
    if len(password) < 8:
        raise ValueError("密码至少需要 8 个字符")
    iterations = 600_000
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, iterations)
    return "pbkdf2_sha256${}${}${}".format(
        iterations,
        base64.urlsafe_b64encode(salt).decode(),
        base64.urlsafe_b64encode(digest).decode(),
    )


def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, iterations_text, salt_text, digest_text = encoded.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        salt = base64.urlsafe_b64decode(salt_text)
        expected = base64.urlsafe_b64decode(digest_text)
        actual = hashlib.pbkdf2_hmac(
            "sha256", password.encode(), salt, int(iterations_text)
        )
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def create_user(username: str, password: str, role: str = "user") -> int:
    username = username.strip().lower()
    if not USERNAME_PATTERN.fullmatch(username):
        raise ValueError("用户名需为 3-32 位字母、数字、点、横线或下划线")
    if role not in {"admin", "user"}:
        raise ValueError("无效的用户角色")
    encoded = password_hash(password)
    now = int(time.time())
    with db_connect() as conn:
        cursor = conn.execute(
            """
            INSERT INTO users (username, password_hash, role, is_active, created_at)
            VALUES (?, ?, ?, 1, ?)
            """,
            (username, encoded, role, now),
        )
        return int(cursor.lastrowid)


def ensure_bootstrap_admin() -> int:
    with db_connect() as conn:
        row = conn.execute("SELECT id FROM users ORDER BY id LIMIT 1").fetchone()
    if row:
        with db_connect() as conn:
            admin = conn.execute(
                "SELECT id FROM users WHERE role = 'admin' ORDER BY id LIMIT 1"
            ).fetchone()
        return int(admin["id"] if admin else row["id"])

    username = os.getenv("KAISHI_ADMIN_USERNAME", "admin").strip().lower()
    password = os.getenv("KAISHI_ADMIN_PASSWORD") or secrets.token_urlsafe(18)
    admin_id = create_user(username, password, "admin")
    credentials = DATA_DIR / "initial_admin_credentials.txt"
    descriptor = os.open(credentials, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(descriptor, "w", encoding="utf-8") as output:
        output.write(f"username={username}\npassword={password}\n")
    os.chmod(credentials, 0o600)
    return admin_id


def init_db() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    QUEUE_DIR.mkdir(parents=True, exist_ok=True)
    with db_connect() as conn:
        conn.execute("PRAGMA journal_mode = WAL")
        conn.execute("PRAGMA synchronous = NORMAL")
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS jobs (
                id TEXT PRIMARY KEY,
                status TEXT NOT NULL,
                prompt TEXT NOT NULL,
                model TEXT,
                progress INTEGER NOT NULL DEFAULT 0,
                error TEXT,
                upstream_json TEXT,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                completed_at INTEGER,
                inference_time_s REAL,
                video_path TEXT
            )
            """
        )
        for name, declaration in (
            ("log_start_offset", "INTEGER"),
            ("user_id", "INTEGER"),
            ("upstream_id", "TEXT"),
            ("request_json", "TEXT"),
            ("started_at", "INTEGER"),
            ("task_type", "TEXT NOT NULL DEFAULT 'fl2va'"),
            ("result_type", "TEXT NOT NULL DEFAULT 'video'"),
            ("upstream_base", "TEXT"),
            ("result_paths", "TEXT"),
            ("conversation_id", "TEXT"),
        ):
            add_column(conn, name, declaration)
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS conversations (
                id TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                title TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            )
            """
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id, updated_at DESC)"
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user',
                is_active INTEGER NOT NULL DEFAULT 1,
                created_at INTEGER NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS sessions (
                token_hash TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                created_at INTEGER NOT NULL,
                expires_at INTEGER NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS api_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                token_hash TEXT NOT NULL UNIQUE,
                token_prefix TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                last_used_at INTEGER
            )
            """
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC)")
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_jobs_user_created ON jobs(user_id, created_at DESC)"
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_jobs_queue ON jobs(status, created_at)"
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at)")

    admin_id = ensure_bootstrap_admin()
    with db_connect() as conn:
        conn.execute(
            "UPDATE jobs SET user_id = ? WHERE user_id IS NULL", (admin_id,)
        )
        conn.execute(
            "UPDATE jobs SET upstream_id = id WHERE upstream_id IS NULL AND request_json IS NULL"
        )
        conn.execute("DELETE FROM sessions WHERE expires_at <= ?", (int(time.time()),))
        conn.execute("PRAGMA optimize")


def public_user(row: sqlite3.Row | dict[str, Any]) -> dict[str, Any]:
    return {
        "id": int(row["id"]),
        "username": str(row["username"]),
        "role": str(row["role"]),
        "is_active": bool(row["is_active"]),
        "created_at": int(row["created_at"]),
    }


def session_token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def current_user(request: Request) -> dict[str, Any]:
    authorization = request.headers.get("authorization", "")
    if authorization.lower().startswith("bearer "):
        api_key = authorization[7:].strip()
        if not api_key:
            raise HTTPException(status_code=401, detail="API Key 无效")
        now = int(time.time())
        key_hash = session_token_hash(api_key)
        with db_connect() as conn:
            row = conn.execute(
                """
                SELECT u.* FROM api_tokens t
                JOIN users u ON u.id = t.user_id
                WHERE t.token_hash = ? AND u.is_active = 1
                """,
                (key_hash,),
            ).fetchone()
            if row is not None:
                conn.execute(
                    "UPDATE api_tokens SET last_used_at = ? WHERE token_hash = ?",
                    (now, key_hash),
                )
        if row is None:
            raise HTTPException(status_code=401, detail="API Key 无效或已撤销")
        return public_user(row)
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        raise HTTPException(status_code=401, detail="请先登录")
    now = int(time.time())
    with db_connect() as conn:
        row = conn.execute(
            """
            SELECT u.* FROM sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.token_hash = ? AND s.expires_at > ? AND u.is_active = 1
            """,
            (session_token_hash(token), now),
        ).fetchone()
    if row is None:
        raise HTTPException(status_code=401, detail="登录已失效，请重新登录")
    return public_user(row)


def require_admin(user: dict[str, Any]) -> None:
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="需要管理员权限")


def validate_job_id(job_id: str) -> None:
    if not SAFE_ID.fullmatch(job_id):
        raise HTTPException(status_code=400, detail="无效的任务 ID")


def error_text(value: Any) -> str | None:
    if not value:
        return None
    if isinstance(value, str):
        return value
    return json.dumps(value, ensure_ascii=False)


def queue_position(job_id: str) -> int | None:
    with db_connect() as conn:
        row = conn.execute("SELECT status, created_at FROM jobs WHERE id = ?", (job_id,)).fetchone()
        if row is None or row["status"] != "queued":
            return None
        ahead = conn.execute(
            """
            SELECT COUNT(*) FROM jobs
            WHERE status = 'queued' AND (created_at < ? OR (created_at = ? AND id < ?))
            """,
            (row["created_at"], row["created_at"], job_id),
        ).fetchone()[0]
    return int(ahead) + 1


def row_to_job(row: sqlite3.Row) -> dict[str, Any]:
    job = dict(row)
    raw = job.pop("upstream_json", None)
    job.pop("request_json", None)
    job.pop("log_start_offset", None)
    job.pop("upstream_id", None)
    job.pop("upstream_base", None)
    job.pop("user_id", None)
    if raw:
        try:
            upstream = json.loads(raw)
            for key in ("size", "seconds", "quality", "stage_durations", "peak_memory_mb"):
                if key in upstream:
                    job[key] = upstream[key]
        except json.JSONDecodeError:
            pass
    video_path = job.get("video_path")
    job["download_url"] = (
        f"/api/jobs/{job['id']}/download"
        if video_path and Path(video_path).is_file()
        else None
    )
    outputs: list[dict[str, Any]] = []
    raw_paths = job.pop("result_paths", None)
    if raw_paths:
        try:
            for index, value in enumerate(json.loads(raw_paths)):
                path = Path(value)
                if path.is_file():
                    outputs.append(
                        {
                            "index": index,
                            "name": path.name,
                            "url": f"/api/jobs/{job['id']}/outputs/{index}",
                            "type": "image" if path.parent == IMAGE_DIR else "video",
                        }
                    )
        except (json.JSONDecodeError, TypeError):
            pass
    if not outputs and video_path and Path(video_path).is_file():
        outputs.append({"index": 0, "name": Path(video_path).name, "url": job["download_url"], "type": "video"})
    job["outputs"] = outputs
    job["queue_position"] = queue_position(str(job["id"]))
    return job


def get_job_row(job_id: str) -> sqlite3.Row | None:
    with db_connect() as conn:
        return conn.execute("SELECT * FROM jobs WHERE id = ?", (job_id,)).fetchone()


CONVERSATION_ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{8,64}$")


def clean_conversation_id(value: Any) -> str | None:
    text = str(value or "").strip()
    if not text:
        return None
    if not CONVERSATION_ID_PATTERN.fullmatch(text):
        raise HTTPException(status_code=400, detail="无效的对话 ID")
    return text


def touch_conversation(conn: sqlite3.Connection, conversation_id: str | None, user_id: int, title: str, now: int) -> None:
    if not conversation_id:
        return
    conn.execute(
        """
        INSERT INTO conversations (id, user_id, title, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET updated_at = excluded.updated_at
        """,
        (conversation_id, user_id, title[:64], now, now),
    )


def get_conversation_authorized(conversation_id: str, user: dict[str, Any]) -> sqlite3.Row:
    if not CONVERSATION_ID_PATTERN.fullmatch(conversation_id):
        raise HTTPException(status_code=404, detail="对话不存在")
    with db_connect() as conn:
        row = conn.execute("SELECT * FROM conversations WHERE id = ?", (conversation_id,)).fetchone()
    if row is None or (user["role"] != "admin" and int(row["user_id"]) != int(user["id"])):
        raise HTTPException(status_code=404, detail="对话不存在")
    return row


def get_authorized_job(job_id: str, user: dict[str, Any]) -> sqlite3.Row:
    validate_job_id(job_id)
    row = get_job_row(job_id)
    if row is None:
        raise HTTPException(status_code=404, detail="任务不存在")
    if user["role"] != "admin" and int(row["user_id"] or 0) != int(user["id"]):
        raise HTTPException(status_code=404, detail="任务不存在")
    return row


def update_job_from_upstream(local_id: str, payload: dict[str, Any]) -> None:
    now = int(time.time())
    upstream_status = str(payload.get("status") or "in_progress")
    # The local queue owns admission control. Once submitted upstream, every
    # non-terminal upstream state must continue occupying the single run slot.
    status = upstream_status if upstream_status in TERMINAL_STATUSES else "in_progress"
    with db_connect() as conn:
        conn.execute(
            """
            UPDATE jobs SET status = ?, progress = ?, error = ?, upstream_json = ?,
                updated_at = ?, completed_at = ?, inference_time_s = ?
            WHERE id = ?
            """,
            (
                status,
                int(payload.get("progress") or (100 if status == "completed" else 0)),
                error_text(payload.get("error")),
                json.dumps(payload, ensure_ascii=False),
                now,
                payload.get("completed_at") or (now if status in TERMINAL_STATUSES else None),
                payload.get("inference_time_s"),
                local_id,
            ),
        )


async def upstream_json(method: str, path: str, base_url: str = UPSTREAM, **kwargs: Any) -> dict[str, Any]:
    timeout = httpx.Timeout(connect=10, read=1800, write=120, pool=10)
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.request(method, f"{base_url}{path}", **kwargs)
    if response.status_code >= 400:
        try:
            detail: Any = response.json()
        except ValueError:
            detail = response.text
        failed_job = None
        if isinstance(detail, dict):
            nested = detail.get("detail")
            failed_job = nested if isinstance(nested, dict) else detail
        if isinstance(failed_job, dict) and failed_job.get("status") == "failed":
            return failed_job
        raise HTTPException(status_code=response.status_code, detail=detail)
    return response.json()


async def save_completed_video(local_id: str, upstream_id: str, base_url: str = UPSTREAM) -> Path:
    target = VIDEO_DIR / f"{local_id}.mp4"
    if target.is_file():
        return target
    lock = download_locks.setdefault(local_id, asyncio.Lock())
    async with lock:
        if get_job_row(local_id) is None:
            raise RuntimeError("任务已删除，不再保存视频")
        if target.is_file():
            return target
        temp = VIDEO_DIR / f".{local_id}.mp4.part"
        timeout = httpx.Timeout(connect=10, read=None, write=120, pool=10)
        async with httpx.AsyncClient(timeout=timeout) as client:
            async with client.stream("GET", f"{base_url}/v1/videos/{upstream_id}/content") as response:
                if response.status_code >= 400:
                    body = await response.aread()
                    raise RuntimeError(f"下载生成视频失败：HTTP {response.status_code} {body[:300]!r}")
                async with aiofiles.open(temp, "wb") as output:
                    async for chunk in response.aiter_bytes(1024 * 1024):
                        await output.write(chunk)
        os.replace(temp, target)
        with db_connect() as conn:
            conn.execute(
                "UPDATE jobs SET video_path = ?, updated_at = ? WHERE id = ?",
                (str(target), int(time.time()), local_id),
            )
        return target


async def save_completed_images(local_id: str, payload: dict[str, Any]) -> list[Path]:
    output_format = str(payload.get("output_format") or "png").lower()
    extension = {"jpg": "jpg", "jpeg": "jpg", "webp": "webp"}.get(output_format, "png")
    paths: list[Path] = []
    for index, item in enumerate(payload.get("data") or []):
        encoded = item.get("b64_json") if isinstance(item, dict) else None
        if not encoded:
            continue
        target = IMAGE_DIR / f"{local_id}_{index}.{extension}"
        raw = await asyncio.to_thread(base64.b64decode, encoded, validate=True)
        async with aiofiles.open(target, "wb") as output:
            await output.write(raw)
        paths.append(target)
    if not paths:
        raise RuntimeError("文生图接口没有返回可保存的 base64 图片")
    return paths


async def refresh_job(local_id: str) -> dict[str, Any]:
    row = get_job_row(local_id)
    if row is None:
        raise RuntimeError("本地任务不存在")
    upstream_id = row["upstream_id"]
    if not upstream_id:
        return row_to_job(row)
    base_url = str(row["upstream_base"] or FL2VA_UPSTREAM)
    payload = await upstream_json("GET", f"/v1/videos/{upstream_id}", base_url=base_url)
    update_job_from_upstream(local_id, payload)
    if payload.get("status") == "completed":
        try:
            await save_completed_video(local_id, str(upstream_id), base_url)
        except Exception as exc:
            with db_connect() as conn:
                conn.execute(
                    "UPDATE jobs SET error = ?, updated_at = ? WHERE id = ?",
                    (f"保存视频失败：{exc}", int(time.time()), local_id),
                )
    updated = get_job_row(local_id)
    return row_to_job(updated) if updated else payload


async def monitor_job(local_id: str) -> None:
    try:
        while True:
            try:
                job = await refresh_job(local_id)
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                logger.warning("Job poll failed: id=%s error=%s", local_id, exc)
                await asyncio.sleep(POLL_SECONDS)
                continue
            if job.get("status") in TERMINAL_STATUSES:
                return
            await asyncio.sleep(POLL_SECONDS)
    finally:
        monitor_tasks.pop(local_id, None)
        dispatcher_wakeup.set()


def schedule_monitor(local_id: str) -> None:
    task = monitor_tasks.get(local_id)
    if task is None or task.done():
        monitor_tasks[local_id] = asyncio.create_task(monitor_job(local_id))


def model_log_path(task_type: str) -> Path:
    if task_type in Z_IMAGE_TASKS:
        if task_type in {"z_image_text_to_image", "z_image_image_to_image"}:
            return Path("/tmp/z-image-turbo.log")
        return Z_IMAGE_LOG_PATH
    return QWEN_IMAGE_LOG_PATH if task_type in QWEN_IMAGE_TASKS else MODEL_LOG_PATH


def model_log_size(path: Path = MODEL_LOG_PATH) -> int | None:
    try:
        return path.stat().st_size
    except OSError:
        return None


async def dispatch_job(local_id: str) -> None:
    now = int(time.time())
    with db_connect() as conn:
        changed = conn.execute(
            "UPDATE jobs SET status = 'submitting', started_at = ?, updated_at = ? WHERE id = ? AND status = 'queued'",
            (now, now, local_id),
        ).rowcount
    if changed != 1:
        return
    try:
        row = get_job_row(local_id)
        manifest = json.loads(row["request_json"] or "{}") if row else {}
        task_type = str(row["task_type"] or "fl2va") if row else "fl2va"
        base_url = str(row["upstream_base"] or FL2VA_UPSTREAM) if row else FL2VA_UPSTREAM
        log_offset = model_log_size(model_log_path(task_type))
        if task_type == "text_to_image" or task_type in QWEN_IMAGE_TASKS or task_type in Z_IMAGE_TASKS:
            if task_type in QWEN_IMAGE_TASKS or task_type in Z_IMAGE_TASKS:
                await require_image_model(base_url, manifest["json"]["model"])
            started = time.monotonic()
            with db_connect() as conn:
                conn.execute(
                    "UPDATE jobs SET status = 'in_progress', log_start_offset = ?, updated_at = ? WHERE id = ?",
                    (log_offset, int(time.time()), local_id),
                )
            kwargs: dict[str, Any] = {"json": manifest.get("json") or {}}
            endpoint = "/v1/images/generations"
            if task_type in {"qwen_image_edit", "z_image_image_to_image", "z_image_base_image_to_image"}:
                endpoint = "/v1/images/edits"
                multipart = []
                for key, value in (manifest.get("json") or {}).items():
                    multipart.append((key, (None, str(value))))
                for item in manifest.get("files", []):
                    path = Path(item["path"])
                    if not path.is_file() or QUEUE_DIR not in path.parents:
                        raise RuntimeError("排队任务的参考图片不存在")
                    content = await asyncio.to_thread(path.read_bytes)
                    multipart.append(("image", (item["filename"], content, item["content_type"])))
                kwargs = {"files": multipart}
            payload = await upstream_json(
                "POST",
                endpoint,
                base_url=base_url,
                **kwargs,
            )
            paths = await save_completed_images(local_id, payload)
            summary = {key: value for key, value in payload.items() if key != "data"}
            summary["image_count"] = len(paths)
            now_done = int(time.time())
            with db_connect() as conn:
                conn.execute(
                    """
                    UPDATE jobs SET status = 'completed', progress = 100, upstream_json = ?,
                        result_paths = ?, error = NULL, log_start_offset = ?, updated_at = ?,
                        completed_at = ?, inference_time_s = ? WHERE id = ?
                    """,
                    (
                        json.dumps(summary, ensure_ascii=False),
                        json.dumps([str(path) for path in paths]),
                        log_offset,
                        now_done,
                        now_done,
                        time.monotonic() - started,
                        local_id,
                    ),
                )
            dispatcher_wakeup.set()
            return
        multipart: list[tuple[str, tuple[Any, ...]]] = []
        for key, value in manifest.get("fields", []):
            multipart.append((str(key), (None, str(value))))
        for item in manifest.get("files", []):
            path = Path(item["path"])
            if not path.is_file() or QUEUE_DIR not in path.parents:
                raise RuntimeError("排队任务的上传文件不存在")
            content = await asyncio.to_thread(path.read_bytes)
            multipart.append(
                (
                    str(item["field"]),
                    (str(item["filename"]), content, str(item["content_type"])),
                )
            )
        payload = await upstream_json("POST", "/v1/videos", base_url=base_url, files=multipart)
        upstream_id = str(payload["id"])
        with db_connect() as conn:
            conn.execute(
                """
                UPDATE jobs SET upstream_id = ?, status = ?, progress = ?, upstream_json = ?,
                    error = NULL, log_start_offset = ?, updated_at = ? WHERE id = ?
                """,
                (
                    upstream_id,
                    (
                        str(payload.get("status"))
                        if str(payload.get("status")) in TERMINAL_STATUSES
                        else "in_progress"
                    ),
                    int(payload.get("progress") or 0),
                    json.dumps(payload, ensure_ascii=False),
                    log_offset,
                    int(time.time()),
                    local_id,
                ),
            )
        schedule_monitor(local_id)
    except Exception as exc:
        if isinstance(exc, HTTPException):
            detail = error_text(exc.detail) or f"上游服务异常（HTTP {exc.status_code}），请稍后重试"
        else:
            detail = str(exc) or "任务处理失败，请稍后重试"
        with db_connect() as conn:
            conn.execute(
                "UPDATE jobs SET status = 'failed', error = ?, completed_at = ?, updated_at = ? WHERE id = ?",
                (detail, int(time.time()), int(time.time()), local_id),
            )


async def dispatcher_loop() -> None:
    while True:
        try:
            with db_connect() as conn:
                active = conn.execute(
                    "SELECT id FROM jobs WHERE status IN ('submitting', 'in_progress') LIMIT 1"
                ).fetchone()
                queued = None
                if active is None:
                    queued = conn.execute(
                        "SELECT id FROM jobs WHERE status = 'queued' ORDER BY created_at, id LIMIT 1"
                    ).fetchone()
            if queued:
                await dispatch_job(str(queued["id"]))
                continue
            dispatcher_wakeup.clear()
            try:
                await asyncio.wait_for(dispatcher_wakeup.wait(), timeout=DISPATCH_SECONDS)
            except TimeoutError:
                pass
        except asyncio.CancelledError:
            raise
        except Exception:
            logger.exception("Queue dispatcher failed")
            await asyncio.sleep(DISPATCH_SECONDS)


def read_model_log_window(start_offset: int | None, path: Path = MODEL_LOG_PATH) -> tuple[str, int, bool]:
    try:
        size = path.stat().st_size
        lower_bound = max(0, size - MODEL_LOG_TAIL_BYTES)
        valid_start = start_offset is not None and 0 <= start_offset <= size
        offset = max(lower_bound, start_offset) if valid_start else lower_bound
        with path.open("rb") as log_file:
            log_file.seek(offset)
            raw = log_file.read(MODEL_LOG_TAIL_BYTES)
    except OSError:
        return "", 0, False
    truncated = not valid_start or (start_offset is not None and offset > start_offset)
    return raw.decode("utf-8", errors="replace"), len(raw), truncated


def parse_model_runtime(log_text: str) -> dict[str, Any]:
    generation_progress = step = total_steps = None
    phase: str | None = None
    events: list[dict[str, Any]] = []
    last_progress_event: tuple[int, int] | None = None
    seen_sequence_start = False
    normalized = ANSI_ESCAPE.sub("", log_text).replace("\r", "\n")
    for raw_line in normalized.splitlines():
        line = " ".join(raw_line.strip().split())
        if not line:
            continue
        match = TQDM_PROGRESS.search(line)
        if match and "Completed |" not in line:
            candidate_step = int(match.group("step"))
            candidate_total = int(match.group("total"))
            if candidate_total >= 2 and 0 <= candidate_step <= candidate_total:
                if candidate_step <= 1:
                    seen_sequence_start = True
                if not seen_sequence_start:
                    continue
                generation_progress = min(100, round(candidate_step * 100 / candidate_total))
                step, total_steps = candidate_step, candidate_total
                phase = "encoding" if candidate_step == candidate_total else "generating"
                marker = (candidate_step, candidate_total)
                if marker != last_progress_event:
                    events.append(
                        {
                            "type": "progress",
                            "message": f"扩散生成 {candidate_step}/{candidate_total}",
                            "step": candidate_step,
                            "total_steps": candidate_total,
                            "percent": generation_progress,
                        }
                    )
                    last_progress_event = marker
                continue
        if "Video response encoding" in line:
            phase = "encoding"
            events.append({"type": "encoding", "message": "正在编码 MP4 视频"})
        elif "persisted" in line and "output file" in line:
            phase = "saving"
            events.append({"type": "saving", "message": "模型视频文件已生成"})
        elif re.search(r"\b(?:ERROR|OOM)\b|out of memory", line, re.IGNORECASE):
            events.append({"type": "warning", "message": line[-300:]})
    return {
        "phase": phase,
        "generation_progress": generation_progress,
        "step": step,
        "total_steps": total_steps,
        "events": events[-MODEL_LOG_MAX_EVENTS:],
    }


def runtime_feedback(row: sqlite3.Row) -> dict[str, Any]:
    job = row_to_job(row)
    status = str(job.get("status") or "unknown")
    output_name = "图片" if job.get("result_type") == "image" else "视频"
    log_path = model_log_path(str(row["task_type"]))
    result: dict[str, Any] = {
        "id": job["id"],
        "status": status,
        "phase": status,
        "progress": 100 if status == "completed" else int(job.get("progress") or 0),
        "generation_progress": None,
        "step": None,
        "total_steps": None,
        "queue_position": job.get("queue_position"),
        "source": "upstream",
        "events": [],
        "log": {
            "available": log_path.is_file(),
            "bytes_scanned": 0,
            "truncated": False,
            "max_bytes": MODEL_LOG_TAIL_BYTES,
        },
    }
    if status == "queued":
        result["events"] = [
            {"type": "queued", "message": f"当前排队位置：{job.get('queue_position') or 1}"}
        ]
        return result
    if status == "submitting":
        result["events"] = [{"type": "submitting", "message": "正在向模型服务提交任务"}]
        return result
    if status == "completed":
        if row["log_start_offset"] is not None:
            log_text, bytes_scanned, truncated = read_model_log_window(row["log_start_offset"], log_path)
            parsed = parse_model_runtime(log_text)
            result["log"].update({"bytes_scanned": bytes_scanned, "truncated": truncated})
            result.update(
                {
                    "generation_progress": parsed["generation_progress"],
                    "step": parsed["step"],
                    "total_steps": parsed["total_steps"],
                    "source": "model_log" if parsed["events"] else "upstream",
                    "events": [
                        *parsed["events"][-(MODEL_LOG_MAX_EVENTS - 1):],
                        {"type": "completed", "message": f"{output_name}生成完成"},
                    ],
                }
            )
        else:
            result["events"] = [{"type": "completed", "message": f"{output_name}生成完成"}]
        return result
    if status in {"failed", "cancelled"}:
        result["events"] = [{"type": status, "message": job.get("error") or "任务已取消"}]
        return result
    log_text, bytes_scanned, truncated = read_model_log_window(row["log_start_offset"], log_path)
    parsed = parse_model_runtime(log_text)
    result["log"].update({"bytes_scanned": bytes_scanned, "truncated": truncated})
    if parsed["generation_progress"] is not None:
        generation_progress = int(parsed["generation_progress"])
        result.update(
            {
                "phase": parsed["phase"] or "generating",
                "progress": min(99, max(result["progress"], generation_progress)),
                "generation_progress": generation_progress,
                "step": parsed["step"],
                "total_steps": parsed["total_steps"],
                "source": "model_log",
                "events": parsed["events"],
            }
        )
    elif status == "in_progress":
        result["events"] = [{"type": "in_progress", "message": "模型正在处理；尚未收到可确认的步数进度"}]
    return result


@asynccontextmanager
async def lifespan(_: FastAPI):
    global dispatcher_task
    init_db()
    with db_connect() as conn:
        conn.execute(
            "UPDATE jobs SET status = 'failed', error = '网页网关中断，请确认模型空闲后重新提交', completed_at = ?, updated_at = ? "
            "WHERE status = 'in_progress' AND result_type = 'image' AND upstream_id IS NULL",
            (int(time.time()), int(time.time())),
        )
        conn.execute("UPDATE jobs SET status = 'queued', updated_at = ? WHERE status = 'submitting' AND upstream_id IS NULL", (int(time.time()),))
        rows = conn.execute("SELECT id FROM jobs WHERE status = 'in_progress' AND upstream_id IS NOT NULL").fetchall()
    for row in rows:
        schedule_monitor(str(row["id"]))
    dispatcher_task = asyncio.create_task(dispatcher_loop())
    dispatcher_wakeup.set()
    yield
    if dispatcher_task:
        dispatcher_task.cancel()
    for task in list(monitor_tasks.values()):
        task.cancel()
    tasks = [task for task in [dispatcher_task, *monitor_tasks.values()] if task]
    if tasks:
        await asyncio.gather(*tasks, return_exceptions=True)


app = FastAPI(
    title="Kaishi H3 Gateway",
    version="2.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)


@app.get("/api/health")
async def health() -> dict[str, Any]:
    configured = {"t2va": FL2VA_UPSTREAM, "fl2va": FL2VA_UPSTREAM, "ref2va": REF2VA_UPSTREAM, "qwen_image": QWEN_IMAGE_UPSTREAM, "z_image": Z_IMAGE_UPSTREAM}
    services: dict[str, dict[str, Any]] = {}
    async with httpx.AsyncClient(timeout=5) as client:
        for name, url in configured.items():
            try:
                response = await client.get(f"{url}/health")
                services[name] = {"ok": response.status_code == 200, "url": url}
                if services[name]["ok"] and name in {"qwen_image", "z_image"}:
                    expected = QWEN_IMAGE_MODEL if name == "qwen_image" else Z_IMAGE_MODEL
                    models = await client.get(f"{url}/v1/models")
                    services[name]["ok"] = models.status_code == 200 and any(
                        item.get("id") == expected for item in models.json().get("data", [])
                    )
            except (httpx.HTTPError, ValueError, AttributeError, TypeError):
                services[name] = {"ok": False, "url": url}
    with db_connect() as conn:
        queued = int(conn.execute("SELECT COUNT(*) FROM jobs WHERE status = 'queued'").fetchone()[0])
        running = int(conn.execute("SELECT COUNT(*) FROM jobs WHERE status IN ('submitting','in_progress')").fetchone()[0])
    return {"ok": any(item["ok"] for item in services.values()), "services": services, "queued": queued, "running": running}


@app.post("/api/auth/login")
async def login(request: Request) -> JSONResponse:
    payload = await request.json()
    username = str(payload.get("username") or "").strip().lower()
    password = str(payload.get("password") or "")
    with db_connect() as conn:
        row = conn.execute("SELECT * FROM users WHERE username = ? COLLATE NOCASE", (username,)).fetchone()
    if row is None or not row["is_active"] or not verify_password(password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    token = secrets.token_urlsafe(32)
    now = int(time.time())
    expires_at = now + SESSION_DAYS * 86400
    with db_connect() as conn:
        conn.execute(
            "INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
            (session_token_hash(token), row["id"], now, expires_at),
        )
    response = JSONResponse({"user": public_user(row)})
    response.set_cookie(
        SESSION_COOKIE,
        token,
        max_age=SESSION_DAYS * 86400,
        httponly=True,
        secure=SESSION_SECURE,
        samesite="strict",
        path="/",
    )
    return response


@app.post("/api/auth/logout")
async def logout(request: Request) -> JSONResponse:
    token = request.cookies.get(SESSION_COOKIE)
    if token:
        with db_connect() as conn:
            conn.execute("DELETE FROM sessions WHERE token_hash = ?", (session_token_hash(token),))
    response = JSONResponse({"ok": True})
    response.delete_cookie(SESSION_COOKIE, path="/")
    return response


@app.get("/api/auth/me")
async def me(request: Request) -> dict[str, Any]:
    return {"user": current_user(request)}


@app.get("/api/auth/api-key")
async def api_key_status(request: Request) -> dict[str, Any]:
    user = current_user(request)
    with db_connect() as conn:
        row = conn.execute(
            "SELECT token_prefix, created_at, last_used_at FROM api_tokens WHERE user_id = ? ORDER BY id DESC LIMIT 1",
            (user["id"],),
        ).fetchone()
    return {"configured": row is not None, "key": dict(row) if row else None}


@app.post("/api/auth/api-key")
async def create_api_key(request: Request) -> dict[str, Any]:
    user = current_user(request)
    raw_key = "kh3_" + secrets.token_urlsafe(36)
    now = int(time.time())
    with db_connect() as conn:
        conn.execute("DELETE FROM api_tokens WHERE user_id = ?", (user["id"],))
        conn.execute(
            "INSERT INTO api_tokens (user_id, token_hash, token_prefix, created_at) VALUES (?, ?, ?, ?)",
            (user["id"], session_token_hash(raw_key), raw_key[:12], now),
        )
    return {
        "api_key": raw_key,
        "token_prefix": raw_key[:12],
        "created_at": now,
        "notice": "密钥只完整显示一次，请立即保存。再次生成会使旧密钥失效。",
    }


@app.delete("/api/auth/api-key")
async def revoke_api_key(request: Request) -> dict[str, Any]:
    user = current_user(request)
    with db_connect() as conn:
        deleted = conn.execute(
            "DELETE FROM api_tokens WHERE user_id = ?", (user["id"],)
        ).rowcount
    return {"ok": True, "revoked": bool(deleted)}


@app.get("/api/admin/users")
async def list_users(request: Request) -> dict[str, Any]:
    user = current_user(request)
    require_admin(user)
    with db_connect() as conn:
        rows = conn.execute("SELECT * FROM users ORDER BY created_at, id").fetchall()
    return {"data": [public_user(row) for row in rows]}


@app.post("/api/admin/users")
async def admin_create_user(request: Request) -> JSONResponse:
    user = current_user(request)
    require_admin(user)
    payload = await request.json()
    try:
        user_id = create_user(
            str(payload.get("username") or ""),
            str(payload.get("password") or ""),
            str(payload.get("role") or "user"),
        )
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="用户名已经存在") from None
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    with db_connect() as conn:
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return JSONResponse({"user": public_user(row)}, status_code=201)


@app.delete("/api/admin/users/{user_id}")
async def admin_delete_user(user_id: int, request: Request) -> dict[str, Any]:
    current = current_user(request)
    require_admin(current)
    if user_id == current["id"]:
        raise HTTPException(status_code=400, detail="不能删除当前登录的管理员账号")
    with db_connect() as conn:
        target = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if target is None:
            raise HTTPException(status_code=404, detail="用户不存在")
        if target["role"] == "admin":
            admin_count = int(
                conn.execute(
                    "SELECT COUNT(*) FROM users WHERE role = 'admin' AND is_active = 1"
                ).fetchone()[0]
            )
            if admin_count <= 1:
                raise HTTPException(status_code=400, detail="不能删除最后一个管理员账号")
        conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
    return {"ok": True, "deleted_user_id": user_id}


@app.post("/api/v1/generations")
@app.post("/api/jobs")
async def create_job(request: Request) -> JSONResponse:
    user = current_user(request)
    with db_connect() as conn:
        total_count = conn.execute(
            "SELECT COUNT(*) FROM jobs WHERE status IN ('queued','submitting','in_progress')"
        ).fetchone()[0]
    if total_count >= MAX_TOTAL_JOBS:
        raise HTTPException(status_code=503, detail="服务器任务队列已满，请稍后再试")

    form = await request.form()
    prompt = str(form.get("prompt") or "").strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="提示词不能为空")
    task_type = str(form.get("task_type") or "t2va").strip().lower()
    if task_type not in {"t2va", "fl2va", "ref2va"}:
        raise HTTPException(status_code=400, detail="无效的视频任务类型")
    upstream_base = REF2VA_UPSTREAM if task_type == "ref2va" else FL2VA_UPSTREAM
    local_id = f"video_job_{uuid.uuid4().hex}"
    job_dir = QUEUE_DIR / local_id
    job_dir.mkdir(mode=0o750)
    fields: list[list[str]] = []
    files: list[dict[str, str]] = []
    selected_size: tuple[str, str] | None = None
    has_aspect_ratio = False
    extra_params: dict[str, Any] = {"task": task_type}
    frame_mode = "first"
    file_index = 0
    conversation_id: str | None = None
    for key, value in form.multi_items():
        if isinstance(value, UploadFile):
            filename = Path(value.filename or "reference.bin").name
            content_type = value.content_type or "application/octet-stream"
            media_kind, media_limit = reference_media_kind(filename, content_type)
            if media_kind is None:
                raise HTTPException(status_code=400, detail=f"不支持的参考素材格式：{filename}")
            if key not in {"input_reference", "input_references"}:
                raise HTTPException(status_code=400, detail=f"无效的参考素材字段：{key}")
            suffix = Path(filename).suffix.lower()[:12]
            target = job_dir / f"upload_{file_index}{suffix}"
            file_index += 1
            total = 0
            async with aiofiles.open(target, "wb") as output:
                while chunk := await value.read(1024 * 1024):
                    total += len(chunk)
                    if total > min(MAX_UPLOAD_BYTES, media_limit):
                        raise HTTPException(status_code=413, detail=f"{filename} 超过该格式的大小限制")
                    await output.write(chunk)
            if total:
                files.append(
                    {
                        "field": key,
                        "filename": filename,
                        "content_type": content_type,
                        "media_kind": media_kind,
                        "path": str(target),
                    }
                )
        else:
            text = str(value).strip()
            if not text:
                continue
            if key == "task_type":
                continue
            if key == "conversation_id":
                conversation_id = clean_conversation_id(text)
                continue
            if key == "frame_mode":
                frame_mode = text
                continue
            if key == "extra_params":
                try:
                    supplied = json.loads(text)
                except json.JSONDecodeError as exc:
                    raise HTTPException(status_code=400, detail="Extra params 必须是有效 JSON") from exc
                if not isinstance(supplied, dict):
                    raise HTTPException(status_code=400, detail="Extra params 必须是 JSON 对象")
                extra_params.update(supplied)
                continue
            if key == "seconds":
                try:
                    duration = float(text)
                except ValueError as exc:
                    raise HTTPException(status_code=400, detail="时长必须是数字") from exc
                if not 4 <= duration <= 15:
                    raise HTTPException(status_code=400, detail="MiniMax H3 时长必须在 4 到 15 秒之间")
                extra_params["duration"] = duration
            if key == "aspect_ratio":
                has_aspect_ratio = True
            if key == "size":
                normalized = text.lower().replace("×", "x").replace("*", "x").replace(" ", "")
                if not SIZE_PATTERN.fullmatch(normalized):
                    raise HTTPException(status_code=400, detail="输出尺寸格式错误，请使用 WIDTHxHEIGHT")
                width_text, height_text = normalized.split("x", 1)
                if int(width_text) % 32 or int(height_text) % 32:
                    raise HTTPException(status_code=400, detail="输出宽度和高度必须是 32 的倍数")
                selected_size = (width_text, height_text)
            else:
                fields.append([key, text])
    if selected_size:
        fields = [item for item in fields if item[0] not in {"width", "height", "aspect_ratio"}]
        fields.extend([["width", selected_size[0]], ["height", selected_size[1]]])
        has_aspect_ratio = False
    extra_params["task"] = task_type
    fields.append(["extra_params", json.dumps(extra_params, ensure_ascii=False, separators=(",", ":"))])
    if not has_aspect_ratio and task_type != "fl2va":
        dimensions = selected_size
        if dimensions is None:
            field_values = dict(fields)
            width_value, height_value = field_values.get("width"), field_values.get("height")
            if width_value and height_value and width_value.isdigit() and height_value.isdigit():
                dimensions = (width_value, height_value)
        aspect_ratio = (
            aspect_ratio_for_dimensions(int(dimensions[0]), int(dimensions[1]))
            if dimensions
            else "16:9"
        )
        fields.append(["aspect_ratio", aspect_ratio])
    if task_type == "t2va" and files:
        raise HTTPException(status_code=400, detail="T2VA 是纯文本任务，请不要上传参考素材")
    if task_type == "fl2va":
        if any(item["media_kind"] != "image" for item in files):
            raise HTTPException(status_code=400, detail="FL2VA 仅支持图片关键帧，不支持音频或视频参考")
        expected_counts = {"first": 1, "last": 1, "first_last": 2}
        frame_indices = {"first": [0], "last": [-1], "first_last": [0, -1]}
        if frame_mode not in expected_counts:
            raise HTTPException(status_code=400, detail="无效的 FL2VA 关键帧方式")
        if len(files) != expected_counts[frame_mode]:
            raise HTTPException(status_code=400, detail="FL2VA 上传图片数量与关键帧方式不匹配")
        extra_params["frame_indices"] = frame_indices[frame_mode]
        fields[-1] = ["extra_params", json.dumps(extra_params, ensure_ascii=False, separators=(",", ":"))]
    if task_type == "ref2va":
        counts = {
            kind: sum(item["media_kind"] == kind for item in files)
            for kind in ("image", "video", "audio")
        }
        if not files:
            raise HTTPException(status_code=400, detail="Ref2VA 至少需要一个参考素材")
        if counts["image"] > 9 or counts["video"] > 3 or counts["audio"] > 3 or len(files) > 12:
            raise HTTPException(status_code=400, detail="Ref2VA 限制：图片≤9、视频≤3、音频≤3、总素材≤12")
        if counts["audio"] and not (counts["image"] or counts["video"]):
            raise HTTPException(status_code=400, detail="Ref2VA 音频参考必须与图片或视频参考一起使用")
    manifest = {"fields": fields, "files": files}
    now = int(time.time())
    with db_connect() as conn:
        conn.execute("BEGIN IMMEDIATE")
        touch_conversation(conn, conversation_id, user["id"], prompt, now)
        conn.execute(
            """
            INSERT INTO jobs (
                id, status, prompt, model, progress, created_at, updated_at,
                user_id, request_json, task_type, result_type, upstream_base, conversation_id
            ) VALUES (?, 'queued', ?, ?, 0, ?, ?, ?, ?, ?, 'video', ?, ?)
            """,
            (
                local_id,
                prompt,
                str(form.get("model") or "MiniMaxH3"),
                now,
                now,
                user["id"],
                json.dumps(manifest, ensure_ascii=False),
                task_type,
                upstream_base,
                conversation_id,
            ),
        )
    dispatcher_wakeup.set()
    row = get_job_row(local_id)
    return JSONResponse(row_to_job(row), status_code=202)


async def require_image_model(base_url: str, expected: str) -> None:
    try:
        result = await upstream_json("GET", "/v1/models", base_url=base_url)
        available = [item.get("id") for item in result.get("data", [])]
    except Exception:
        raise HTTPException(status_code=503, detail=f"{expected} 服务暂不可用") from None
    if expected not in available:
        raise HTTPException(status_code=503, detail=f"{expected} 未运行；当前端口未提供该模型，请切换创作入口")


def qwen_image_parameters(payload: Any, z_image: bool = False) -> tuple[dict[str, Any], str]:
    if not isinstance(payload, dict):
        raise HTTPException(status_code=400, detail="请求参数必须是对象")
    mode = str(payload.get("mode") or "generate")
    if z_image:
        allowed = {"mode", "prompt", "model", "n", "size", "response_format", "num_inference_steps",
                   "guidance_scale", "true_cfg_scale", "negative_prompt", "seed", "output_format",
                   "output_compression", "strength", "generator_device"}
        unknown = set(payload) - allowed
        if unknown:
            raise HTTPException(status_code=400, detail=f"造相接口不支持这些参数：{', '.join(sorted(unknown))}")
    if z_image and payload.get("true_cfg_scale") not in (None, ""):
        raise HTTPException(status_code=400, detail="Z-Image 请使用 guidance_scale，不使用 true_cfg_scale")
    if mode not in {"generate", "edit"}:
        raise HTTPException(status_code=400, detail="请选择文生图或参考图编辑")
    prompt = str(payload.get("prompt") or "").strip()
    if not prompt or len(prompt) > 4000:
        raise HTTPException(status_code=400, detail="提示词须为 1–4000 个字符")
    size = str(payload.get("size") or "1024x1024").lower().replace("×", "x").replace("*", "x").replace(" ", "")
    if not SIZE_PATTERN.fullmatch(size):
        raise HTTPException(status_code=400, detail="输出尺寸格式应为 宽x高")
    width, height = map(int, size.split("x"))
    multiple = 16 if z_image else 32
    if any(value < 256 or value > 4096 or value % multiple for value in (width, height)):
        raise HTTPException(status_code=400, detail=f"图片宽高须为 256–4096 之间的 {multiple} 的整数倍")
    clean: dict[str, Any] = {
        "model": Z_IMAGE_MODEL if z_image else QWEN_IMAGE_MODEL, "prompt": prompt, "size": size,
        "response_format": "b64_json",
    }
    for name, default, minimum, maximum in (
        ("n", 1, 1, 10),
        ("num_inference_steps", 50, 1, 200),
        ("output_compression", 100, 0, 100),
        ("seed", None, 0, 9007199254740991),
    ):
        value = payload.get(name)
        if value is None or value == "":
            value = default
        if value is None:
            continue
        if isinstance(value, bool) or not re.fullmatch(r"\d+", str(value)):
            raise HTTPException(status_code=400, detail=f"{name} 必须是整数")
        value = int(value)
        if not minimum <= value <= maximum:
            raise HTTPException(status_code=400, detail=f"{name} 须在 {minimum}–{maximum} 之间")
        clean[name] = value
    try:
        cfg_key = "guidance_scale" if z_image else "true_cfg_scale"
        cfg = float(payload.get(cfg_key) if payload.get(cfg_key) not in (None, "") else (4.0 if z_image else 1.0))
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="True CFG 必须是数字") from None
    if not math.isfinite(cfg) or not 0 <= cfg <= 20:
        raise HTTPException(status_code=400, detail="True CFG 须在 0–20 之间")
    clean["true_cfg_scale"] = cfg
    if z_image:
        clean.pop("true_cfg_scale", None)
        clean["guidance_scale"] = cfg
        generator_device = str(payload.get("generator_device") or "").strip()
        if generator_device:
            if generator_device not in {"cpu", "cuda"}:
                raise HTTPException(status_code=400, detail="随机数设备只支持 cpu 或 cuda")
            clean["generator_device"] = generator_device
        if mode == "edit":
            try:
                strength = float(payload.get("strength") if payload.get("strength") not in (None, "") else 0.6)
            except (TypeError, ValueError):
                raise HTTPException(status_code=400, detail="重绘强度必须是数字") from None
            if not math.isfinite(strength) or not 0 < strength <= 1:
                raise HTTPException(status_code=400, detail="重绘强度须大于 0 且不超过 1")
            effective_steps = clean["num_inference_steps"] - int(max(clean["num_inference_steps"] - clean["num_inference_steps"] * strength, 0))
            if effective_steps < 2:
                raise HTTPException(status_code=400, detail="重绘强度与推理步数的组合过低，请提高强度或步数，至少保留 2 个采样时间步")
            clean["strength"] = strength
        else:
            if payload.get("strength") not in (None, ""):
                raise HTTPException(status_code=400, detail="重绘强度仅用于单图重绘")
            clean.pop("output_compression", None)
    negative = str(payload.get("negative_prompt") or "").strip()
    if len(negative) > 4000:
        raise HTTPException(status_code=400, detail="负面提示词不能超过 4000 个字符")
    if negative:
        if cfg <= 1 and not z_image:
            raise HTTPException(status_code=400, detail="使用负面提示词时，True CFG 必须大于 1")
        clean["negative_prompt"] = negative
    elif cfg > 1 and not z_image:
        raise HTTPException(status_code=400, detail="True CFG 大于 1 时，请填写负面提示词")
    output_format = str(payload.get("output_format") or "png").lower()
    if output_format not in {"png", "jpeg", "webp"}:
        raise HTTPException(status_code=400, detail="输出格式只支持 PNG、JPEG、WebP")
    clean["output_format"] = output_format
    return clean, mode


@app.post("/api/qwen-image-jobs")
@app.post("/api/z-image-jobs")
async def create_qwen_image_job(request: Request) -> JSONResponse:
    user = current_user(request)
    z_image = request.url.path == "/api/z-image-jobs"
    uploaded: list[UploadFile] = []
    if request.headers.get("content-type", "").startswith("multipart/form-data"):
        form_data = await request.form(max_files=4)
        payload = {key: value for key, value in form_data.items() if not isinstance(value, UploadFile)}
        uploaded = [value for value in form_data.getlist("image") if isinstance(value, UploadFile) and value.filename]
    else:
        try:
            payload = await request.json()
        except ValueError:
            raise HTTPException(status_code=400, detail="请求 JSON 格式不正确") from None
    conversation_id = clean_conversation_id(payload.pop("conversation_id", None) if isinstance(payload, dict) else None)
    local_id = f"{'z' if z_image else 'qwen'}_image_job_{uuid.uuid4().hex}"
    job_dir = QUEUE_DIR / local_id
    saved_paths: list[Path] = []
    try:
        clean, mode = qwen_image_parameters(payload, z_image=z_image)
        if mode == "edit" and z_image and len(uploaded) != 1:
            raise HTTPException(status_code=400, detail="造相单图重绘必须且只能上传 1 张图片，不支持多图融合")
        if mode == "edit" and not z_image and not 1 <= len(uploaded) <= 4:
            raise HTTPException(status_code=400, detail="参考图编辑需要上传 1–4 张图片")
        if mode == "generate" and uploaded:
            raise HTTPException(status_code=400, detail="使用参考图片时请选择参考图编辑")
        upstream_base = Z_IMAGE_UPSTREAM if z_image else QWEN_IMAGE_UPSTREAM
        await require_image_model(upstream_base, clean["model"])
        files: list[dict[str, str]] = []
        for index, upload in enumerate(uploaded):
            suffix = Path(upload.filename or "").suffix.lower()
            mime = str(upload.content_type or "").split(";", 1)[0].lower()
            valid_types = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp"}
            if suffix not in valid_types or mime != valid_types[suffix]:
                raise HTTPException(status_code=400, detail="参考图仅支持 PNG、JPEG、WebP")
            job_dir.mkdir(parents=True, exist_ok=True)
            target = job_dir / f"reference_{index}{suffix}"
            saved_paths.append(target)
            count = 0
            async with aiofiles.open(target, "wb") as output:
                while chunk := await upload.read(1024 * 1024):
                    count += len(chunk)
                    if count > MAX_IMAGE_BYTES:
                        raise HTTPException(status_code=400, detail="每张参考图片不能超过 30MB")
                    await output.write(chunk)
            if not count:
                raise HTTPException(status_code=400, detail="参考图片不能为空文件")
            files.append({"path": str(target), "filename": target.name, "content_type": mime})
        now = int(time.time())
        task_type = ("z_image_base_image_to_image" if mode == "edit" else "z_image_base_text_to_image") if z_image else ("qwen_image_edit" if mode == "edit" else "qwen_text_to_image")
        with db_connect() as conn:
            conn.execute("BEGIN IMMEDIATE")
            total_count = conn.execute(
                "SELECT COUNT(*) FROM jobs WHERE status IN ('queued','submitting','in_progress')"
            ).fetchone()[0]
            if total_count >= MAX_TOTAL_JOBS:
                raise HTTPException(status_code=503, detail="服务器任务队列已满，请稍后再试")
            touch_conversation(conn, conversation_id, user["id"], clean["prompt"], now)
            conn.execute(
                """INSERT INTO jobs (
                    id, status, prompt, model, progress, created_at, updated_at, user_id,
                    request_json, task_type, result_type, upstream_base, conversation_id
                ) VALUES (?, 'queued', ?, ?, 0, ?, ?, ?, ?, ?, 'image', ?, ?)""",
                (local_id, clean["prompt"], clean["model"], now, now, user["id"],
                 json.dumps({"json": clean, "files": files}, ensure_ascii=False), task_type, upstream_base,
                 conversation_id),
            )
    except Exception:
        for path in saved_paths:
            path.unlink(missing_ok=True)
        if job_dir.is_dir():
            job_dir.rmdir()
        raise
    finally:
        for upload in uploaded:
            await upload.close()
    dispatcher_wakeup.set()
    return JSONResponse(row_to_job(get_job_row(local_id)), status_code=202)


@app.post("/api/image-jobs")
async def create_image_job(request: Request) -> JSONResponse:
    user = current_user(request)
    with db_connect() as conn:
        total_count = conn.execute(
            "SELECT COUNT(*) FROM jobs WHERE status IN ('queued','submitting','in_progress')"
        ).fetchone()[0]
    if total_count >= MAX_TOTAL_JOBS:
        raise HTTPException(status_code=503, detail="服务器任务队列已满，请稍后再试")
    payload = await request.json()
    prompt = str(payload.get("prompt") or "").strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="提示词不能为空")
    allowed = {
        "prompt", "bot_task", "model", "n", "size", "response_format", "negative_prompt",
        "system_prompt", "use_system_prompt", "num_inference_steps", "guidance_scale",
        "true_cfg_scale", "flow_shift", "extra_params", "seed", "generator_device", "lora",
        "vae_use_slicing", "vae_use_tiling", "output_format", "layers",
    }
    clean = {key: value for key, value in payload.items() if key in allowed and value not in (None, "")}
    clean["prompt"] = prompt
    clean["response_format"] = "b64_json"
    local_id = f"image_job_{uuid.uuid4().hex}"
    now = int(time.time())
    with db_connect() as conn:
        conn.execute(
            """
            INSERT INTO jobs (
                id, status, prompt, model, progress, created_at, updated_at, user_id,
                request_json, task_type, result_type, upstream_base
            ) VALUES (?, 'queued', ?, ?, 0, ?, ?, ?, ?, 'text_to_image', 'image', ?)
            """,
            (
                local_id,
                prompt,
                str(clean.get("model") or ""),
                now,
                now,
                user["id"],
                json.dumps({"json": clean}, ensure_ascii=False),
                TEXT2IMAGE_UPSTREAM,
            ),
        )
    dispatcher_wakeup.set()
    row = get_job_row(local_id)
    return JSONResponse(row_to_job(row), status_code=202)


@app.get("/api/jobs")
async def list_jobs(request: Request, limit: int = 30, scope: str = "mine") -> dict[str, Any]:
    user = current_user(request)
    safe_limit = min(max(limit, 1), 100)
    with db_connect() as conn:
        if scope == "all" and user["role"] == "admin":
            rows = conn.execute("SELECT * FROM jobs ORDER BY created_at DESC LIMIT ?", (safe_limit,)).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM jobs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
                (user["id"], safe_limit),
            ).fetchall()
    return {"data": [row_to_job(row) for row in rows]}


@app.get("/api/jobs/{job_id}/runtime")
async def retrieve_job_runtime(job_id: str, request: Request) -> dict[str, Any]:
    user = current_user(request)
    row = get_authorized_job(job_id, user)
    return runtime_feedback(row)


@app.get("/api/jobs/{job_id}/download")
async def download_job(job_id: str, request: Request) -> Response:
    user = current_user(request)
    row = get_authorized_job(job_id, user)
    video_path = row["video_path"]
    if not video_path or not Path(video_path).is_file():
        raise HTTPException(status_code=404, detail="视频文件不存在")
    filename = f"{job_id}.mp4"
    return Response(
        status_code=200,
        headers={
            "X-Accel-Redirect": f"/protected-videos/{filename}",
            "Content-Disposition": f"inline; filename*=UTF-8''{quote(filename)}",
            "Content-Type": "video/mp4",
        },
    )


@app.get("/api/jobs/{job_id}/outputs/{output_index}")
async def download_job_output(job_id: str, output_index: int, request: Request) -> Response:
    user = current_user(request)
    row = get_authorized_job(job_id, user)
    try:
        paths = json.loads(row["result_paths"] or "[]")
        path = Path(paths[output_index])
    except (json.JSONDecodeError, IndexError, TypeError):
        raise HTTPException(status_code=404, detail="输出文件不存在") from None
    if not path.is_file() or path.parent not in {IMAGE_DIR, VIDEO_DIR}:
        raise HTTPException(status_code=404, detail="输出文件不存在")
    if path.parent == IMAGE_DIR:
        internal = f"/protected-images/{path.name}"
        content_type = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp"}.get(path.suffix.lower(), "image/png")
    else:
        internal = f"/protected-videos/{path.name}"
        content_type = "video/mp4"
    return Response(
        status_code=200,
        headers={
            "X-Accel-Redirect": internal,
            "Content-Disposition": f"inline; filename*=UTF-8''{quote(path.name)}",
            "Content-Type": content_type,
        },
    )


@app.get("/api/v1/generations/{job_id}")
@app.get("/api/jobs/{job_id}")
async def retrieve_job(job_id: str, request: Request) -> dict[str, Any]:
    user = current_user(request)
    row = get_authorized_job(job_id, user)
    if row["status"] in ACTIVE_STATUSES and row["upstream_id"]:
        try:
            await refresh_job(job_id)
        except Exception:
            pass
        row = get_job_row(job_id) or row
    return row_to_job(row)


@app.delete("/api/jobs/{job_id}/video")
async def delete_completed_video(job_id: str, request: Request) -> dict[str, Any]:
    user = current_user(request)
    get_authorized_job(job_id, user)
    lock = download_locks.setdefault(job_id, asyncio.Lock())
    async with lock:
        row = get_authorized_job(job_id, user)
        if row["result_type"] != "video" or row["status"] != "completed":
            raise HTTPException(status_code=409, detail="只能删除已经生成完成的视频")
        if not row["video_path"]:
            raise HTTPException(status_code=409, detail="视频尚未保存完成，请稍后再试")
        target = VIDEO_DIR / f"{job_id}.mp4"
        if Path(row["video_path"]).absolute() != target.absolute() or target.is_symlink():
            raise HTTPException(status_code=409, detail="视频路径异常，已拒绝删除")
        try:
            with db_connect() as conn:
                conn.execute("BEGIN IMMEDIATE")
                conn.execute("DELETE FROM jobs WHERE id = ? AND status = 'completed' AND result_type = 'video'", (job_id,))
                target.unlink(missing_ok=True)
        except OSError:
            logger.exception("Video deletion failed: id=%s", job_id)
            raise HTTPException(status_code=500, detail="视频文件删除失败，请联系管理员") from None
    return {"id": job_id, "deleted": True}


@app.delete("/api/jobs/{job_id}/images")
async def delete_completed_images(job_id: str, request: Request) -> dict[str, Any]:
    user = current_user(request)
    row = get_authorized_job(job_id, user)
    if row["result_type"] != "image" or row["status"] != "completed":
        raise HTTPException(status_code=409, detail="只能删除已经生成完成的图片任务")
    try:
        paths = json.loads(row["result_paths"] or "[]")
        if not isinstance(paths, list) or not paths:
            raise ValueError("missing outputs")
        targets = [Path(value) for value in paths]
        for target in targets:
            if (target.absolute().parent != IMAGE_DIR.absolute() or target.is_symlink()
                    or not re.fullmatch(re.escape(job_id) + r"_\d+\.(png|jpg|jpeg|webp)", target.name)):
                raise ValueError("unsafe output path")
    except (ValueError, TypeError):
        raise HTTPException(status_code=409, detail="图片输出路径异常，已拒绝删除") from None
    try:
        with db_connect() as conn:
            conn.execute("BEGIN IMMEDIATE")
            conn.execute("DELETE FROM jobs WHERE id = ? AND status = 'completed' AND result_type = 'image'", (job_id,))
            for target in targets:
                target.unlink(missing_ok=True)
    except OSError:
        logger.exception("Image deletion failed: id=%s", job_id)
        raise HTTPException(status_code=500, detail="图片删除未全部完成，任务记录已保留，请重试或联系管理员") from None
    return {"id": job_id, "deleted": True, "image_count": len(targets)}


@app.delete("/api/jobs/{job_id}")
async def cancel_job(job_id: str, request: Request) -> dict[str, Any]:
    user = current_user(request)
    row = get_authorized_job(job_id, user)
    if row["result_type"] == "image" and row["status"] in ACTIVE_STATUSES:
        raise HTTPException(status_code=409, detail="图片任务已提交模型，无法中途取消；请等待完成")
    upstream_id = row["upstream_id"]
    if upstream_id and row["status"] not in TERMINAL_STATUSES:
        try:
            await upstream_json(
                "DELETE",
                f"/v1/videos/{upstream_id}",
                base_url=str(row["upstream_base"] or FL2VA_UPSTREAM),
            )
        except HTTPException as exc:
            if exc.status_code != 404:
                raise
    now = int(time.time())
    with db_connect() as conn:
        conn.execute(
            "UPDATE jobs SET status = 'cancelled', error = '任务已取消', completed_at = ?, updated_at = ? WHERE id = ?",
            (now, now, job_id),
        )
    task = monitor_tasks.get(job_id)
    if task:
        task.cancel()
    dispatcher_wakeup.set()
    return {"id": job_id, "cancelled": True}


@app.post("/api/jobs/{job_id}/retry")
async def retry_job(job_id: str, request: Request) -> JSONResponse:
    user = current_user(request)
    row = get_authorized_job(job_id, user)
    if row["status"] not in {"failed", "cancelled"}:
        raise HTTPException(status_code=409, detail="只有失败或已取消的任务可以重新提交")
    manifest = json.loads(row["request_json"] or "{}") if row["request_json"] else {}
    for item in manifest.get("files", []):
        path = Path(str(item.get("path") or ""))
        if not path.is_file() or QUEUE_DIR not in path.parents:
            raise HTTPException(status_code=400, detail="原任务素材已不存在，无法重新提交，请重新上传提交")
    old_id = str(row["id"])
    if old_id.startswith("video_job_"):
        prefix = "video_job_"
    elif old_id.startswith("qwen_image_job_"):
        prefix = "qwen_image_job_"
    elif old_id.startswith("z_image_job_"):
        prefix = "z_image_job_"
    else:
        prefix = "image_job_"
    new_id = f"{prefix}{uuid.uuid4().hex}"
    now = int(time.time())
    conversation_id = row["conversation_id"]
    with db_connect() as conn:
        conn.execute("BEGIN IMMEDIATE")
        total_count = conn.execute(
            "SELECT COUNT(*) FROM jobs WHERE status IN ('queued','submitting','in_progress')"
        ).fetchone()[0]
        if total_count >= MAX_TOTAL_JOBS:
            raise HTTPException(status_code=503, detail="服务器任务队列已满，请稍后再试")
        touch_conversation(conn, conversation_id, user["id"], str(row["prompt"]), now)
        conn.execute(
            """
            INSERT INTO jobs (
                id, status, prompt, model, progress, created_at, updated_at,
                user_id, request_json, task_type, result_type, upstream_base, conversation_id
            ) VALUES (?, 'queued', ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                new_id,
                str(row["prompt"]),
                row["model"],
                now,
                now,
                user["id"],
                str(row["request_json"]),
                str(row["task_type"]),
                str(row["result_type"]),
                row["upstream_base"],
                conversation_id,
            ),
        )
    dispatcher_wakeup.set()
    return JSONResponse(row_to_job(get_job_row(new_id)), status_code=202)


@app.get("/api/conversations")
async def list_conversations(request: Request, limit: int = 30) -> dict[str, Any]:
    user = current_user(request)
    safe_limit = min(max(limit, 1), 50)
    with db_connect() as conn:
        rows = conn.execute(
            """
            SELECT c.id, c.title, c.created_at, c.updated_at,
                   lj.id AS latest_job_id, lj.status AS latest_status,
                   lj.result_type AS latest_result_type, lj.created_at AS latest_created_at,
                   (SELECT COUNT(*) FROM jobs j2 WHERE j2.conversation_id = c.id) AS turn_count
            FROM conversations c
            LEFT JOIN jobs lj ON lj.id = (
                SELECT j3.id FROM jobs j3
                WHERE j3.conversation_id = c.id
                ORDER BY j3.rowid DESC LIMIT 1
            )
            WHERE c.user_id = ?
            ORDER BY c.updated_at DESC, c.created_at DESC
            LIMIT ?
            """,
            (user["id"], safe_limit),
        ).fetchall()
    return {"data": [dict(row) for row in rows]}


@app.get("/api/conversations/{conversation_id}")
async def get_conversation(conversation_id: str, request: Request) -> dict[str, Any]:
    user = current_user(request)
    row = get_conversation_authorized(conversation_id, user)
    with db_connect() as conn:
        jobs = conn.execute(
            "SELECT * FROM jobs WHERE conversation_id = ? ORDER BY rowid ASC LIMIT 100",
            (conversation_id,),
        ).fetchall()
    return {
        "conversation": {
            "id": row["id"], "title": row["title"],
            "created_at": row["created_at"], "updated_at": row["updated_at"],
        },
        "data": [row_to_job(job) for job in jobs],
    }


@app.post("/api/conversations/{conversation_id}/title")
async def rename_conversation(conversation_id: str, request: Request) -> dict[str, Any]:
    user = current_user(request)
    row = get_conversation_authorized(conversation_id, user)
    payload = await request.json()
    title = str(payload.get("title") or "").strip()
    if not 1 <= len(title) <= 64:
        raise HTTPException(status_code=400, detail="标题长度须在 1–64 个字符")
    with db_connect() as conn:
        if int(row["user_id"]) != int(user["id"]):
            raise HTTPException(status_code=403, detail="只能重命名自己的对话")
        conn.execute(
            "UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?",
            (title, int(time.time()), conversation_id),
        )
    return {"ok": True, "id": conversation_id, "title": title}


@app.delete("/api/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str, request: Request) -> dict[str, Any]:
    user = current_user(request)
    row = get_conversation_authorized(conversation_id, user)
    with db_connect() as conn:
        conn.execute("BEGIN IMMEDIATE")
        jobs = conn.execute(
            "SELECT id, status, video_path, result_paths FROM jobs WHERE conversation_id = ?",
            (conversation_id,),
        ).fetchall()
        active = [job for job in jobs if job["status"] in ACTIVE_STATUSES or job["status"] == "queued"]
        if active:
            raise HTTPException(status_code=409, detail="对话中仍有进行中的任务，请先取消或删除后再删除对话")
        deleted_files = 0
        try:
            for job in jobs:
                video_path = job["video_path"]
                if video_path:
                    target = Path(video_path)
                    if (target.parent == VIDEO_DIR and not target.is_symlink()
                            and re.fullmatch(re.escape(job["id"]) + r"\.mp4", target.name)):
                        if target.is_file():
                            target.unlink()
                            deleted_files += 1
                raw_paths = job["result_paths"]
                if raw_paths:
                    try:
                        paths = json.loads(raw_paths)
                    except json.JSONDecodeError:
                        paths = []
                    for value in paths if isinstance(paths, list) else []:
                        target = Path(str(value))
                        if (target.parent == IMAGE_DIR and not target.is_symlink()
                                and SAFE_ID.match(target.name)):
                            if target.is_file():
                                target.unlink()
                                deleted_files += 1
        except OSError:
            logger.exception("Conversation deletion failed: id=%s", conversation_id)
            raise HTTPException(status_code=500, detail="部分文件删除失败，对话已保留，请重试") from None
        conn.execute("DELETE FROM jobs WHERE conversation_id = ?", (conversation_id,))
        conn.execute("DELETE FROM conversations WHERE id = ?", (conversation_id,))
    for job in jobs:
        monitor_task = monitor_tasks.get(job["id"])
        if monitor_task:
            monitor_task.cancel()
    dispatcher_wakeup.set()
    return {"ok": True, "deleted_jobs": len(jobs), "deleted_files": deleted_files}


@app.post("/api/admin/users/{user_id}/password")
async def admin_reset_password(user_id: int, request: Request) -> dict[str, Any]:
    current = current_user(request)
    require_admin(current)
    payload = await request.json()
    password = str(payload.get("password") or "")
    try:
        encoded = password_hash(password)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    with db_connect() as conn:
        target = conn.execute("SELECT id FROM users WHERE id = ?", (user_id,)).fetchone()
        if target is None:
            raise HTTPException(status_code=404, detail="用户不存在")
        conn.execute("UPDATE users SET password_hash = ? WHERE id = ?", (encoded, user_id))
        conn.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
    return {"ok": True, "user_id": user_id, "notice": "密码已重置，该用户须使用新密码重新登录。"}


@app.post("/api/admin/users/{user_id}/status")
async def admin_set_user_status(user_id: int, request: Request) -> dict[str, Any]:
    current = current_user(request)
    require_admin(current)
    payload = await request.json()
    active = bool(payload.get("is_active", False))
    with db_connect() as conn:
        target = conn.execute("SELECT id, role, is_active FROM users WHERE id = ?", (user_id,)).fetchone()
        if target is None:
            raise HTTPException(status_code=404, detail="用户不存在")
        if not active:
            if user_id == current["id"]:
                raise HTTPException(status_code=400, detail="不能停用当前登录的账号")
            if str(target["role"]) == "admin" and int(target["is_active"]):
                admin_count = int(
                    conn.execute(
                        "SELECT COUNT(*) FROM users WHERE role = 'admin' AND is_active = 1"
                    ).fetchone()[0]
                )
                if admin_count <= 1:
                    raise HTTPException(status_code=400, detail="不能停用最后一个管理员账号")
        conn.execute("UPDATE users SET is_active = ? WHERE id = ?", (1 if active else 0, user_id))
        if not active:
            conn.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
    return {"ok": True, "user_id": user_id, "is_active": active}
