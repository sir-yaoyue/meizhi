const $ = (selector) => document.querySelector(selector);
const form = $("#generationForm");
const imageForm = $("#imageGenerationForm");
const zImageForm = $("#zImageForm");
const zImageServiceState = $("#zImageServiceState");
const submitButton = $("#submitButton");
const imageSubmitButton = $("#imageSubmitButton");
const qwenMode = $("#qwenMode");
const qwenPrompt = $("#qwenPrompt");
const qwenReferenceGroup = $("#qwenReferenceGroup");
const qwenReferenceMap = $("#qwenReferenceMap");
const qwenServiceState = $("#qwenServiceState");
const referenceInput = $("#referenceInput");
const videoReferenceInput = $("#videoReferenceInput");
const audioReferenceInput = $("#audioReferenceInput");
const uploadZone = $("#uploadZone");
const referenceMap = $("#referenceMap");
const videoReferenceMap = $("#videoReferenceMap");
const audioReferenceMap = $("#audioReferenceMap");
const videoUploadGroup = $("#videoUploadGroup");
const audioUploadGroup = $("#audioUploadGroup");
const fl2vaFrameMode = $("#fl2vaFrameMode");
const frameModeInput = $("#frameModeInput");
const imageUploadLimit = $("#imageUploadLimit");
const referenceGuideTitle = $("#referenceGuideTitle");
const referenceGuideText = $("#referenceGuideText");
const promptInput = $("#promptInput");
const promptReferenceHint = $("#promptReferenceHint");
const promptCounter = $("#promptCounter");
const emptyState = $("#emptyState");
const jobContent = $("#jobContent");
const jobStatus = $("#jobStatus");
const jobId = $("#jobId");
const progressBar = $("#progressBar");
const statusMessage = $("#statusMessage");
const runtimeEvents = $("#runtimeEvents");
const videoPlayer = $("#videoPlayer");
const imageGallery = $("#imageGallery");
const downloadBox = $("#downloadBox");
const downloadButton = $("#downloadButton");
const serverPath = $("#serverPath");
const errorBox = $("#errorBox");
const historyList = $("#historyList");
const serviceState = $("#serviceState");
const toast = $("#toast");
const sizeInput = $("#sizeInput");
const secondsInput = $("#secondsInput");
const loginScreen = $("#loginScreen");
const loginForm = $("#loginForm");
const loginError = $("#loginError");
const appShell = $("#appShell");
const userControls = $("#userControls");
const userBadge = $("#userBadge");
const adminPanel = $("#adminPanel");
const adminUserForm = $("#adminUserForm");
const userList = $("#userList");
const apiKeyButton = $("#apiKeyButton");
const apiKeyModal = $("#apiKeyModal");
const apiKeyClose = $("#apiKeyClose");
const apiServerUrl = $("#apiServerUrl");
const apiKeyValue = $("#apiKeyValue");
const apiKeyStatus = $("#apiKeyStatus");
const generateApiKey = $("#generateApiKey");
const copyApiKey = $("#copyApiKey");
const revokeApiKey = $("#revokeApiKey");
const taskType = $("#taskType");
const modeCards = [...document.querySelectorAll(".mode-card")];
const themeToggle = $("#themeToggle");
const themeToggleLogin = $("#themeToggleLogin");
const introSection = $("#introSection");
const introCollapsedBar = $("#introCollapsedBar");
const liveJobChips = $("#liveJobChips");
const jobElapsed = $("#jobElapsed");
const jobActions = $("#jobActions");
const cancelJobButton = $("#cancelJobButton");
const retryJobButton = $("#retryJobButton");

/* ---------- 主题切换 ---------- */
function currentTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem("kaishi_theme", theme); } catch (e) {}
  const label = theme === "light" ? "☾ 深色" : "☀ 浅色";
  for (const el of [themeToggle, themeToggleLogin]) {
    if (el) el.textContent = label;
  }
}
function toggleTheme() {
  applyTheme(currentTheme() === "light" ? "dark" : "light");
}
themeToggle.addEventListener("click", toggleTheme);
themeToggleLogin.addEventListener("click", toggleTheme);
applyTheme(currentTheme());

/* ---------- 简介折叠 ---------- */
function setIntroCollapsed(collapsed) {
  introSection.hidden = collapsed;
  introCollapsedBar.hidden = !collapsed;
  try { localStorage.setItem("kaishi_intro_collapsed", collapsed ? "1" : "0"); } catch (e) {}
}
$("#introToggle").addEventListener("click", () => setIntroCollapsed(true));
$("#introExpand").addEventListener("click", () => setIntroCollapsed(false));
let savedIntro = "0";
try { savedIntro = localStorage.getItem("kaishi_intro_collapsed") || "0"; } catch (e) {}
setIntroCollapsed(savedIntro === "1");

/* ---------- 密码显示/隐藏 ---------- */
const SVG_EYE = '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.173 8"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.328 6.672A6.5 6.5 0 1 1 9.5 12.783 6.5 6.5 0 0 1 4.328 6.672"/></svg>';
const SVG_EYE_SLASH = '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.29 9.28a4.5 4.5 0 0 1 .97-4.95l.82-.82a4.5 4.5 0 0 1 4.95-.97ZM11.21 7.75 12.79 6.18 9.55 2.94A6 6 0 0 0 11 5.15l.21.21a6 6 0 0 0 1.58 1.39l-.21.21M6.29 10.75 4.71 12.32l3.24 3.24a6 6 0 0 0 1.31-1.51l-.21-.21a6 6 0 0 0-1.58-1.39l-.21-.21a6 6 0 0 0-1.58-1.39ZM4.46 2.94 6.55 5.03 7 4.59A6 6 0 0 0 3.96 3.96ZM7.75 6.29l1.58-1.58a.75.75 0 0 0-1.06-1.06l-1.58 1.58Z"/><path d="M2 2a.75.75 0 0 1 .75.75v.53a9.9 9.9 0 0 1 8.69 8.69h.53a.75.75 0 1 1 0 1.5h-.53a9.9 9.9 0 0 1-8.69-8.69H2A.75.75 0 0 1 2 2Z"/></svg>';
document.querySelectorAll(".password-toggle").forEach((button) => {
  const input = document.getElementById(button.dataset.target);
  if (!input) return;
  const render = () => {
    const revealed = input.type === "text";
    button.innerHTML = revealed ? SVG_EYE_SLASH : SVG_EYE;
    button.classList.toggle("revealed", revealed);
    button.setAttribute("aria-label", revealed ? "隐藏密码" : "显示密码");
  };
  button.addEventListener("click", () => {
    input.type = input.type === "password" ? "text" : "password";
    render();
  });
  render();
});

let currentUser = null;
let activeJobId = null;
let pollTimer = null;
let queueRefreshTimer = null;
let healthRequestPending = false;
let activeMode = "t2va";

