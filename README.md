# Kaishi H3 Video Studio

Runtime layout:

- `web/`: browser interface served by Nginx
- `backend/`: API gateway that forwards multipart requests to vLLM-Omni
- `data/jobs.db`: SQLite task metadata
- `videos/`: completed MP4 files exposed under `/downloads/`
- `logs/`: reserved application logs
- `nginx/`: Nginx site configuration
- `systemd/`: application service definition

The gateway talks only to `http://127.0.0.1:8000` and stores completed videos
as `/data/kaishi_h3/videos/<job-id>.mp4`.
