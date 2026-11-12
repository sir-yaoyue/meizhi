# 美超智影（Kaishi H3 Video Studio）部署说明

AI 视频/图像创作平台：Nginx + FastAPI 网关 + 原生 JS 网页，对接本机三个模型服务。
单用户队列（全局串行）、SQLite 存储、支持多账号与管理员、深浅双主题。

## 目录内容

```
backend/    FastAPI 网关（app.py 单文件）+ 依赖清单 + 测试
web/        网页端（index.html / app.js / styles.css / vendor 本地依赖）
nginx/      Nginx 站点配置（9999 端口）
systemd/    网关服务单元
start-web.sh 一键部署脚本（root 运行）
README.md / QWEN_IMAGE.md / Z_IMAGE_API.md  接口文档
```

首次启动会自动创建 `data/`（SQLite）、`videos/`、`images/`、`logs/` 目录，无需手工准备。

## 服务器要求

1. Linux + root 权限 + Nginx + Python 3.8+
2. 三个模型服务在运行（本机端口）：
   - `127.0.0.1:8000`  MiniMax H3 视频（vLLM-Omni）
   - `127.0.0.1:8001`  Qwen-Image-2.1
   - `127.0.0.1:8003`  Z-Image（未蒸馏版）
   - 模型未启动时网站本身可正常打开和浏览，只是提交生成会提示"服务暂不可用"
3. 项目路径必须是 `/data/kaishi_h3`（脚本与配置中写死）

## 部署步骤

```bash
# 1. 把整个目录上传到服务器（保持路径 /data/kaishi_h3）
scp -r kaishi_h3 root@<服务器>:/data/

# 2. 安装后端依赖
python3 -m venv /data/kaishi_h3/venv
/data/kaishi_h3/venv/bin/pip install -r /data/kaishi_h3/backend/requirements.txt

# 3. （可选）预设管理员密码：
#    编辑 /data/kaishi_h3/systemd/kaishi-h3.service，在 [Service] 里加一行：
#    Environment=KAISHI_ADMIN_PASSWORD=你的密码
#    不设置的话，首次启动会随机生成 admin 密码并写入
#    /data/kaishi_h3/data/initial_admin_credentials.txt（权限 600，需 root 读取）

# 4. 一键部署（安装 systemd 服务 + Nginx 站点并启动）
chmod +x /data/kaishi_h3/start-web.sh
sudo /data/kaishi_h3/start-web.sh
```

## 访问

- 地址：`http://<服务器IP>:9999/`
- 账号：`admin` + 上面第 3 步的密码（预设的或 credentials 文件里的）
- 登录后在「管理」页可创建更多用户（普通用户/管理员）

## 功能一览（验收点）

- **聊天式创作**：左侧对话列表 + 中间对话流 + 底部输入框
- **五种模式**：文生视频 / 关键帧视频（首帧/尾帧/首尾帧）/ 多参考视频（图+视频+音频）/ Qwen 图像（文生图+参考图编辑）/ 造相 Z-Image（文生图+单图重绘）
- **多轮对话**：同一对话连续提交、重新编辑继承对话、侧边栏按对话分组、⋯ 菜单重命名/删除、双击标题重命名
- **轮次轨道**：宽屏右侧刻度条，点击跳转、滚动跟随高亮
- **参数**：画幅（比例+自定义 WxH）、时长 4–15s、数量、格式、重绘强度、高级参数（步数/种子/CFG/负向提示词等）
- **结构化创作**：H3 官方三段式（画面与动作/环境声音/背景音乐 + 镜头标记）
- **资产画廊**：按天分组的全部作品，图片/视频筛选，点击进对话
- **任务管理**：排队位置、实时进度（扩散步数）、取消、再次生成、下载、删除
- **双主题**：浅色（默认）/ 深色，顶栏切换
- **管理**：用户增删、重置密码、停用启用

## 常用运维命令

```bash
systemctl status kaishi-h3          # 服务状态
journalctl -u kaishi-h3 -f          # 实时日志
curl http://127.0.0.1:8010/api/health   # 网关健康（含各模型服务在线状态）
sudo nginx -t && sudo systemctl reload nginx   # 改 Nginx 配置后
```

## 测试（可选）

```bash
/data/kaishi_h3/venv/bin/python -m unittest discover -s /data/kaishi_h3/backend -p "test_*.py"
```