const labels = {
  queued: "排队中", submitting: "正在提交", in_progress: "生成中",
  completed: "已完成", failed: "生成失败", cancelled: "已取消",
};
const phaseLabels = {
  queued: "队列等待", submitting: "提交模型", in_progress: "模型处理中",
  loading: "加载输入", generating: "扩散生成", encoding: "视频编码",
  saving: "保存结果", completed: "生成完成",
};
const taskLabels = {
  t2va: "T2VA 文生音视频", fl2va: "FL2VA", ref2va: "Ref2VA",
  text_to_image: "文生图", qwen_text_to_image: "Qwen 文生图", qwen_image_edit: "Qwen 参考图编辑",
  z_image_text_to_image: "造相 Z-Image-Turbo",
  z_image_image_to_image: "造相单图重绘",
  z_image_base_text_to_image: "Z-Image 文生图",
  z_image_base_image_to_image: "Z-Image 单图重绘",
};

FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
);
function createReferencePond(input, options) {
  return FilePond.create(input, {
    allowMultiple: true,
    allowReorder: true,
    allowProcess: false,
    credits: false,
    itemInsertLocation: "after",
    labelFileWaitingForSize: "正在读取",
    labelFileSizeNotAvailable: "大小未知",
    labelFileLoading: "正在载入",
    labelFileLoadError: "载入失败",
    labelFileProcessing: "处理中",
    labelFileProcessingComplete: "处理完成",
    labelFileProcessingAborted: "处理已取消",
    labelFileProcessingError: "处理失败",
    labelTapToCancel: "点击取消",
    labelTapToRetry: "点击重试",
    labelTapToUndo: "点击撤销",
    ...options,
  });
}

let referencePond = createReferencePond(referenceInput, {
  allowMultiple: false,
  maxFileSize: "30MB",
  acceptedFileTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
  labelIdle: "拖入参考图片，或 <span class=\"filepond--label-action\">选择文件</span>",
  labelInvalidField: "图片格式不受支持",
  labelFileTypeNotAllowed: "仅支持 JPEG、PNG、WebP、HEIC/HEIF 图片",
  labelMaxFileSizeExceeded: "图片超过 30MB 限制",
  labelMaxFileSize: "单张图片最大 30MB",
  onupdatefiles: () => renderMediaMap(referencePond, referenceMap, "图片"),
  onreorderfiles: () => renderMediaMap(referencePond, referenceMap, "图片"),
});

const videoReferencePond = createReferencePond(videoReferenceInput, {
  maxFiles: 3,
  maxFileSize: "50MB",
  acceptedFileTypes: ["video/mp4", "video/quicktime"],
  labelIdle: "拖入参考视频，或 <span class=\"filepond--label-action\">选择文件</span>",
  labelInvalidField: "视频格式不受支持",
  labelFileTypeNotAllowed: "仅支持 MP4、MOV 视频",
  labelMaxFileSizeExceeded: "视频超过 50MB 限制",
  labelMaxFileSize: "单个视频最大 50MB",
  onupdatefiles: () => renderMediaMap(videoReferencePond, videoReferenceMap, "视频"),
  onreorderfiles: () => renderMediaMap(videoReferencePond, videoReferenceMap, "视频"),
});

const audioReferencePond = createReferencePond(audioReferenceInput, {
  maxFiles: 3,
  maxFileSize: "15MB",
  acceptedFileTypes: ["audio/wav", "audio/x-wav", "audio/mpeg"],
  labelIdle: "拖入参考音频，或 <span class=\"filepond--label-action\">选择文件</span>",
  labelInvalidField: "音频格式不受支持",
  labelFileTypeNotAllowed: "仅支持 WAV、MP3 音频",
  labelMaxFileSizeExceeded: "音频超过 15MB 限制",
  labelMaxFileSize: "单个音频最大 15MB",
  onupdatefiles: () => renderMediaMap(audioReferencePond, audioReferenceMap, "音频"),
  onreorderfiles: () => renderMediaMap(audioReferencePond, audioReferenceMap, "音频"),
});

const qwenReferencePond = createReferencePond($("#qwenReferenceInput"), {
  maxFiles: 4,
  maxFileSize: "30MB",
  acceptedFileTypes: ["image/png", "image/jpeg", "image/webp"],
  labelIdle: "拖入 1–4 张参考图片，或 <span class=\"filepond--label-action\">选择文件</span>",
  labelFileTypeNotAllowed: "仅支持 PNG、JPEG、WebP 图片",
  labelMaxFileSizeExceeded: "图片超过 30MB 限制",
  onupdatefiles: () => renderMediaMap(qwenReferencePond, qwenReferenceMap, "图片", qwenPrompt),
  onreorderfiles: () => renderMediaMap(qwenReferencePond, qwenReferenceMap, "图片", qwenPrompt),
});

function insertPromptReference(kind, index, target = promptInput) {
  const token = target === qwenPrompt ? `第${index}张图片` : `${kind}${index}`;
  const start = target.selectionStart ?? target.value.length;
  const end = target.selectionEnd ?? start;
  const before = target.value.slice(0, start);
  const after = target.value.slice(end);
  const spacer = before && !/[\s，。；：、]$/.test(before) ? " " : "";
  target.value = `${before}${spacer}${token}${after}`;
  const caret = before.length + spacer.length + token.length;
  target.focus();
  target.setSelectionRange(caret, caret);
  target.dispatchEvent(new Event("input", { bubbles: true }));
}

function renderMediaMap(pond, map, kind, target = promptInput) {
  if (!pond || !map) return;
  map.replaceChildren();
  pond.getFiles().forEach((item, index) => {
    const row = document.createElement("li");
    const badge = document.createElement("b");
    const name = document.createElement("span");
    const insert = document.createElement("button");
    badge.textContent = `${kind} ${index + 1}`;
    name.textContent = item.file.name;
    insert.type = "button";
    insert.textContent = "插入提示词";
    insert.addEventListener("click", () => insertPromptReference(kind, index + 1, target));
    row.append(badge, name, insert);
    map.append(row);
  });
}

function clearReferenceMedia() {
  referencePond.removeFiles();
  videoReferencePond.removeFiles();
  audioReferencePond.removeFiles();
}

function updateFl2vaFrameMode() {
  if (activeMode !== "fl2va") return;
  const firstLast = frameModeInput.value === "first_last";
  referencePond.setOptions({
    allowMultiple: firstLast,
    maxFiles: firstLast ? 2 : 1,
    labelIdle: firstLast
      ? "依次拖入首帧和尾帧，或 <span class=\"filepond--label-action\">选择两张图片</span>"
      : `拖入${frameModeInput.value === "last" ? "尾帧" : "首帧"}图片，或 <span class=\"filepond--label-action\">选择文件</span>`,
  });
  while (referencePond.getFiles().length > (firstLast ? 2 : 1)) {
    referencePond.removeFile(referencePond.getFiles().at(-1).id);
  }
}

function errorText(value) {
  if (!value) return "";
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

let toastTimer = null;
function showToast(message, kind = "info") {
  toast.textContent = message;
  toast.className = `toast show ${kind}`;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { toast.className = "toast"; }, 3200);
}

