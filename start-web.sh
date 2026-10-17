#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="/data/kaishi_h3"
UNIT_SOURCE="$PROJECT_DIR/systemd/kaishi-h3.service"
UNIT_LINK="/etc/systemd/system/kaishi-h3.service"
NGINX_SOURCE="$PROJECT_DIR/nginx/kaishi_h3.conf"
NGINX_LINK="/etc/nginx/sites-enabled/kaishi_h3"

if [[ ${EUID:-$(id -u)} -ne 0 ]]; then
  echo "错误：请使用 root 用户运行此脚本。" >&2
  exit 1
fi

for required_file in "$UNIT_SOURCE" "$NGINX_SOURCE" "$PROJECT_DIR/backend/app.py"; do
  if [[ ! -f "$required_file" ]]; then
    echo "错误：缺少文件 $required_file" >&2
    exit 1
  fi
done

if [[ ! -x "$PROJECT_DIR/venv/bin/uvicorn" ]]; then
  echo "错误：未找到后端运行程序 $PROJECT_DIR/venv/bin/uvicorn" >&2
  exit 1
fi

command -v nginx >/dev/null || {
  echo "错误：系统尚未安装 Nginx。" >&2
  exit 1
}

ln -sfn "$UNIT_SOURCE" "$UNIT_LINK"
ln -sfn "$NGINX_SOURCE" "$NGINX_LINK"

systemctl daemon-reload
nginx -t
systemctl enable --now kaishi-h3 nginx
systemctl reload nginx

if ! systemctl is-active --quiet kaishi-h3; then
  echo "错误：kaishi-h3 启动失败，最近日志如下：" >&2
  journalctl -u kaishi-h3 -n 30 --no-pager >&2
  exit 1
fi

if ! systemctl is-active --quiet nginx; then
  echo "错误：Nginx 启动失败。" >&2
  exit 1
fi

echo
echo "网页服务已启动："
echo "  Nginx       : $(systemctl is-active nginx)"
echo "  kaishi-h3   : $(systemctl is-active kaishi-h3)"
echo "  页面地址    : http://192.168.100.10:9999/"
echo
echo "网关健康状态："
curl --silent --show-error --max-time 5 http://127.0.0.1:8010/api/health || \
  echo "网关刚启动，健康接口暂时尚未响应。"
echo
