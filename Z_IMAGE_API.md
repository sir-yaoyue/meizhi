# Z-Image (undistilled) API integration

Verified on 2026-10-08 against the running server at 127.0.0.1:8003:
vLLM 0.28.0 and vLLM-Omni 0.28.0. No real generation was submitted during this change.

## Supported workflows

- Text-to-image: upstream POST /v1/images/generations, JSON.
- Single-image redraw: upstream POST /v1/images/edits, multipart/form-data.
- The installed ZImagePipeline takes only the first condition image, not multi-image fusion.
  The gateway rejects more than one image rather than silently discarding inputs.
- Redraw is ordinary img2img, not identity-preserving multi-image instruction editing.

## Website gateway

POST /api/z-image-jobs. Authenticate using the existing login cookie or Bearer API key.
Returns HTTP 202 and a queued job. Use existing /api/jobs/{id}, /runtime and authorized outputs.
Text generation uses JSON; redraw uses multipart and exactly one actual file field named image.
The client must not manually set multipart Content-Type: the client library must supply its boundary.

| Field | Gateway behavior |
| --- | --- |
| mode | generate (default) or edit (single-image redraw) |
| prompt | Required, 1–4000 characters; Chinese supported |
| model | Fixed to Z-Image (undistilled) by gateway |
| n | Integer 1–10; default 1, larger batches increase GPU memory |
| size | WIDTHxHEIGHT; default 1024x1024; gateway safety policy 256–4096 and multiples of 16 |
| num_inference_steps | Integer 1–200; default 50; official recommendation 28–50 |
| seed | Optional integer 0–9007199254740991; browser-safe subset of upstream int64 range |
| output_format | png, jpeg, webp; default png |
| response_format | Fixed to b64_json upstream; gateway saves outputs for authorized download |
| guidance_scale | 0–20, default 4; official recommendation 3–5; 0 disables CFG |
| negative_prompt | Optional, up to 4000 characters; effective with CFG enabled |
| generator_device | Optional cpu or cuda; omitted uses model default |
| image | Redraw only, exactly one PNG/JPEG/WebP upload, maximum 30 MiB |
| strength | Redraw only; default 0.6, 0 < value <= 1; larger means more changes |
| output_compression | Redraw only, 0–100, default 100; encoding setting, not model quality |

The upstream scheduler truncates its timestep schedule according to strength.
The gateway conservatively requires at least 2 remaining scheduled entries (the Turbo pipeline
can skip its terminal entry). A low strength may require more total steps. Model-log progress
can therefore have fewer total steps than the submitted num_inference_steps during redraw.
Input images are resized to the requested output dimensions; preserve aspect ratio to avoid distortion.

## Generic upstream schema is not a model capability declaration

The upstream generation schema also exposes true_cfg_scale, flow_shift,
extra_params, bot_task, system_prompt/use_system_prompt, layers, lora, vae_use_slicing,
vae_use_tiling, user and generator_device. Presence in OpenAPI does not guarantee this pipeline
uses the field. The base-model UI exposes guidance_scale and negative_prompt, not unrelated model options.
In this installed ZImagePipeline, flow_shift from extra_args is not read by the pipeline;
the resolution-dependent scheduler shift is calculated internally. No flow_shift control is shown.
VAE tiling is managed by the existing model startup script, not a new per-job UI option.

The upstream edits form additionally declares image/image[], url/url[], mask_image,
reference_image, background, stream, guidance_scale_2, resolution, layers, bot_task,
sys_type, system_prompt, return_stage_metrics, output_compression and other common controls.
This ZImagePipeline consumes only the first image, not mask_image or a separate reference_image.
The gateway intentionally does not expose remote URLs, arbitrary server LoRA paths, masks,
layer decomposition, streaming, or other models' controls. Unsupported gateway fields return 400.
Generation output_compression is not in this installed generation schema and is not forwarded.
true_cfg_scale is not used by this gateway's Z-Image path; use guidance_scale instead.

## Examples

```bash
curl http://127.0.0.1:9999/api/z-image-jobs \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"mode":"generate","prompt":"一只橘猫坐在窗边","size":"1024x1024","num_inference_steps":50,"guidance_scale":4,"seed":42}'

curl http://127.0.0.1:9999/api/z-image-jobs \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F mode=edit -F 'prompt=水彩风格的猫咪，保留原有构图' \
  -F image=@/path/to/input.png -F strength=0.6 \
  -F num_inference_steps=50 -F guidance_scale=4 -F size=1024x1024 -F seed=42
```

Qwen remains a separate entry using port 8001 and its own parameters/defaults.
Z-Image now uses port 8003. Model identity is checked both on submission and dispatch.
Old Turbo jobs retain their stored upstream and continue using the Turbo log for runtime feedback.
The existing Z-Image entry now targets the base model; the default UI mode is single-image redraw.
Upload previews and generated images can be enlarged in a native modal dialog, with fit-to-window
and original-size views. Local upload object URLs are revoked when the dialog closes.

References:
- https://docs.vllm.ai/projects/vllm-omni/en/latest/user_guide/examples/online_serving/image_to_image/
- https://huggingface.co/Tongyi-MAI/Z-Image
- Running upstream /openapi.json and the installed ZImagePipeline implementation (0.28.0).