/* ---------- 应用内确认 / 输入对话框 ---------- */
let confirmResolver = null;
function askConfirm({ title = "确认操作", message = "", okLabel = "确认", primary = false }) {
  return new Promise((resolve) => {
    confirmResolver = resolve;
    $("#confirmTitle").textContent = title;
    $("#confirmMessage").textContent = message;
    const okButton = $("#confirmOkButton");
    okButton.textContent = okLabel;
    okButton.className = primary ? "solid-primary" : "danger-button";
    $("#confirmModal").hidden = false;
    okButton.focus();
  });
}
function closeConfirm(result) {
  if (!$("#confirmModal").hidden) $("#confirmModal").hidden = true;
  if (confirmResolver) { confirmResolver(result); confirmResolver = null; }
}
$("#confirmOkButton").addEventListener("click", () => closeConfirm(true));
$("#confirmCancelButton").addEventListener("click", () => closeConfirm(false));
$("#confirmModal").addEventListener("click", (event) => {
  if (event.target === $("#confirmModal")) closeConfirm(false);
});

let promptResolver = null;
function askPrompt({ title = "输入", label = "新密码（至少 8 个字符）" }) {
  return new Promise((resolve) => {
    promptResolver = resolve;
    $("#promptTitle").textContent = title;
    $("#promptLabel").textContent = label;
    const input = $("#promptInputValue");
    input.value = "";
    input.setCustomValidity("");
    $("#promptModal").hidden = false;
    input.focus();
  });
}
function closePrompt(result) {
  if (!$("#promptModal").hidden) $("#promptModal").hidden = true;
  if (promptResolver) { promptResolver(result); promptResolver = null; }
}
$("#promptOkButton").addEventListener("click", () => {
  const input = $("#promptInputValue");
  const value = input.value.trim();
  if (value.length < 8) {
    input.setCustomValidity("密码至少需要 8 个字符");
    input.reportValidity();
    return;
  }
  closePrompt(value);
});
$("#promptCancelButton").addEventListener("click", () => closePrompt(null));
$("#promptModal").addEventListener("click", (event) => {
  if (event.target === $("#promptModal")) closePrompt(null);
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!$("#confirmModal").hidden) closeConfirm(false);
  if (!$("#promptModal").hidden) closePrompt(null);
});

document.querySelectorAll('input:not([type="hidden"]):not([type="file"]), textarea').forEach((element) => {
  element.classList.add("form-control");
});
document.querySelectorAll('select:not([data-component="combobox"])').forEach((element) => element.classList.add("form-select"));

const selectComponents = new Map();
document.querySelectorAll('select:not([data-component="combobox"])').forEach((element) => {
  const hasEmptyOption = [...element.options].some((option) => option.value === "");
  selectComponents.set(element, new TomSelect(element, {
    allowEmptyOption: hasEmptyOption,
    closeAfterSelect: true,
    maxItems: 1,
    persist: false,
    create: false,
    placeholder: null,
    loadingPlaceholder: null,
    sortFunction: () => 0,
  }));
});

const sizeComponent = new TomSelect(sizeInput, {
  allowEmptyOption: true,
  closeAfterSelect: true,
  createOnBlur: true,
  maxItems: 1,
  persist: false,
  placeholder: "输入尺寸或选择官方推荐尺寸",
  createFilter(input) {
    return /^\s*\d{2,5}\s*[xX×*]\s*\d{2,5}\s*$/.test(input);
  },
  create(input) {
    const value = normalizeSize(input);
    return { value, text: `${value} · 自定义尺寸` };
  },
});

function updateVideoShortEdge() {
  const explicitSize = Boolean(sizeComponent.getValue());
  $("#videoShortEdge").disabled = explicitSize;
  $("#videoShortEdgeHint").textContent = explicitSize
    ? "已指定输出宽高，短边参数不传入模型。"
    : "自适应尺寸固定使用短边 768，保持参考图片比例。";
}
sizeInput.addEventListener("change", updateVideoShortEdge);

["#qwenSize", "#zImageSize"].forEach((selector) => new TomSelect($(selector), {
  closeAfterSelect: true,
  createOnBlur: true,
  maxItems: 1,
  persist: false,
  placeholder: "选择常用尺寸或输入宽x高",
  createFilter(input) {
    return /^\s*\d{2,5}\s*[xX×*]\s*\d{2,5}\s*$/.test(input);
  },
  create(input) {
    const value = normalizeSize(input);
    return { value, text: `${value} · 自定义尺寸` };
  },
}));

const zImageReferencePond = createReferencePond($("#zImageReferenceInput"), {
  allowMultiple: false, maxFiles: 1, maxFileSize: "30MB",
  acceptedFileTypes: ["image/png", "image/jpeg", "image/webp"],
  labelIdle: '拖入一张原图，或 <span class="filepond--label-action">选择图片</span>',
  onupdatefiles: (files) => { $("#zImagePreviewButton").disabled = !files.length; },
});
const imagePreviewDialog = $("#imagePreviewDialog");
const imagePreviewImage = $("#imagePreviewImage");
let previewObjectUrl = null;
function openImagePreview(src, title, objectUrl = false) {
  if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
  previewObjectUrl = objectUrl ? src : null;
  $("#imagePreviewTitle").textContent = title;
  $("#imagePreviewBody").classList.remove("original-size");
  $("#imagePreviewZoom").textContent = "原始尺寸";
  $("#imagePreviewInfo").textContent = "正在加载图片…";
  imagePreviewImage.alt = title;
  imagePreviewImage.src = src;
  if (!imagePreviewDialog.open) imagePreviewDialog.showModal();
}
imagePreviewImage.addEventListener("load", () => {
  $("#imagePreviewInfo").textContent = `${imagePreviewImage.naturalWidth} × ${imagePreviewImage.naturalHeight} · Esc 或点击遮罩关闭`;
});
imagePreviewImage.addEventListener("error", () => {
  $("#imagePreviewInfo").textContent = "图片加载失败，请检查登录状态或重新选择图片。";
});
$("#imagePreviewClose").addEventListener("click", () => imagePreviewDialog.close());
imagePreviewDialog.addEventListener("click", (event) => {
  if (event.target !== imagePreviewDialog) return;
  const bounds = imagePreviewDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) imagePreviewDialog.close();
});
imagePreviewDialog.addEventListener("close", () => {
  imagePreviewImage.removeAttribute("src");
  if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
  previewObjectUrl = null;
});
$("#imagePreviewZoom").addEventListener("click", () => {
  const original = $("#imagePreviewBody").classList.toggle("original-size");
  $("#imagePreviewZoom").textContent = original ? "适应窗口" : "原始尺寸";
});
$("#zImagePreviewButton").addEventListener("click", () => {
  const reference = zImageReferencePond.getFiles()[0];
  if (reference) openImagePreview(URL.createObjectURL(reference.file), "重绘原图", true);
});
function updateZImageMode() {
  const edit = $("#zImageMode").value === "edit";
  $("#zImageReferenceGroup").hidden = !edit;
  $("#zImageStrength").disabled = !edit;
  $("#zImageCompressionGroup").hidden = !edit;
  $("#zImageCompression").disabled = !edit;
  zImageReferencePond.setOptions({ disabled: !edit });
}
$("#zImageMode").addEventListener("change", updateZImageMode);
updateZImageMode();

function updateQwenMode() {
  const edit = qwenMode.value === "edit";
  qwenReferenceGroup.hidden = !edit;
  qwenReferencePond.setOptions({ disabled: !edit });
}
qwenMode.addEventListener("change", updateQwenMode);
updateQwenMode();

