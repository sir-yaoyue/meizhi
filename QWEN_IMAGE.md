# Qwen-Image-2.1 创作入口

登录网页后选择「Qwen 图像创作」。支持文生图和 1–4 张参考图编辑，图片上传、排序和编号使用 FilePond，尺寸使用可输入自定义值的 Tom Select，下拉框使用 Choices。

## 网关接口

`POST /api/qwen-image-jobs` 使用现有登录 Cookie 或用户 Bearer API Key。返回 HTTP 202 和本地任务 ID；通过 `/api/jobs/{id}` 与 `/api/jobs/{id}/runtime` 查询状态，完成后使用 `outputs[].url` 预览或下载。

| 参数 | 默认值 / 要求 |
| --- | --- |
| mode | `generate`（文生图）或 `edit`（参考图编辑） |
| prompt | 必填，1–4000 字符，可使用中文 |
| size | `1024x1024`；网站限制宽高 256–4096，且均为 32 的整数倍 |
| n | 1，范围 1–10 |
| num_inference_steps | 50，范围 1–200 |
| seed | 可选，留空随机；网站接受 0–9007199254740991 |
| true_cfg_scale | 1，范围 0–20；大于 1 时需填写负面提示词 |
| negative_prompt | 可选，最多 4000 字符；使用时 True CFG 必须大于 1 |
| output_format | `png`、`jpeg`、`webp` |
| output_compression | 100，范围 0–100；JPEG/WebP 为编码质量，PNG 为压缩控制，不是模型画质档位 |
| image | 编辑模式使用 multipart 文件字段，重复传入 1–4 次；PNG/JPEG/WebP，单张 ≤30 MiB |

文生图接受 JSON。参考图编辑接受 multipart/form-data，文件字段为重复的 `image`，不能把 UploadFile 对象转成字符串。上传顺序即参考图顺序，提示词可写“第1张图片”“第2张图片”。

网关固定模型名称 `Qwen-Image-2.1`，固定返回格式 `b64_json`，不允许浏览器修改上游地址。文生图转发 `/v1/images/generations`，编辑转发 `/v1/images/edits`。本地结果保存在 `/data/kaishi_h3/images`，下载沿用用户权限和 Nginx 内部转发。

## 配置

- `QWEN_IMAGE_URL` 默认 `http://127.0.0.1:8001`
- `QWEN_IMAGE_MODEL` 默认 `Qwen-Image-2.1`
- `QWEN_IMAGE_LOG_PATH` 默认 `/tmp/qwen-image21.log`

与 H3 使用现有统一串行队列；网页提交的图片和视频任务按顺序调度。直接请求模型端口的任务不受网页队列控制。运行中图片任务不支持中途取消；排队任务可以使用现有取消接口。进度仅读取任务提交之后的有限日志窗口；没有真实步数时只显示处理中，不估算百分比。

## 验证范围

已使用模拟上游在隔离数据库中测试文生图、参考图文件顺序、中文、校验、图片落盘、下载权限、日志选择。没有为部署验证自动向模型提交生成任务。

官方参考：https://github.com/vllm-project/vllm-omni/blob/main/recipes/Qwen/Qwen-Image-2.1.md