function showLogin(message = "") {
  if (imagePreviewDialog.open) imagePreviewDialog.close();
  closeConfirm(false);
  closePrompt(null);
  currentUser = null;
  loginScreen.hidden = false;
  appShell.hidden = true;
  userControls.hidden = true;
  window.clearTimeout(pollTimer);
  window.clearTimeout(queueRefreshTimer);
  loginError.textContent = message;
  loginError.hidden = !message;
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = errorText(data.detail || data) || `请求失败：HTTP ${response.status}`;
    if (response.status === 401) showLogin(message);
    throw new Error(message);
  }
  return data;
}

async function showApplication(user) {
  currentUser = user;
  loginScreen.hidden = true;
  appShell.hidden = false;
  userControls.hidden = false;
  userBadge.textContent = `${user.username}${user.role === "admin" ? " · 管理员" : ""}`;
  adminPanel.hidden = user.role !== "admin";
  await Promise.all([checkHealth(), loadHistory(), user.role === "admin" ? loadUsers() : Promise.resolve()]);
}

const videoModeSizes = new Map([["t2va", ""], ["fl2va", "2560x1440"], ["ref2va", ""]]);

function selectMode(mode) {
  if (videoModeSizes.has(activeMode)) videoModeSizes.set(activeMode, sizeComponent.getValue());
  activeMode = mode;
  modeCards.forEach((card) => {
    const selected = card.dataset.mode === mode;
    card.classList.toggle("active", selected);
    card.setAttribute("aria-pressed", String(selected));
  });
  const imageMode = mode === "qwen_image" || mode === "z_image";
  form.hidden = imageMode;
  imageForm.hidden = mode !== "qwen_image";
  zImageForm.hidden = mode !== "z_image";
  if (imageMode) {
    checkHealth();
    return;
  }
  taskType.value = mode;
  sizeComponent.setValue(videoModeSizes.get(mode) || "", true);
  updateVideoShortEdge();
  const textOnly = mode === "t2va";
  uploadZone.hidden = textOnly;
  fl2vaFrameMode.hidden = mode !== "fl2va";
  videoUploadGroup.hidden = mode !== "ref2va";
  audioUploadGroup.hidden = mode !== "ref2va";
  referencePond.setOptions({ disabled: textOnly, allowMultiple: mode === "ref2va", maxFiles: mode === "ref2va" ? 9 : 1 });
  videoReferencePond.setOptions({ disabled: mode !== "ref2va" });
  audioReferencePond.setOptions({ disabled: mode !== "ref2va" });
  if (mode === "ref2va") {
    referencePond.setOptions({ labelIdle: "拖入最多 9 张参考图片，或 <span class=\"filepond--label-action\">选择文件</span>" });
  } else if (mode === "fl2va") {
    updateFl2vaFrameMode();
  }
  imageUploadLimit.textContent = mode === "fl2va"
    ? "JPG / PNG / WebP / HEIC；支持首帧、尾帧或首尾两帧"
    : "JPG / PNG / WebP / HEIC，单张不超过 30MB，最多 9 张";
  referenceGuideTitle.textContent = mode === "ref2va" ? "多媒体编号与提示词定位" : "FL2VA 关键帧说明";
  referenceGuideText.textContent = mode === "ref2va"
    ? "图片、视频、音频分别编号；可在提示词中写图片1、视频1、音频1。音频必须与图片或视频一起使用。"
    : "关键帧方式会自动传入 frame_indices；首尾帧模式的两张图顺序必须是首帧、尾帧。";
  promptReferenceHint.hidden = mode !== "ref2va";
  clearReferenceMedia();
  renderMediaMap(referencePond, referenceMap, "图片");
  renderMediaMap(videoReferencePond, videoReferenceMap, "视频");
  renderMediaMap(audioReferencePond, audioReferenceMap, "音频");
}

modeCards.forEach((card) => card.addEventListener("click", () => {
  if (card.dataset.mode !== activeMode) selectMode(card.dataset.mode);
}));
frameModeInput.addEventListener("change", () => {
  referencePond.removeFiles();
  updateFl2vaFrameMode();
});
selectMode(activeMode);

function updatePromptCounter() {
  promptCounter.textContent = `${promptInput.value.length} / ${promptInput.maxLength}`;
}
promptInput.addEventListener("input", updatePromptCounter);
updatePromptCounter();

function bindPromptCounter(textarea, counter) {
  if (!textarea || !counter) return;
  const update = () => { counter.textContent = `${textarea.value.length} / ${textarea.maxLength || 4000}`; };
  textarea.addEventListener("input", update);
  update();
}
bindPromptCounter(qwenPrompt, $("#qwenPromptCounter"));
bindPromptCounter($("#zImagePrompt"), $("#zImagePromptCounter"));

function normalizeDuration() {
  const value = Number(secondsInput.value);
  if (!Number.isFinite(value)) {
    secondsInput.value = "4";
  } else {
    secondsInput.value = String(Math.min(15, Math.max(4, value)));
  }
  secondsInput.setCustomValidity("");
}
secondsInput.addEventListener("change", normalizeDuration);
secondsInput.addEventListener("invalid", () => {
  secondsInput.setCustomValidity("视频时长必须在 4 到 15 秒之间");
});
secondsInput.addEventListener("input", () => secondsInput.setCustomValidity(""));

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = loginForm.querySelector("button");
  button.disabled = true;
  loginError.hidden = true;
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: $("#loginUsername").value, password: $("#loginPassword").value }),
    });
    const payload = await parseResponse(response);
    loginForm.reset();
    await showApplication(payload.user);
  } catch (error) {
    loginError.textContent = error.message;
    loginError.hidden = false;
  } finally { button.disabled = false; }
});

$("#logoutButton").addEventListener("click", async () => {
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
  showLogin();
});

async function refreshApiKeyStatus() {
  const payload = await parseResponse(await fetch("/api/auth/api-key", { cache: "no-store" }));
  apiKeyStatus.textContent = payload.configured
    ? `已配置：${payload.key.token_prefix}…${payload.key.last_used_at ? " · 已使用" : " · 尚未使用"}`
    : "尚未生成 API Key";
}

apiKeyButton.addEventListener("click", async () => {
  apiServerUrl.value = window.location.origin;
  apiKeyValue.value = "";
  apiKeyModal.hidden = false;
  try { await refreshApiKeyStatus(); } catch (error) { showToast(error.message, "error"); }
});
apiKeyClose.addEventListener("click", () => { apiKeyModal.hidden = true; });
apiKeyModal.addEventListener("click", (event) => {
  if (event.target === apiKeyModal) apiKeyModal.hidden = true;
});
generateApiKey.addEventListener("click", async () => {
  const ok = await askConfirm({
    title: "生成新 API 密钥",
    message: "生成新密钥会立即使旧密钥失效，工作流中的旧密钥将无法继续调用。是否继续？",
    okLabel: "生成新密钥",
  });
  if (!ok) return;
  generateApiKey.disabled = true;
  try {
    const payload = await parseResponse(await fetch("/api/auth/api-key", { method: "POST" }));
    apiKeyValue.value = payload.api_key;
    apiKeyStatus.textContent = payload.notice;
  } catch (error) { showToast(error.message, "error"); }
  finally { generateApiKey.disabled = false; }
});
copyApiKey.addEventListener("click", async () => {
  if (!apiKeyValue.value) { showToast("请先生成 API Key"); return; }
  await navigator.clipboard.writeText(apiKeyValue.value);
  showToast("API Key 已复制", "success");
});
revokeApiKey.addEventListener("click", async () => {
  const ok = await askConfirm({
    title: "撤销 API 密钥",
    message: "确定撤销当前 API Key 吗？撤销后工作流将立即无法调用。",
    okLabel: "撤销密钥",
  });
  if (!ok) return;
  try {
    await parseResponse(await fetch("/api/auth/api-key", { method: "DELETE" }));
    apiKeyValue.value = "";
    await refreshApiKeyStatus();
    showToast("API Key 已撤销", "success");
  } catch (error) { showToast(error.message, "error"); }
});

async function loadSession() {
  try {
    const payload = await parseResponse(await fetch("/api/auth/me", { cache: "no-store" }));
    await showApplication(payload.user);
  } catch { showLogin(); }
}

async function loadUsers() {
  if (currentUser?.role !== "admin") return;
  try {
    const payload = await parseResponse(await fetch("/api/admin/users", { cache: "no-store" }));
    userList.replaceChildren();
    payload.data.forEach((user) => {
      const item = document.createElement("div");
      item.className = "user-row";
      const name = document.createElement("strong");
      name.textContent = user.username;
      const meta = document.createElement("span");
      meta.textContent = `${user.role === "admin" ? "管理员" : "普通用户"} · ${user.is_active ? "已启用" : "已停用"}`;
      const actions = document.createElement("span");
      actions.className = "user-actions";
      const resetButton = document.createElement("button");
      resetButton.type = "button";
      resetButton.className = "user-action-btn";
      resetButton.textContent = "重置密码";
      resetButton.addEventListener("click", async () => {
        resetButton.disabled = true;
        try {
          const password = await askPrompt({ title: `重置 ${user.username} 的密码`, label: "新密码（至少 8 个字符）" });
          if (password === null) return;
          await parseResponse(await fetch(`/api/admin/users/${user.id}/password`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          }));
          showToast(`用户 ${user.username} 的密码已重置`, "success");
        } catch (error) {
          showToast(error.message, "error");
        } finally {
          resetButton.disabled = false;
        }
      });
      const statusButton = document.createElement("button");
      statusButton.type = "button";
      statusButton.className = "user-action-btn";
      statusButton.textContent = user.is_active ? "停用" : "启用";
      if (user.id === currentUser.id && user.is_active) statusButton.disabled = true;
      statusButton.addEventListener("click", async () => {
        const nextActive = !user.is_active;
        if (!nextActive) {
          const ok = await askConfirm({
            title: "停用账号",
            message: `确定停用“${user.username}”吗？停用后该用户将立即退出并无法登录。`,
            okLabel: "停用账号",
          });
          if (!ok) return;
        }
        statusButton.disabled = true;
        try {
          await parseResponse(await fetch(`/api/admin/users/${user.id}/status`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_active: nextActive }),
          }));
          showToast(nextActive ? `用户 ${user.username} 已启用` : `用户 ${user.username} 已停用`, "success");
          await loadUsers();
        } catch (error) {
          showToast(error.message, "error");
          statusButton.disabled = false;
        }
      });
      const action = document.createElement("button");
      action.type = "button";
      action.className = "user-action-btn danger";
      if (user.id === currentUser.id) {
        action.textContent = "当前账号";
        action.disabled = true;
      } else {
        action.textContent = "删除";
        action.setAttribute("aria-label", `删除用户 ${user.username}`);
        action.addEventListener("click", async () => {
          const ok = await askConfirm({
            title: "删除用户",
            message: `确定删除用户“${user.username}”吗？该用户将立即无法登录，其任务记录仍保留。`,
            okLabel: "删除用户",
          });
          if (!ok) return;
          action.disabled = true;
          try {
            await parseResponse(await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" }));
            showToast(`用户 ${user.username} 已删除`, "success");
            await loadUsers();
          } catch (error) {
            showToast(error.message, "error");
            action.disabled = false;
          }
        });
      }
      actions.append(resetButton, statusButton, action);
      item.append(name, meta, actions);
      userList.append(item);
    });
  } catch (error) { showToast(error.message, "error"); }
}

adminUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(adminUserForm);
  const button = adminUserForm.querySelector("button");
  button.disabled = true;
  try {
    await parseResponse(await fetch("/api/admin/users", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(data.entries())),
    }));
    adminUserForm.reset();
    await loadUsers();
    showToast("用户创建成功", "success");
  } catch (error) { showToast(error.message, "error"); }
  finally { button.disabled = false; }
});

function normalizeSize(value) {
  return value.trim().toLowerCase().replace(/[×*]/g, "x").replace(/\s+/g, "");
}

function renderRuntime(runtime) {
  if (!runtime) { runtimeEvents.hidden = true; runtimeEvents.replaceChildren(); return; }
  runtimeEvents.replaceChildren();
  const phase = document.createElement("div");
  phase.className = "runtime-phase";
  phase.textContent = phaseLabels[runtime.phase] || runtime.phase || "处理中";
  if (runtime.step && runtime.total_steps) phase.textContent += ` · ${runtime.step}/${runtime.total_steps} 步`;
  runtimeEvents.append(phase);
  (runtime.events || []).slice(-5).forEach((entry) => {
    const item = document.createElement("div");
    item.className = `runtime-event ${entry.type || ""}`;
    item.textContent = entry.message;
    runtimeEvents.append(item);
  });
  runtimeEvents.hidden = false;
}

function renderJob(job, runtime = null) {
  const deleteVideoButton = $("#deleteVideoButton");
  const imageResult = job.result_type === "image";
  deleteVideoButton.dataset.resultType = imageResult ? "image" : "video";
  deleteVideoButton.textContent = imageResult ? "删除本次全部图片" : "删除此视频";
  deleteVideoButton.hidden = !(job.status === "completed" && (imageResult ? job.outputs?.length : job.download_url));
  activeJobId = job.id; emptyState.hidden = true; jobContent.hidden = false;
  jobId.textContent = job.id; jobStatus.textContent = labels[job.status] || job.status;
  jobStatus.className = `status-pill ${job.status || ""}`;
  const measured = runtime?.progress ?? job.progress ?? 0;
  const progress = job.status === "completed" ? 100 : Math.max(job.status === "queued" ? 0 : 3, Number(measured));
  progressBar.style.width = `${Math.min(progress, 100)}%`;
  const outputName = job.result_type === "image" ? "图片" : "视频";
  const messages = {
    queued: `任务正在队列等待${job.queue_position ? ` · 前方 ${job.queue_position - 1} 个任务` : ""}`,
    submitting: "正在将任务提交到模型服务。",
    in_progress: `模型正在生成${outputName}${runtime?.generation_progress != null ? ` · ${runtime.generation_progress}%` : ""}`,
    completed: job.inference_time_s ? `生成完成，用时 ${Number(job.inference_time_s).toFixed(1)} 秒。` : "生成完成，可以预览或下载。",
    failed: "生成失败，请查看错误信息后重试。", cancelled: "任务已取消。",
  };
  statusMessage.textContent = messages[job.status] || "正在获取任务状态……";
  if (job.status === "in_progress" || job.status === "submitting") {
    const start = Number(job.started_at || 0);
    jobElapsed.hidden = !start;
    jobElapsed.textContent = start ? `已运行 ${formatElapsed(Date.now() / 1000 - start)}` : "";
  } else {
    jobElapsed.hidden = true;
  }
  cancelJobButton.hidden = job.status !== "queued";
  retryJobButton.hidden = !["failed", "cancelled"].includes(job.status);
  jobActions.hidden = cancelJobButton.hidden && retryJobButton.hidden;
  renderRuntime(runtime);
  imageGallery.replaceChildren();
  imageGallery.hidden = true;
  if (job.download_url) {
    const cacheSafeUrl = `${job.download_url}?v=${job.updated_at || Date.now()}`;
    videoPlayer.src = cacheSafeUrl; videoPlayer.hidden = false; downloadBox.hidden = false;
    downloadButton.href = job.download_url; downloadButton.download = `${job.id}.mp4`;
    serverPath.textContent = `/data/kaishi_h3/videos/${job.id}.mp4`;
  } else {
    videoPlayer.hidden = true; videoPlayer.removeAttribute("src"); downloadBox.hidden = true;
  }
  if (job.result_type === "image" && job.outputs?.length) {
    videoPlayer.hidden = true; videoPlayer.removeAttribute("src"); downloadBox.hidden = true;
    job.outputs.forEach((output, index) => {
      const card = document.createElement("div"); card.className = "generated-image";
      const image = document.createElement("img"); image.src = `${output.url}?v=${job.updated_at || Date.now()}`; image.alt = `生成图片 ${index + 1}`;
      const link = document.createElement("a"); link.className = "download-button"; link.href = output.url; link.download = output.name; link.textContent = `下载图片 ${index + 1}`;
      const preview = document.createElement("button"); preview.type = "button"; preview.className = "image-preview-trigger";
      preview.setAttribute("aria-label", `放大预览生成图片 ${index + 1}`);
      preview.title = "点击放大预览"; preview.append(image);
      preview.addEventListener("click", () => openImagePreview(image.src, `生成图片 ${index + 1}`));
      card.append(preview, link); imageGallery.append(card);
    });
    imageGallery.hidden = false;
  }
  const failure = errorText(job.error); errorBox.hidden = !failure; errorBox.textContent = failure;
}

function formatElapsed(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  if (hours) return `${hours} 小时 ${minutes} 分`;
  if (minutes) return `${minutes} 分 ${rest} 秒`;
  return `${rest} 秒`;
}

function focusJob(job) {
  window.clearTimeout(pollTimer);
  renderJob(job);
  pollJob(job.id);
  window.scrollTo({ top: $("#activeJob").offsetTop - 24, behavior: "smooth" });
}

cancelJobButton.addEventListener("click", async () => {
  if (!activeJobId) return;
  const id = activeJobId;
  const ok = await askConfirm({
    title: "取消排队任务",
    message: "确定取消该任务吗？取消后记录会保留，之后可以点“重新提交”再次排队。",
    okLabel: "取消任务",
  });
  if (!ok) return;
  cancelJobButton.disabled = true;
  try {
    await parseResponse(await fetch(`/api/jobs/${encodeURIComponent(id)}`, { method: "DELETE" }));
    const job = await parseResponse(await fetch(`/api/jobs/${encodeURIComponent(id)}`, { cache: "no-store" }));
    window.clearTimeout(pollTimer);
    renderJob(job);
    showToast("任务已取消", "success");
    loadHistory();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    cancelJobButton.disabled = false;
  }
});

retryJobButton.addEventListener("click", async () => {
  if (!activeJobId) return;
  const id = activeJobId;
  const ok = await askConfirm({
    title: "重新提交任务",
    message: "将使用原参数和原素材创建新任务，新任务排在队尾。确定继续吗？",
    okLabel: "重新提交",
    primary: true,
  });
  if (!ok) return;
  retryJobButton.disabled = true;
  try {
    const job = await parseResponse(await fetch(`/api/jobs/${encodeURIComponent(id)}/retry`, { method: "POST" }));
    renderJob(job);
    pollJob(job.id);
    showToast("任务已重新提交", "success");
    loadHistory();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    retryJobButton.disabled = false;
  }
});

$("#deleteVideoButton").addEventListener("click", async () => {
  const id = activeJobId;
  const button = $("#deleteVideoButton");
  const image = button.dataset.resultType === "image";
  const kind = image ? "本次生成的全部图片" : "此视频";
  if (!id) return;
  const ok = await askConfirm({
    title: image ? "删除图片" : "删除视频",
    message: `确定删除${kind}吗？服务器文件和生成记录将永久删除，无法恢复。`,
    okLabel: "删除",
  });
  if (!ok) return;
  button.disabled = true;
  try {
    await parseResponse(await fetch(`/api/jobs/${encodeURIComponent(id)}/${image ? "images" : "video"}`, { method: "DELETE" }));
    if (activeJobId === id) {
      activeJobId = null; window.clearTimeout(pollTimer);
      if (imagePreviewDialog.open) imagePreviewDialog.close();
      videoPlayer.pause(); videoPlayer.removeAttribute("src"); videoPlayer.load(); videoPlayer.hidden = true;
      imageGallery.replaceChildren(); imageGallery.hidden = true; downloadBox.hidden = true;
      downloadButton.removeAttribute("href"); serverPath.textContent = "";
      jobContent.hidden = true; emptyState.hidden = false; button.hidden = true;
    }
    await loadHistory(); showToast(`${image ? "图片" : "视频"}文件和生成记录已删除，无法恢复`, "success");
  } catch (error) { showToast(error.message, "error"); }
  finally { button.disabled = false; }
});

async function pollJob(id) {
  window.clearTimeout(pollTimer);
  try {
    const [job, runtime] = await Promise.all([
      parseResponse(await fetch(`/api/jobs/${encodeURIComponent(id)}`, { cache: "no-store" })),
      parseResponse(await fetch(`/api/jobs/${encodeURIComponent(id)}/runtime`, { cache: "no-store" })),
    ]);
    if (activeJobId === id) renderJob(job, runtime);
    if (activeJobId !== id) return;
    if (!["completed", "failed", "cancelled"].includes(job.status)) pollTimer = window.setTimeout(() => pollJob(id), 3000);
    else loadHistory();
  } catch (error) {
    if (activeJobId !== id) return;
    if (currentUser && activeJobId === id) statusMessage.textContent = error.message;
    if (currentUser) pollTimer = window.setTimeout(() => pollJob(id), 5000);
  }
}

function prepareVideoRequest(body) {
  const stepsText = String(body.get("num_inference_steps") || "").trim();
  const steps = stepsText ? Number(stepsText) : 50;
  if (!Number.isSafeInteger(steps) || steps < 1) throw new Error("推理步数须为正整数，留空默认 50 步");
  body.set("num_inference_steps", String(steps));
  const size = normalizeSize(String(body.get("size") || ""));
  if (size) {
    if (!/^\d{2,5}x\d{2,5}$/.test(size) || size.split("x").map(Number).some((n) => n < 32 || n % 32)) {
      throw new Error("视频输出宽高须为正的 32 的整数倍，例如 2560x1440");
    }
    body.set("size", size);
    body.delete("short_edge");
  } else {
    body.delete("size");
    body.set("short_edge", "768");
  }
  const durationText = String(body.get("seconds") || "").trim();
  const duration = durationText ? Number(durationText) : 4;
  if (!Number.isFinite(duration) || duration < 4 || duration > 15) throw new Error("视频时长须在 4–15 秒之间");
  let extra;
  try { extra = JSON.parse(String(body.get("extra_params") || "{}").trim() || "{}"); }
  catch { throw new Error("Extra params 必须是有效 JSON 对象"); }
  if (!extra || typeof extra !== "object" || Array.isArray(extra)) throw new Error("Extra params 必须是 JSON 对象");
  extra.duration = duration;
  body.set("extra_params", JSON.stringify(extra));
  if (Number.isInteger(duration)) body.set("seconds", String(duration));
  else body.delete("seconds");
  return body;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault(); submitButton.disabled = true;
  submitButton.querySelector("span").textContent = "正在加入队列";
  const body = new FormData(form);
  body.delete("input_reference");
  body.delete("input_references");
  const images = referencePond.getFiles();
  const videos = videoReferencePond.getFiles();
  const audios = audioReferencePond.getFiles();
  if (activeMode === "fl2va") {
    const expected = frameModeInput.value === "first_last" ? 2 : 1;
    if (images.length !== expected) {
      showToast(frameModeInput.value === "first_last" ? "首尾帧模式必须上传两张图片" : "请上传一张关键帧图片", "error");
      submitButton.disabled = false; submitButton.querySelector("span").textContent = "立即生成视频"; return;
    }
    const field = expected === 2 ? "input_references" : "input_reference";
    images.forEach((item) => body.append(field, item.file, item.file.name));
  } else if (activeMode === "ref2va") {
    const total = images.length + videos.length + audios.length;
    if (!total) {
      showToast("Ref2VA 至少需要一个参考素材", "error");
      submitButton.disabled = false; submitButton.querySelector("span").textContent = "立即生成视频"; return;
    }
    if (audios.length && !images.length && !videos.length) {
      showToast("音频参考必须与图片或视频参考一起使用", "error");
      submitButton.disabled = false; submitButton.querySelector("span").textContent = "立即生成视频"; return;
    }
    [...images, ...videos, ...audios].forEach((item) => body.append("input_references", item.file, item.file.name));
  }
  if (body.has("size")) {
    const size = normalizeSize(String(body.get("size") || ""));
    if (size && !/^\d{2,5}x\d{2,5}$/.test(size)) {
      showToast("输出尺寸格式应为 宽x高，例如 1344x768", "error");
      submitButton.disabled = false; submitButton.querySelector("span").textContent = "立即生成视频"; return;
    }
    if (size) body.set("size", size);
  }
  for (const [key, value] of [...body.entries()]) {
    if (typeof value === "string" && !value.trim()) body.delete(key);
    if (value instanceof File && !value.size) body.delete(key);
  }
  try {
    prepareVideoRequest(body);
    const job = await parseResponse(await fetch("/api/jobs", { method: "POST", body }));
    renderJob(job); pollJob(job.id); loadHistory();
    showToast(`任务已加入队列，当前第 ${job.queue_position || 1} 位`, "success");
  } catch (error) { showToast(error.message, "error"); }
  finally { submitButton.disabled = false; submitButton.querySelector("span").textContent = "立即生成视频"; }
});

imageForm.addEventListener("submit", async (event) => {
  event.preventDefault(); imageSubmitButton.disabled = true;
  imageSubmitButton.querySelector("span").textContent = "正在加入队列";
  const raw = Object.fromEntries(new FormData(imageForm).entries());
  const payload = {};
  const integerFields = new Set(["n", "num_inference_steps", "seed", "output_compression"]);
  try {
    for (const [key, value] of Object.entries(raw)) {
      const text = String(value).trim(); if (!text) continue;
      if (integerFields.has(key)) {
        if (!/^\d+$/.test(text) || !Number.isSafeInteger(Number(text))) throw new Error(`${key} 必须是有效整数`);
        payload[key] = Number(text);
      }
      else if (key === "true_cfg_scale") payload[key] = Number(text);
      else payload[key] = key === "size" ? normalizeSize(text) : text;
    }
    if (!payload.size || !/^\d{2,5}x\d{2,5}$/.test(payload.size)) throw new Error("图片尺寸格式应为 宽x高");
    const dimensions = payload.size.split("x").map(Number);
    if (dimensions.some((value) => value < 256 || value > 4096 || value % 32)) throw new Error("图片宽高须为 256–4096 之间的 32 的整数倍");
    if (payload.negative_prompt && !(payload.true_cfg_scale > 1)) throw new Error("使用负面提示词时，True CFG 必须大于 1");
    if (payload.true_cfg_scale > 1 && !payload.negative_prompt) throw new Error("True CFG 大于 1 时，请填写负面提示词");
    let options = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) };
    if (payload.mode === "edit") {
      const references = qwenReferencePond.getFiles();
      if (!references.length || references.length > 4) throw new Error("参考图编辑需要上传 1–4 张图片");
      if (references.some((item) => item.status !== FilePond.FileStatus.IDLE)) throw new Error("请等待参考图片载入完成，并移除格式或大小不符合要求的文件");
      const body = new FormData();
      for (const [key, value] of Object.entries(payload)) body.append(key, String(value));
      references.forEach((item) => body.append("image", item.file, item.file.name));
      options = { method: "POST", body };
    }
    const job = await parseResponse(await fetch("/api/qwen-image-jobs", options));
    renderJob(job); pollJob(job.id); loadHistory();
    showToast(`Qwen 图像任务已加入队列，当前第 ${job.queue_position || 1} 位`, "success");
  } catch (error) { showToast(error.message, "error"); }
  finally { imageSubmitButton.disabled = false; imageSubmitButton.querySelector("span").textContent = "立即生成图片"; }
});

zImageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = $("#zImageSubmitButton");
  button.disabled = true;
  button.querySelector("span").textContent = "正在加入队列";
  try {
    const allowedFields = new Set(["mode", "prompt", "n", "size", "num_inference_steps", "seed", "output_format", "generator_device", "strength", "output_compression", "guidance_scale", "negative_prompt"]);
    const payload = Object.fromEntries([...new FormData(zImageForm).entries()].filter(([key, value]) => allowedFields.has(key) && String(value).trim() !== ""));
    for (const name of ["n", "num_inference_steps", "seed"]) {
      if (payload[name] === undefined || payload[name] === "") { delete payload[name]; continue; }
      if (!/^\d+$/.test(payload[name]) || !Number.isSafeInteger(Number(payload[name]))) throw new Error(`${name} 必须是有效整数`);
      payload[name] = Number(payload[name]);
    }
    payload.size = normalizeSize(payload.size);
    if (payload.guidance_scale !== undefined) {
      payload.guidance_scale = Number(payload.guidance_scale);
      if (!Number.isFinite(payload.guidance_scale) || payload.guidance_scale < 0 || payload.guidance_scale > 20) throw new Error("CFG 须为 0–20 之间的数字");
    }
    if (!/^\d{2,5}x\d{2,5}$/.test(payload.size)) throw new Error("尺寸格式应为 宽x高");
    if (payload.size.split("x").map(Number).some((value) => value < 256 || value > 4096 || value % 16)) throw new Error("宽高须为 256–4096 之间的 16 的整数倍");
    let options = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) };
    if (payload.mode === "edit") {
      const strength = Number(payload.strength);
      if (!Number.isFinite(strength) || strength <= 0 || strength > 1) throw new Error("重绘强度须大于 0 且不超过 1");
      const effectiveSteps = payload.num_inference_steps - Math.trunc(Math.max(payload.num_inference_steps - payload.num_inference_steps * strength, 0));
      if (effectiveSteps < 2) throw new Error("重绘强度与步数组合过低，请提高强度或步数");
      const references = zImageReferencePond.getFiles();
      if (references.length !== 1) throw new Error("单图重绘必须上传 1 张原图");
      if (references[0].status !== FilePond.FileStatus.IDLE) throw new Error("请等待原图载入完成，并检查文件格式及大小");
      const body = new FormData();
      for (const [key, value] of Object.entries(payload)) body.append(key, String(value));
      body.append("image", references[0].file, references[0].file.name);
      options = { method: "POST", body };
    }
    const job = await parseResponse(await fetch("/api/z-image-jobs", {
      ...options,
    }));
    renderJob(job); pollJob(job.id); loadHistory();
    showToast(`造相任务已加入队列，当前第 ${job.queue_position || 1} 位`, "success");
  } catch (error) { showToast(error.message, "error"); }
  finally { button.disabled = false; button.querySelector("span").textContent = "立即生成图片"; }
});

function formatTime(timestamp) {
  if (!timestamp) return "";
  return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(timestamp * 1000));
}

function renderLiveChips(jobs) {
  const live = jobs.filter((job) => ["queued", "submitting", "in_progress"].includes(job.status));
  liveJobChips.replaceChildren();
  if (!live.length) { liveJobChips.hidden = true; return; }
  live.forEach((job) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `live-chip ${job.status}` + (job.id === activeJobId ? " active" : "");
    const dot = document.createElement("b");
    dot.className = "live-chip-dot";
    const name = document.createElement("span");
    const label = taskLabels[job.task_type] || job.task_type || "任务";
    const detail = job.status === "queued" && job.queue_position ? `队列第 ${job.queue_position} 位` : (labels[job.status] || job.status);
    name.textContent = `${label} · ${detail}`;
    chip.title = job.prompt || job.id;
    chip.append(dot, name);
    chip.addEventListener("click", () => focusJob(job));
    liveJobChips.append(chip);
  });
  liveJobChips.hidden = false;
}

async function loadHistory() {
  if (!currentUser) return;
  try {
    const payload = await parseResponse(await fetch("/api/jobs?limit=30", { cache: "no-store" }));
    const jobs = payload.data || [];
    const queuedJobs = jobs.filter((job) => job.status === "queued");
    const runningJobs = jobs.filter((job) => ["submitting", "in_progress"].includes(job.status));
    $("#queueOwnStatus").textContent = queuedJobs.length
      ? `我的等待任务 ${queuedJobs.length} 个 · 最近等待任务${queuedJobs[0].queue_position ? `在全站队列第 ${queuedJobs[0].queue_position} 位` : "正在更新位置"}`
      : runningJobs.length ? `我的任务：${runningJobs.length} 个正在处理` : "我暂无排队任务";
    renderLiveChips(jobs);
    if (!jobs.length) { historyList.innerHTML = '<p class="history-empty">暂时没有生成记录</p>'; return; }
    historyList.replaceChildren();
    jobs.forEach((job) => {
      const item = document.createElement("button"); item.type = "button";
      item.className = "history-item" + (job.id === activeJobId ? " active" : "");
      const thumb = document.createElement("span");
      if (job.outputs && job.outputs.length && job.outputs[0].type === "image") {
        const img = document.createElement("img");
        img.className = "history-thumb";
        img.src = `${job.outputs[0].url}?v=${job.updated_at || ""}`;
        img.alt = "";
        img.loading = "lazy";
        thumb.append(img);
      }
      const dot = document.createElement("span"); dot.className = `history-dot ${job.status}`;
      const copy = document.createElement("span"); copy.className = "history-copy";
      const title = document.createElement("strong"); title.textContent = job.prompt || job.id;
      const sub = document.createElement("small"); sub.textContent = `${taskLabels[job.task_type] || job.task_type || "任务"} · ${labels[job.status] || job.status}${job.queue_position ? ` · 队列第 ${job.queue_position} 位` : ""}`;
      copy.append(title, sub);
      const date = document.createElement("span"); date.className = "history-time"; date.textContent = formatTime(job.created_at);
      item.append(thumb, dot, copy, date);
      item.addEventListener("click", () => focusJob(job));
      historyList.append(item);
    });
  } catch (error) {
    historyList.textContent = error.message;
    $("#queueOwnStatus").textContent = "我的排队信息暂不可用";
    renderLiveChips([]);
  }
}

function renderModeServices(services) {
  document.querySelectorAll(".mode-service").forEach((node) => {
    const info = services && services[node.dataset.service];
    const state = info ? (info.ok ? "online" : "offline") : "unknown";
    node.classList.remove("online", "offline", "unknown");
    node.classList.add(state);
    const label = state === "online" ? "在线" : state === "offline" ? "离线" : "检查中";
    const text = node.querySelector("em");
    if (text) text.textContent = label;
    node.title = (info && info.url ? `${info.url} · ` : "") + label;
  });
}

async function checkHealth() {
  if (healthRequestPending) return;
  healthRequestPending = true;
  window.clearTimeout(queueRefreshTimer);
  try {
    const health = await parseResponse(await fetch("/api/health", { cache: "no-store" }));
    renderModeServices(health.services);
    $("#queueRunningCount").textContent = String(health.running ?? "—");
    $("#queueWaitingCount").textContent = String(health.queued ?? "—");
    qwenServiceState.textContent = health.services?.qwen_image?.ok ? "Qwen 图像服务在线" : "Qwen 图像服务暂不可用";
    qwenServiceState.classList.toggle("service-unavailable", !health.services?.qwen_image?.ok);
    zImageServiceState.textContent = health.services?.z_image?.ok ? "造相图像服务在线" : "造相图像服务暂不可用";
    zImageServiceState.classList.toggle("service-unavailable", !health.services?.z_image?.ok);
    serviceState.className = `service-state ${health.ok ? "online" : "offline"}`;
    serviceState.querySelector("span:last-child").textContent = health.ok
      ? `推理服务在线 · 运行 ${health.running} · 排队 ${health.queued}` : `推理服务不可用 · 运行 ${health.running} · 排队 ${health.queued}`;
  } catch {
    renderModeServices({});
    $("#queueRunningCount").textContent = "—";
    $("#queueWaitingCount").textContent = "—";
    qwenServiceState.textContent = "无法连接网页网关";
    zImageServiceState.textContent = "无法连接网页网关";
    serviceState.className = "service-state offline";
    serviceState.querySelector("span:last-child").textContent = "网关服务不可用";
  } finally {
    healthRequestPending = false;
    if (currentUser) queueRefreshTimer = window.setTimeout(() => {
      if (!currentUser) return;
      checkHealth();
      loadHistory();
    }, 15000);
  }
}

$("#refreshHistory").addEventListener("click", loadHistory);
loadSession();
