const $ = (selector) => document.querySelector(selector);

/* ============ 元素引用 ============ */
const appFrame = $("#appFrame");
const sidebar = $("#sidebar");
const sidebarJobs = $("#sidebarJobs");
const sidebarCollapse = $("#sidebarCollapse");
const sidebarExpand = $("#sidebarExpand");
const newCreationButton = $("#newCreationButton");
const viewTitle = $("#viewTitle");
const queueRunningCount = $("#queueRunningCount");
const queueWaitingCount = $("#queueWaitingCount");
const serviceState = $("#serviceState");
const userBadge = $("#userBadge");
const mainContent = $("#mainContent");
const conversationView = $("#conversationView");
const welcomeBlock = $("#welcomeBlock");
const conversationBlock = $("#conversationBlock");
const jobStatus = $("#jobStatus");
const jobId = $("#jobId");
const jobElapsed = $("#jobElapsed");
const conversationPrompt = $("#conversationPrompt");
const conversationParams = $("#conversationParams");
const progressTrack = $("#progressTrack");
const progressBar = $("#progressBar");
const statusMessage = $("#statusMessage");
const runtimeEvents = $("#runtimeEvents");
const videoPlayer = $("#videoPlayer");
const imageGallery = $("#imageGallery");
const errorBox = $("#errorBox");
const reeditButton = $("#reeditButton");
const cancelJobButton = $("#cancelJobButton");
const regenerateButton = $("#regenerateButton");
const downloadButton = $("#downloadButton");
const deleteJobButton = $("#deleteJobButton");
const assetsView = $("#assetsView");
const assetsFilter = $("#assetsFilter");
const assetsGroups = $("#assetsGroups");
const assetsCount = $("#assetsCount");
const adminView = $("#adminView");
const adminNavButton = $("#adminNavButton");
const adminUserForm = $("#adminUserForm");
const userList = $("#userList");
const creationForm = $("#composerForm");
const promptInput = $("#promptInput");
const creationSubmit = $("#creationSubmit");
const chipMode = $("#chipMode");
const chipModeVal = $("#chipModeVal");
const chipSize = $("#chipSize");
const chipSizeVal = $("#chipSizeVal");
const chipDuration = $("#chipDuration");
const chipDurationVal = $("#chipDurationVal");
const chipCount = $("#chipCount");
const chipCountVal = $("#chipCountVal");
const chipFormat = $("#chipFormat");
const chipFormatVal = $("#chipFormatVal");
const chipStrength = $("#chipStrength");
const chipStrengthVal = $("#chipStrengthVal");
const chipAdvanced = $("#chipAdvanced");
const chipStructured = $("#chipStructured");
const popoverMode = $("#popoverMode");
const popoverSize = $("#popoverSize");
const popoverDuration = $("#popoverDuration");
const popoverCount = $("#popoverCount");
const popoverFormat = $("#popoverFormat");
const popoverStrength = $("#popoverStrength");
const popoverAdvanced = $("#popoverAdvanced");
const ratioGrid = $("#ratioGrid");
const customWidth = $("#customWidth");
const customHeight = $("#customHeight");
const sizeSwapButton = $("#sizeSwapButton");
const sizeHint = $("#sizeHint");
const durationGrid = $("#durationGrid");
const countGrid = $("#countGrid");
const countLabel = $("#countLabel");
const strengthRange = $("#strengthRange");
const strengthValue = $("#strengthValue");
const structuredPanel = $("#structuredPanel");
const structuredVisuals = $("#structuredVisuals");
const structuredSound = $("#structuredSound");
const structuredMusic = $("#structuredMusic");
const addShotButton = $("#addShotButton");
const fl2vaMaterialBlock = $("#fl2vaMaterialBlock");
const fl2vaImageLimit = $("#fl2vaImageLimit");
const ref2vaMaterialBlock = $("#ref2vaMaterialBlock");
const qwenMaterialBlock = $("#qwenMaterialBlock");
const qwenReferenceGroup = $("#qwenReferenceGroup");
const qwenReferenceMap = $("#qwenReferenceMap");
const zMaterialBlock = $("#zMaterialBlock");
const zImageReferenceGroup = $("#zImageReferenceGroup");
const videoReferenceInput = $("#videoReferenceInput");
const videoReferenceMap = $("#videoReferenceMap");
const audioReferenceInput = $("#audioReferenceInput");
const audioReferenceMap = $("#audioReferenceMap");
const referenceInput = $("#referenceInput");
const referenceMap = $("#referenceMap");
const referenceInput2 = $("#referenceInput2");
const referenceMap2 = $("#referenceMap2");
const frameModeSegmented = $("#frameModeSegmented");
const qwenModeSegmented = $("#qwenModeSegmented");
const zModeSegmented = $("#zModeSegmented");
const videoSeedInput = $("#videoSeedInput");
const videoStepsInput = $("#videoStepsInput");
const imageSeedInput = $("#imageSeedInput");
const imageStepsInput = $("#imageStepsInput");
const qwenCfgInput = $("#qwenCfgInput");
const zCfgInput = $("#zCfgInput");
const deviceSelect = $("#deviceSelect");
const compressionInput = $("#compressionInput");
const negativeInput = $("#negativeInput");
const negativeHint = $("#negativeHint");
const loginScreen = $("#loginScreen");
const loginForm = $("#loginForm");
const loginError = $("#loginError");
const apiKeyButton = $("#apiKeyButton");
const apiKeyModal = $("#apiKeyModal");
const apiKeyClose = $("#apiKeyClose");
const apiServerUrl = $("#apiServerUrl");
const apiKeyValue = $("#apiKeyValue");
const apiKeyStatus = $("#apiKeyStatus");
const generateApiKey = $("#generateApiKey");
const copyApiKey = $("#copyApiKey");
const revokeApiKey = $("#revokeApiKey");
const themeToggle = $("#themeToggle");
const themeToggleLogin = $("#themeToggleLogin");
const toast = $("#toast");
const imagePreviewDialog = $("#imagePreviewDialog");
const imagePreviewImage = $("#imagePreviewImage");

/* ============ 状态 ============ */
let currentUser = null;
let currentView = "conversation";
let selectedJobId = null;
let selectedJob = null;
let allJobs = [];
let assetsFilterValue = "all";
let pollTimer = null;
let healthTimer = null;
let healthRequestPending = false;
let previewObjectUrl = null;
let activeMode = "";
let qwenCreateMode = "edit";
let zCreateMode = "edit";
let frameMode = "first";
let structuredEnabled = false;
let currentSize = "";
let duration = 4;
let count = 1;
let outputFormat = "png";
let strength = 0.6;
const submittedParams = new Map();
const modeState = new Map();
const TERMINAL_STATUSES = ["completed", "failed", "cancelled"];

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
const isVideoMode = (mode) => ["t2va", "fl2va", "ref2va"].includes(mode);

/* ============ 主题 ============ */
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
themeToggle.addEventListener("click", () => applyTheme(currentTheme() === "light" ? "dark" : "light"));
themeToggleLogin.addEventListener("click", () => applyTheme(currentTheme() === "light" ? "dark" : "light"));
applyTheme(currentTheme());

/* ============ 密码显示/隐藏 ============ */
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

/* ============ Toast ============ */
let toastTimer = null;
function showToast(message, kind = "info") {
  toast.textContent = message;
  toast.className = `toast show ${kind}`;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { toast.className = "toast"; }, 3200);
}

/* ============ 确认 / 输入弹窗 ============ */
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
  closeAllPopovers();
});

/* ============ 上传组件 ============ */
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

const referencePond = createReferencePond(referenceInput, {
  allowMultiple: false,
  maxFiles: 1,
  maxFileSize: "30MB",
  acceptedFileTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
  labelIdle: "拖入参考图片，或 <span class=\"filepond--label-action\">选择文件</span>",
  labelFileTypeNotAllowed: "仅支持 JPEG、PNG、WebP、HEIC/HEIF 图片",
  labelMaxFileSizeExceeded: "图片超过 30MB 限制",
  onupdatefiles: () => renderMediaMap(referencePond, referenceMap, "图片"),
  onreorderfiles: () => renderMediaMap(referencePond, referenceMap, "图片"),
});

const referencePond2 = createReferencePond(referenceInput2, {
  maxFiles: 9,
  maxFileSize: "30MB",
  acceptedFileTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
  labelIdle: "拖入参考图片（最多 9 张），或 <span class=\"filepond--label-action\">选择文件</span>",
  labelFileTypeNotAllowed: "仅支持 JPEG、PNG、WebP、HEIC/HEIF 图片",
  labelMaxFileSizeExceeded: "图片超过 30MB 限制",
  onupdatefiles: () => renderMediaMap(referencePond2, referenceMap2, "图片"),
  onreorderfiles: () => renderMediaMap(referencePond2, referenceMap2, "图片"),
});

const videoReferencePond = createReferencePond(videoReferenceInput, {
  maxFiles: 3,
  maxFileSize: "50MB",
  acceptedFileTypes: ["video/mp4", "video/quicktime"],
  labelIdle: "拖入参考视频（最多 3 个），或 <span class=\"filepond--label-action\">选择文件</span>",
  labelFileTypeNotAllowed: "仅支持 MP4、MOV 视频",
  labelMaxFileSizeExceeded: "视频超过 50MB 限制",
  onupdatefiles: () => renderMediaMap(videoReferencePond, videoReferenceMap, "视频"),
  onreorderfiles: () => renderMediaMap(videoReferencePond, videoReferenceMap, "视频"),
});

const audioReferencePond = createReferencePond(audioReferenceInput, {
  maxFiles: 3,
  maxFileSize: "15MB",
  acceptedFileTypes: ["audio/wav", "audio/x-wav", "audio/mpeg"],
  labelIdle: "拖入参考音频（最多 3 个），或 <span class=\"filepond--label-action\">选择文件</span>",
  labelFileTypeNotAllowed: "仅支持 WAV、MP3 音频",
  labelMaxFileSizeExceeded: "音频超过 15MB 限制",
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
  onupdatefiles: () => renderMediaMap(qwenReferencePond, qwenReferenceMap, "图片", true),
  onreorderfiles: () => renderMediaMap(qwenReferencePond, qwenReferenceMap, "图片", true),
});

const zImageReferencePond = createReferencePond($("#zImageReferenceInput"), {
  allowMultiple: false, maxFiles: 1, maxFileSize: "30MB",
  acceptedFileTypes: ["image/png", "image/jpeg", "image/webp"],
  labelIdle: '拖入一张原图，或 <span class="filepond--label-action">选择图片</span>',
  onupdatefiles: (files) => { $("#zImagePreviewButton").disabled = !files.length; },
});

function insertPromptReference(token) {
  const start = promptInput.selectionStart ?? promptInput.value.length;
  const end = promptInput.selectionEnd ?? start;
  const before = promptInput.value.slice(0, start);
  const after = promptInput.value.slice(end);
  const spacer = before && !/[\s，。；：、]$/.test(before) ? " " : "";
  promptInput.value = `${before}${spacer}${token}${after}`;
  const caret = before.length + spacer.length + token.length;
  promptInput.focus();
  promptInput.setSelectionRange(caret, caret);
  promptInput.dispatchEvent(new Event("input", { bubbles: true }));
}

function renderMediaMap(pond, map, kind, qwenStyle = false) {
  if (!pond || !map) return;
  map.replaceChildren();
  pond.getFiles().forEach((item, index) => {
    const row = document.createElement("li");
    const badge = document.createElement("b");
    const name = document.createElement("span");
    const insert = document.createElement("button");
    badge.textContent = qwenStyle ? `第${index + 1}张` : `${kind} ${index + 1}`;
    name.textContent = item.file.name;
    insert.type = "button";
    insert.textContent = "插入提示词";
    insert.addEventListener("click", () => insertPromptReference(qwenStyle ? `第${index + 1}张图片` : `${kind}${index + 1}`));
    row.append(badge, name, insert);
    map.append(row);
  });
}

function clearReferenceMedia() {
  referencePond.removeFiles();
  referencePond2.removeFiles();
  videoReferencePond.removeFiles();
  audioReferencePond.removeFiles();
}

/* ============ 模式配置 ============ */
const MODE_CONFIG = {
  t2va: {
    chipLabel: "文生视频",
    placeholder: "描述你想生成的视频。例如：清晨的雪山之巅，一位登山者迎着金色日光缓慢前行，电影感运镜，风吹动衣角……",
    chips: { duration: true, format: false, strength: false, structured: true },
    sizeDefault: "",
    sizeMultiple: 32,
    sizeHint: "留空时按 768 短边自适应；选择画幅或填写自定义宽高（32 的倍数）。",
  },
  fl2va: {
    chipLabel: "关键帧视频",
    placeholder: "描述画面如何从首帧变化到尾帧。例如：少女缓缓睁开眼睛，场景由暗转亮，镜头轻微推近",
    chips: { duration: true, format: false, strength: false, structured: true },
    sizeDefault: "2560x1440",
    sizeMultiple: 32,
    sizeHint: "留空时按关键帧图片比例自适应；选择画幅或填写自定义宽高（32 的倍数）。",
  },
  ref2va: {
    chipLabel: "多参考视频",
    placeholder: "自由组合图、文、音、视频。例如：保持 图片1 的人物，参考 视频1 的动作，并采用 音频1 的声音",
    chips: { duration: true, format: false, strength: false, structured: true },
    sizeDefault: "",
    sizeMultiple: 32,
    sizeHint: "留空时默认 16:9；选择画幅或填写自定义宽高（32 的倍数）。",
  },
  qwen_image: {
    chipLabel: "Qwen 图像",
    placeholder: (createMode) => createMode === "edit"
      ? "描述参考图编辑指令。例如：将 第1张图片 的人物放入 第2张图片 的场景，海报风格"
      : "描述你想生成的图片。例如：美超科技发布会主视觉海报，中文排版，霓虹渐变背景",
    chips: { duration: false, format: true, strength: false, structured: false },
    sizeDefault: "2048x2048",
    sizeMultiple: 32,
    sizeHint: "宽高须为 256–4096 之间的 32 的整数倍；大尺寸会增加显存与耗时。",
  },
  z_image: {
    chipLabel: "造相 Z-Image",
    placeholder: (createMode) => createMode === "edit"
      ? "描述希望得到的完整画面（重绘模式）。例如：水彩风格的猫咪，保留原有构图"
      : "描述你想生成的图片。例如：赛博朋克城市夜景，霓虹招牌，雨后湿地面反光",
    chips: { duration: false, format: true, strength: true, structured: false },
    sizeDefault: "2560x1440",
    sizeMultiple: 16,
    sizeHint: "宽高须为 256–4096 之间的 16 的整数倍；大尺寸会增加显存与耗时。",
  },
};

const RATIO_PRESETS = {
  video: [
    { ratio: "1:1", w: 768, h: 768 },
    { ratio: "4:3", w: 1024, h: 768 },
    { ratio: "16:9", w: 1344, h: 768 },
    { ratio: "3:4", w: 768, h: 1024 },
    { ratio: "9:16", w: 768, h: 1344 },
    { ratio: "3:2", w: 1536, h: 1024 },
    { ratio: "2:3", w: 1024, h: 1536 },
    { ratio: "21:9", w: 1792, h: 768 },
  ],
  image: [
    { ratio: "1:1", w: 1024, h: 1024 },
    { ratio: "4:3", w: 1024, h: 768 },
    { ratio: "16:9", w: 1344, h: 768 },
    { ratio: "3:4", w: 768, h: 1024 },
    { ratio: "9:16", w: 768, h: 1344 },
    { ratio: "3:2", w: 1536, h: 1024 },
    { ratio: "2:3", w: 1024, h: 1536 },
    { ratio: "2:1", w: 2048, h: 1024 },
  ],
};

function modePlaceholder(mode) {
  const p = MODE_CONFIG[mode].placeholder;
  if (typeof p !== "function") return p;
  return p(mode === "qwen_image" ? qwenCreateMode : zCreateMode);
}

function normalizeSize(value) {
  return String(value || "").trim().toLowerCase().replace(/[×*]/g, "x").replace(/\s+/g, "");
}

/* ============ composer 状态保存/恢复 ============ */
function saveComposerState() {
  if (!activeMode) return;
  const s = modeState.get(activeMode) || {};
  s.size = currentSize;
  s.duration = duration;
  s.count = count;
  s.format = outputFormat;
  s.strength = strength;
  s.steps = isVideoMode(activeMode) ? videoStepsInput.value : imageStepsInput.value;
  s.seed = isVideoMode(activeMode) ? videoSeedInput.value : imageSeedInput.value;
  s.negative = negativeInput.value;
  s.compression = compressionInput.value;
  if (activeMode === "qwen_image") s.cfg = qwenCfgInput.value;
  if (activeMode === "z_image") { s.cfg = zCfgInput.value; s.device = deviceSelect.value; }
  modeState.set(activeMode, s);
}

function restoreComposerState() {
  const cfg = MODE_CONFIG[activeMode];
  const s = modeState.get(activeMode) || {};
  currentSize = s.size ?? cfg.sizeDefault;
  duration = s.duration ?? 4;
  count = s.count ?? 1;
  outputFormat = s.format ?? "png";
  strength = s.strength ?? 0.6;
  videoStepsInput.value = s.steps !== undefined && isVideoMode(activeMode) ? s.steps : "50";
  imageStepsInput.value = s.steps !== undefined && !isVideoMode(activeMode) ? s.steps : (activeMode === "qwen_image" ? "200" : "50");
  videoSeedInput.value = s.seed || "";
  imageSeedInput.value = s.seed || "";
  negativeInput.value = s.negative || "";
  compressionInput.value = s.compression || "100";
  qwenCfgInput.value = s.cfg || "1";
  zCfgInput.value = s.cfg || "4";
  deviceSelect.value = s.device || "";
}

/* ============ 模式切换 ============ */
function setMode(mode) {
  if (mode === activeMode) { closeAllPopovers(); return; }
  saveComposerState();
  activeMode = mode;
  clearReferenceMedia();
  applyModeUI();
  closeAllPopovers();
  checkHealth();
}

function applyModeUI() {
  const cfg = MODE_CONFIG[activeMode];
  const video = isVideoMode(activeMode);
  document.querySelectorAll(".mode-option").forEach((o) => o.classList.toggle("active", o.dataset.mode === activeMode));
  chipModeVal.textContent = cfg.chipLabel;
  fl2vaMaterialBlock.hidden = activeMode !== "fl2va";
  ref2vaMaterialBlock.hidden = activeMode !== "ref2va";
  qwenMaterialBlock.hidden = activeMode !== "qwen_image";
  zMaterialBlock.hidden = activeMode !== "z_image";
  qwenReferenceGroup.hidden = qwenCreateMode !== "edit";
  zImageReferenceGroup.hidden = zCreateMode !== "edit";
  promptInput.placeholder = modePlaceholder(activeMode);
  chipDuration.hidden = !video;
  chipFormat.hidden = video;
  chipStrength.hidden = !(activeMode === "z_image" && zCreateMode === "edit");
  chipStructured.hidden = !video;
  structuredPanel.hidden = !structuredEnabled || !video;
  // 高级字段可见性
  const advFields = {
    advSeedVideo: video, advNumFrames: video, advFps: video, advStepsVideo: video,
    advGuidance1: video, advGuidance2: video, advTrueCfgVideo: video, advBoundary: video,
    advFlow: video, advSoundDuration: video, advStartTime: video, advInterpEnable: video,
    advInterpExp: video, advInterpScale: video, advInterpPath: video, advLora: video,
    advExtra: video,
    advSeedImage: !video, advStepsImage: !video, advCompression: !video,
    advTrueCfgQwen: activeMode === "qwen_image", advGuidanceZ: activeMode === "z_image", advDevice: activeMode === "z_image",
  };
  for (const [id, visible] of Object.entries(advFields)) {
    const el = document.getElementById(id);
    if (el) el.hidden = !visible;
  }
  negativeHint.textContent = activeMode === "qwen_image"
    ? "使用负面提示词时，True CFG 必须大于 1；不使用时保留默认 1。"
    : activeMode === "z_image" ? "CFG 为 0 时不使用负面提示词。"
    : "";
  sizeHint.textContent = cfg.sizeHint;
  countLabel.textContent = video ? "选择生成视频数量" : "选择生成图片数量";
  renderRatioGrid();
  renderDurationGrid();
  renderCountGrid();
  strengthRange.value = String(strength);
  strengthValue.textContent = String(strength);
  updateChipValues();
}

document.querySelectorAll(".mode-option").forEach((option) => {
  option.addEventListener("click", () => setMode(option.dataset.mode));
});

/* ============ chip 值与 popover ============ */
function updateChipValues() {
  if (currentSize) {
    const [w, h] = currentSize.split("x");
    chipSizeVal.textContent = `${w}×${h}`;
  } else {
    chipSizeVal.textContent = "默认";
  }
  chipDurationVal.textContent = `${duration}s`;
  chipCountVal.textContent = String(count);
  chipFormatVal.textContent = outputFormat.toUpperCase();
  chipStrengthVal.textContent = String(strength);
  chipStructured.classList.toggle("active-chip", structuredEnabled);
}

let openChip = null;
function closeAllPopovers() {
  [popoverMode, popoverSize, popoverDuration, popoverCount, popoverFormat, popoverStrength, popoverAdvanced].forEach((p) => { p.hidden = true; });
  if (openChip) { openChip.classList.remove("open"); openChip = null; }
}
function openPopover(chip, popover) {
  closeAllPopovers();
  openChip = chip;
  popover.hidden = false;
  const wrap = chip.closest(".composer-chips-wrap");
  const wrapRect = wrap.getBoundingClientRect();
  const chipRect = chip.getBoundingClientRect();
  let left = chipRect.left - wrapRect.left;
  const popW = popover.offsetWidth;
  left = Math.max(0, Math.min(left, Math.max(0, wrapRect.width - popW)));
  popover.style.left = `${left}px`;
  chip.classList.add("open");
}
function bindChip(chip, popover, prepare) {
  chip.addEventListener("click", (event) => {
    event.stopPropagation();
    if (openChip === chip && !popover.hidden) { closeAllPopovers(); return; }
    if (prepare) prepare();
    openPopover(chip, popover);
  });
}
bindChip(chipMode, popoverMode);
bindChip(chipSize, popoverSize);
bindChip(chipDuration, popoverDuration);
bindChip(chipCount, popoverCount);
bindChip(chipFormat, popoverFormat);
bindChip(chipStrength, popoverStrength, () => { strengthRange.value = String(strength); strengthValue.textContent = String(strength); });
bindChip(chipAdvanced, popoverAdvanced);
chipStructured.addEventListener("click", (event) => {
  event.stopPropagation();
  structuredEnabled = !structuredEnabled;
  structuredPanel.hidden = !structuredEnabled || !isVideoMode(activeMode);
  updateChipValues();
  if (structuredEnabled) structuredVisuals.focus();
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".popover") && !event.target.closest(".param-chip")) closeAllPopovers();
});

/* 画幅网格 */
function ratioBoxSize(w, h) {
  const scale = 30 / Math.max(w, h);
  return [Math.max(10, Math.round(w * scale)), Math.max(10, Math.round(h * scale))];
}
function renderRatioGrid() {
  const presets = isVideoMode(activeMode) ? RATIO_PRESETS.video : RATIO_PRESETS.image;
  ratioGrid.replaceChildren();
  presets.forEach((preset) => {
    const [bw, bh] = ratioBoxSize(preset.w, preset.h);
    const btn = document.createElement("button");
    btn.type = "button";
    const value = `${preset.w}x${preset.h}`;
    btn.className = "ratio-option" + (currentSize === value ? " active" : "");
    const box = document.createElement("span");
    box.className = "ratio-box";
    box.style.width = `${bw}px`;
    box.style.height = `${bh}px`;
    const label = document.createElement("span");
    label.textContent = preset.ratio;
    btn.append(box, label);
    btn.title = value;
    btn.addEventListener("click", () => {
      currentSize = value;
      customWidth.value = "";
      customHeight.value = "";
      renderRatioGrid();
      updateChipValues();
      closeAllPopovers();
    });
    ratioGrid.append(btn);
  });
}
function applyCustomSize() {
  const w = Number(customWidth.value);
  const h = Number(customHeight.value);
  const multiple = MODE_CONFIG[activeMode].sizeMultiple;
  if (!Number.isSafeInteger(w) || !Number.isSafeInteger(h) || w < 256 || w > 4096 || h < 256 || h > 4096 || w % multiple || h % multiple) {
    showToast(`宽高须为 256–4096 之间 ${multiple} 的整数倍`, "error");
    return;
  }
  currentSize = `${w}x${h}`;
  renderRatioGrid();
  updateChipValues();
  closeAllPopovers();
}
[customWidth, customHeight].forEach((input) => {
  input.addEventListener("change", applyCustomSize);
  input.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); applyCustomSize(); } });
});
sizeSwapButton.addEventListener("click", () => {
  const t = customWidth.value;
  customWidth.value = customHeight.value;
  customHeight.value = t;
});

/* 时长网格 */
function renderDurationGrid() {
  durationGrid.replaceChildren();
  for (let s = 4; s <= 15; s++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "number-option" + (duration === s ? " active" : "");
    btn.textContent = `${s}s`;
    btn.addEventListener("click", () => {
      duration = s;
      renderDurationGrid();
      updateChipValues();
      closeAllPopovers();
    });
    durationGrid.append(btn);
  }
}

/* 数量网格 */
function renderCountGrid() {
  countGrid.replaceChildren();
  for (let n = 1; n <= 10; n++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "number-option" + (count === n ? " active" : "");
    btn.textContent = String(n);
    btn.addEventListener("click", () => {
      count = n;
      renderCountGrid();
      updateChipValues();
      closeAllPopovers();
    });
    countGrid.append(btn);
  }
}

/* 格式 */
document.querySelectorAll(".format-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    outputFormat = btn.dataset.format;
    document.querySelectorAll(".format-option").forEach((b) => b.classList.toggle("active", b === btn));
    updateChipValues();
    closeAllPopovers();
  });
});

/* 强度 */
strengthRange.addEventListener("input", () => {
  strength = Number(strengthRange.value);
  strengthValue.textContent = String(strength);
  updateChipValues();
});

/* 分段控件（关键帧方式 / 创作方式） */
function bindSegmented(container, onChange) {
  container.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      container.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
      onChange(btn.dataset.value);
    });
  });
}
bindSegmented(frameModeSegmented, (value) => {
  frameMode = value;
  const firstLast = value === "first_last";
  referencePond.setOptions({
    allowMultiple: firstLast,
    maxFiles: firstLast ? 2 : 1,
    labelIdle: firstLast
      ? "依次拖入首帧和尾帧，或 <span class=\"filepond--label-action\">选择两张图片</span>"
      : `拖入${value === "last" ? "尾帧" : "首帧"}图片，或 <span class=\"filepond--label-action\">选择文件</span>`,
  });
  while (referencePond.getFiles().length > (firstLast ? 2 : 1)) {
    referencePond.removeFile(referencePond.getFiles().at(-1).id);
  }
  renderMediaMap(referencePond, referenceMap, "图片");
});
bindSegmented(qwenModeSegmented, (value) => {
  qwenCreateMode = value;
  if (activeMode !== "qwen_image") return;
  qwenReferenceGroup.hidden = value !== "edit";
  promptInput.placeholder = modePlaceholder("qwen_image");
});
bindSegmented(zModeSegmented, (value) => {
  zCreateMode = value;
  if (activeMode !== "z_image") return;
  zImageReferenceGroup.hidden = value !== "edit";
  promptInput.placeholder = modePlaceholder("z_image");
  chipStrength.hidden = value !== "edit";
});

/* ============ 结构化创作 ============ */
addShotButton.addEventListener("click", () => {
  const countShots = (structuredVisuals.value.match(/\[镜头\d+\]/g) || []).length;
  const start = structuredVisuals.selectionStart ?? structuredVisuals.value.length;
  const before = structuredVisuals.value.slice(0, start);
  const after = structuredVisuals.value.slice(start);
  const token = `\n[镜头${countShots + 1}] `;
  structuredVisuals.value = before + token + after;
  structuredVisuals.focus();
  const caret = before.length + token.length;
  structuredVisuals.setSelectionRange(caret, caret);
});

function buildPrompt() {
  const plain = promptInput.value.trim();
  if (!structuredEnabled || !isVideoMode(activeMode)) return plain;
  const visuals = structuredVisuals.value.trim();
  const sound = structuredSound.value.trim();
  const music = structuredMusic.value.trim();
  if (!visuals && !plain) return plain;
  const parts = [];
  if (activeMode === "fl2va") {
    if (frameMode === "first") {
      parts.push("对于目标视频，0.00 秒处的画面完全引用 图片1（首帧），并从该画面开始发展。");
    } else if (frameMode === "last") {
      parts.push(`图片1 是目标视频的最后一帧，对齐 ${Number(duration).toFixed(2)} 秒处，画面整体逐渐过渡到该帧。`);
    } else {
      parts.push(`图片1 对齐目标视频 0.00 秒处（开场帧）；图片2 对齐目标视频 ${Number(duration).toFixed(2)} 秒处（结束帧）。`);
    }
  }
  parts.push(`integrated_multimodal_description: ${visuals || plain}`);
  parts.push(`overall_soundscape: ${sound || "N/A"}`);
  parts.push(`non_diegetic_music: ${music || "N/A"}`);
  return parts.join("\n\n");
}

/* ============ 会话 / 登录 ============ */
function errorText(value) {
  if (!value) return "";
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function showLogin(message = "") {
  if (imagePreviewDialog.open) imagePreviewDialog.close();
  closeConfirm(false);
  closePrompt(null);
  closeAllPopovers();
  currentUser = null;
  selectedJobId = null;
  selectedJob = null;
  allJobs = [];
  appFrame.hidden = true;
  appFrame.classList.remove("mobile-open");
  loginScreen.hidden = false;
  window.clearTimeout(pollTimer);
  window.clearTimeout(healthTimer);
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
  appFrame.hidden = false;
  userBadge.textContent = `${user.username}${user.role === "admin" ? " · 管理员" : ""}`;
  adminNavButton.hidden = user.role !== "admin";
  applySidebarRailState();
  newCreation();
  if (user.role === "admin") loadUsers();
  await Promise.all([checkHealth(), loadHistory()]);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = loginForm.querySelector("button[type=submit]");
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

/* ============ 侧边栏 ============ */
function applySidebarRailState() {
  let rail = false;
  try { rail = localStorage.getItem("kaishi_sidebar_rail") === "1"; } catch (e) {}
  if (rail && !window.matchMedia("(max-width: 760px)").matches) {
    appFrame.classList.add("rail");
    sidebarExpand.hidden = false;
  } else {
    appFrame.classList.remove("rail");
    sidebarExpand.hidden = true;
  }
}
sidebarCollapse.addEventListener("click", () => {
  appFrame.classList.add("rail");
  sidebarExpand.hidden = false;
  try { localStorage.setItem("kaishi_sidebar_rail", "1"); } catch (e) {}
});
sidebarExpand.addEventListener("click", () => {
  if (window.matchMedia("(max-width: 760px)").matches) {
    appFrame.classList.add("mobile-open");
  } else {
    appFrame.classList.remove("rail");
    sidebarExpand.hidden = true;
    try { localStorage.setItem("kaishi_sidebar_rail", "0"); } catch (e) {}
  }
});
mainContent.addEventListener("click", () => appFrame.classList.remove("mobile-open"));

newCreationButton.addEventListener("click", newCreation);
function newCreation() {
  setView("conversation");
  selectedJobId = null;
  selectedJob = null;
  welcomeBlock.hidden = false;
  conversationBlock.hidden = true;
  closeAllPopovers();
  promptInput.focus();
}

document.querySelectorAll(".sidebar-nav-item").forEach((btn) => {
  btn.addEventListener("click", () => setView(btn.dataset.view));
});

function setView(view) {
  currentView = view;
  conversationView.hidden = view !== "conversation";
  assetsView.hidden = view !== "assets";
  adminView.hidden = view !== "admin";
  document.querySelectorAll(".sidebar-nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  viewTitle.textContent = view === "conversation" ? "创作" : view === "assets" ? "资产" : "管理";
  appFrame.classList.remove("mobile-open");
  if (view === "assets" && allJobs.length) renderAssets();
  if (view === "admin" && currentUser?.role === "admin") loadUsers();
  mainContent.scrollTop = 0;
}

function formatTime(timestamp) {
  if (!timestamp) return "";
  return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(timestamp * 1000));
}

function renderSidebarJobs() {
  sidebarJobs.replaceChildren();
  if (!allJobs.length) {
    const empty = document.createElement("div");
    empty.className = "sidebar-jobs-empty";
    empty.textContent = "暂无对话记录\n你的创作会出现在这里";
    sidebarJobs.append(empty);
    return;
  }
  allJobs.forEach((job) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.jobId = job.id;
    btn.className = "sidebar-job" + (job.id === selectedJobId ? " active" : "");
    const thumb = document.createElement("span");
    thumb.className = "sj-thumb";
    if (job.result_type === "image" && job.outputs?.length) {
      const img = document.createElement("img");
      img.src = `${job.outputs[0].url}?v=${job.updated_at || ""}`;
      img.alt = "";
      img.loading = "lazy";
      thumb.append(img);
    } else {
      thumb.textContent = job.result_type === "image" ? "🖼" : "🎬";
    }
    const copy = document.createElement("span");
    copy.className = "sj-copy";
    const strong = document.createElement("strong");
    strong.textContent = job.prompt || job.id;
    const small = document.createElement("small");
    const dot = document.createElement("i");
    dot.className = `sj-dot ${job.status || ""}`;
    small.append(dot, document.createTextNode(`${taskLabels[job.task_type] || job.task_type || "任务"} · ${formatTime(job.created_at)}`));
    copy.append(strong, small);
    btn.append(thumb, copy);
    btn.title = job.prompt || job.id;
    btn.addEventListener("click", () => {
      setView("conversation");
      openConversation(job);
    });
    sidebarJobs.append(btn);
  });
}

/* ============ 对话视图 ============ */
function openConversation(job) {
  selectedJobId = job.id;
  selectedJob = job;
  welcomeBlock.hidden = true;
  conversationBlock.hidden = false;
  renderConversation(job, null);
  renderSidebarJobs();
  mainContent.scrollTop = 0;
  pollJob(job.id);
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

function renderConversation(job, runtime = null) {
  jobStatus.textContent = labels[job.status] || job.status;
  jobStatus.className = `status-pill ${job.status || ""}`;
  jobId.textContent = job.id;
  const measured = runtime?.progress ?? job.progress ?? 0;
  const progress = job.status === "completed" ? 100 : Math.max(job.status === "queued" ? 0 : 3, Number(measured));
  const showProgress = !TERMINAL_STATUSES.includes(job.status);
  progressTrack.hidden = !showProgress;
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
  // 提示词与参数摘要
  conversationPrompt.textContent = job.prompt || "";
  const p = submittedParams.get(job.id) || {};
  conversationParams.replaceChildren();
  const mkParam = (text, bold = false) => {
    const span = document.createElement("span");
    span.className = "conv-param";
    if (bold) {
      const b = document.createElement("b");
      b.textContent = text;
      span.append(b);
    } else {
      span.textContent = text;
    }
    return span;
  };
  conversationParams.append(mkParam(taskLabels[job.task_type] || job.task_type || "任务", true));
  if (p.size) conversationParams.append(mkParam(String(p.size)));
  if (p.seconds) conversationParams.append(mkParam(`${p.seconds}s`));
  if (p.count) conversationParams.append(mkParam(`${p.count} 个`));
  if (job.result_type === "image" && p.format) conversationParams.append(mkParam(String(p.format).toUpperCase()));
  if (job.model && job.model !== "MiniMaxH3") conversationParams.append(mkParam(String(job.model), true));
  conversationParams.hidden = false;
  renderRuntime(runtime);
  // 结果
  imageGallery.replaceChildren();
  imageGallery.hidden = true;
  if (job.download_url) {
    videoPlayer.src = `${job.download_url}?v=${job.updated_at || Date.now()}`;
    videoPlayer.hidden = false;
  } else {
    videoPlayer.hidden = true;
    videoPlayer.removeAttribute("src");
    videoPlayer.load();
  }
  if (job.result_type === "image" && job.outputs?.length) {
    videoPlayer.hidden = true;
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
  // 操作
  cancelJobButton.hidden = job.status !== "queued";
  regenerateButton.hidden = !["failed", "cancelled"].includes(job.status);
  deleteJobButton.hidden = job.status !== "completed";
  if (job.download_url) {
    downloadButton.hidden = false;
    downloadButton.href = job.download_url;
    downloadButton.download = `${job.id}.mp4`;
    downloadButton.textContent = "下载 MP4";
  } else {
    downloadButton.hidden = true;
    downloadButton.removeAttribute("href");
  }
}

reeditButton.addEventListener("click", () => {
  if (!selectedJob) return;
  const job = selectedJob;
  const p = submittedParams.get(job.id) || {};
  if (p.mode && p.mode !== activeMode) setMode(p.mode);
  if (p.createMode === "edit" || p.createMode === "generate") {
    if (p.mode === "qwen_image") qwenCreateMode = p.createMode;
    if (p.mode === "z_image") zCreateMode = p.createMode;
    syncSegmented(qwenModeSegmented, qwenCreateMode);
    syncSegmented(zModeSegmented, zCreateMode);
    applyModeUI();
  }
  if (p.size !== undefined) { currentSize = p.size; renderRatioGrid(); }
  if (p.seconds) { duration = Number(p.seconds); renderDurationGrid(); }
  if (p.count) { count = Number(p.count); renderCountGrid(); }
  if (p.format) { outputFormat = p.format; document.querySelectorAll(".format-option").forEach((b) => b.classList.toggle("active", b.dataset.format === outputFormat)); }
  if (p.strength) { strength = Number(p.strength); strengthRange.value = String(strength); strengthValue.textContent = String(strength); }
  if (p.steps) (p.mode && isVideoMode(p.mode) ? videoStepsInput : imageStepsInput).value = String(p.steps);
  if (p.seed) (p.mode && isVideoMode(p.mode) ? videoSeedInput : imageSeedInput).value = String(p.seed);
  negativeInput.value = p.negative || "";
  if (p.compression) compressionInput.value = String(p.compression);
  if (p.cfg) (p.mode === "qwen_image" ? qwenCfgInput : zCfgInput).value = String(p.cfg);
  if (p.device) deviceSelect.value = p.device;
  if (p.structured) {
    structuredEnabled = true;
    structuredPanel.hidden = !isVideoMode(activeMode);
    structuredVisuals.value = p.structured.visuals || "";
    structuredSound.value = p.structured.sound || "";
    structuredMusic.value = p.structured.music || "";
  } else {
    structuredEnabled = false;
    structuredPanel.hidden = true;
  }
  promptInput.value = p.structured ? "" : (p.prompt || job.prompt || "");
  autosizePrompt();
  updateChipValues();
  setView("conversation");
  promptInput.focus();
  showToast("已恢复该任务的参数，修改后重新提交即可", "info");
});

function syncSegmented(container, value) {
  container.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.value === value));
}

cancelJobButton.addEventListener("click", async () => {
  if (!selectedJobId) return;
  const id = selectedJobId;
  const ok = await askConfirm({
    title: "取消排队任务",
    message: "确定取消该任务吗？取消后记录会保留，可以点“再次生成”重新排队。",
    okLabel: "取消任务",
  });
  if (!ok) return;
  cancelJobButton.disabled = true;
  try {
    await parseResponse(await fetch(`/api/jobs/${encodeURIComponent(id)}`, { method: "DELETE" }));
    const job = await parseResponse(await fetch(`/api/jobs/${encodeURIComponent(id)}`, { cache: "no-store" }));
    window.clearTimeout(pollTimer);
    selectedJob = job;
    renderConversation(job, null);
    showToast("任务已取消", "success");
    loadHistory();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    cancelJobButton.disabled = false;
  }
});

regenerateButton.addEventListener("click", async () => {
  if (!selectedJobId) return;
  const id = selectedJobId;
  const ok = await askConfirm({
    title: "再次生成",
    message: "将使用原参数和原素材创建新任务，新任务排在队尾。确定继续吗？",
    okLabel: "再次生成",
    primary: true,
  });
  if (!ok) return;
  regenerateButton.disabled = true;
  try {
    const job = await parseResponse(await fetch(`/api/jobs/${encodeURIComponent(id)}/retry`, { method: "POST" }));
    openConversation(job);
    showToast("任务已重新提交", "success");
    loadHistory();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    regenerateButton.disabled = false;
  }
});

deleteJobButton.addEventListener("click", async () => {
  if (!selectedJobId) return;
  const id = selectedJobId;
  const job = selectedJob;
  const image = job?.result_type === "image";
  const kind = image ? "本次生成的全部图片" : "此视频";
  const ok = await askConfirm({
    title: image ? "删除图片" : "删除视频",
    message: `确定删除${kind}吗？服务器文件和生成记录将永久删除，无法恢复。`,
    okLabel: "删除",
  });
  if (!ok) return;
  deleteJobButton.disabled = true;
  try {
    await parseResponse(await fetch(`/api/jobs/${encodeURIComponent(id)}/${image ? "images" : "video"}`, { method: "DELETE" }));
    window.clearTimeout(pollTimer);
    if (selectedJobId === id) newCreation();
    await loadHistory();
    showToast(`${image ? "图片" : "视频"}文件和生成记录已删除，无法恢复`, "success");
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    deleteJobButton.disabled = false;
  }
});

/* ============ 轮询 ============ */
async function pollJob(id) {
  window.clearTimeout(pollTimer);
  try {
    const [job, runtime] = await Promise.all([
      parseResponse(await fetch(`/api/jobs/${encodeURIComponent(id)}`, { cache: "no-store" })),
      parseResponse(await fetch(`/api/jobs/${encodeURIComponent(id)}/runtime`, { cache: "no-store" })),
    ]);
    if (id !== selectedJobId || !currentUser) return;
    selectedJob = job;
    renderConversation(job, runtime);
    if (!TERMINAL_STATUSES.includes(job.status)) {
      pollTimer = window.setTimeout(() => pollJob(id), 3000);
    } else {
      loadHistory();
    }
  } catch (error) {
    if (id !== selectedJobId || !currentUser) return;
    statusMessage.textContent = error.message;
    pollTimer = window.setTimeout(() => pollJob(id), 5000);
  }
}

/* ============ 资产视图 ============ */
bindSegmented(assetsFilter, (value) => {
  assetsFilterValue = value;
  renderAssets();
});

function renderAssets() {
  const done = allJobs.filter((j) => j.status === "completed" && ((j.result_type === "image" && j.outputs?.length) || j.download_url));
  const filtered = done.filter((j) => assetsFilterValue === "all" || (j.result_type === "image") === (assetsFilterValue === "image"));
  assetsCount.textContent = `共 ${filtered.length} 个作品`;
  assetsGroups.replaceChildren();
  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "assets-empty";
    empty.textContent = "还没有作品。生成完成后，图片和视频会汇集到这里。";
    assetsGroups.append(empty);
    return;
  }
  const groups = new Map();
  filtered.forEach((job) => {
    const day = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric" }).format(new Date(job.created_at * 1000));
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day).push(job);
  });
  for (const [day, list] of groups) {
    const head = document.createElement("div");
    head.className = "assets-day-head";
    head.textContent = day;
    const grid = document.createElement("div");
    grid.className = "assets-grid";
    list.forEach((job) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "asset-tile";
      if (job.result_type === "image" && job.outputs?.[0]) {
        const img = document.createElement("img");
        img.src = `${job.outputs[0].url}?v=${job.updated_at || ""}`;
        img.alt = "";
        img.loading = "lazy";
        tile.append(img);
      } else {
        const vid = document.createElement("video");
        vid.src = `${job.download_url}?v=${job.updated_at || ""}`;
        vid.muted = true;
        vid.playsInline = true;
        vid.preload = "metadata";
        tile.append(vid);
      }
      const badge = document.createElement("span");
      badge.className = "at-badge";
      badge.textContent = job.result_type === "image" ? (job.outputs?.length > 1 ? `图片 ×${job.outputs.length}` : "图片") : "视频";
      const titleEl = document.createElement("span");
      titleEl.className = "at-title";
      titleEl.textContent = job.prompt || job.id;
      tile.append(badge, titleEl);
      tile.addEventListener("click", () => {
        setView("conversation");
        openConversation(job);
      });
      grid.append(tile);
    });
    assetsGroups.append(head, grid);
  }
}

/* ============ 管理 ============ */
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
  const button = adminUserForm.querySelector("button[type=submit]");
  button.disabled = true;
  try {
    await parseResponse(await fetch("/api/admin/users", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(data.entries())),
    }));
    adminUserForm.reset();
    await loadUsers();
    showToast("用户创建成功", "success");
  } catch (error) {
    showToast(error.message, "error");
  } finally { button.disabled = false; }
});

/* ============ 图片预览 ============ */
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

/* ============ API 密钥 ============ */
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

/* ============ 提交 ============ */
function autosizePrompt() {
  promptInput.style.height = "auto";
  promptInput.style.height = `${Math.min(promptInput.scrollHeight, 190)}px`;
}
promptInput.addEventListener("input", autosizePrompt);
promptInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    creationForm.requestSubmit();
  }
});
// 参数输入框内按 Enter 不应触发表单提交
creationForm.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.shiftKey) return;
  if (event.target === promptInput) return;
  const tag = event.target.tagName;
  if (tag === "INPUT" || tag === "SELECT") event.preventDefault();
});

function prepareVideoRequest(body) {
  const stepsText = String(body.get("num_inference_steps") || "").trim();
  const steps = stepsText ? Number(stepsText) : 50;
  if (!Number.isSafeInteger(steps) || steps < 1) throw new Error("推理步数须为正整数，留空默认 50 步");
  body.set("num_inference_steps", String(steps));
  const size = normalizeSize(body.get("size") || "");
  if (size) {
    if (!/^\d{2,5}x\d{2,5}$/.test(size) || size.split("x").map(Number).some((n) => n < 32 || n % 32)) {
      throw new Error("视频输出宽高须为正的 32 的整数倍，例如 1344x768");
    }
    body.set("size", size);
    body.delete("short_edge");
  } else {
    body.delete("size");
    body.set("short_edge", "768");
  }
  const durationText = String(body.get("seconds") || "").trim();
  const dur = durationText ? Number(durationText) : 4;
  if (!Number.isFinite(dur) || dur < 4 || dur > 15) throw new Error("视频时长须在 4–15 秒之间");
  let extra;
  try { extra = JSON.parse(String(body.get("extra_params") || "{}").trim() || "{}"); }
  catch { throw new Error("Extra params 必须是有效 JSON 对象"); }
  if (!extra || typeof extra !== "object" || Array.isArray(extra)) throw new Error("Extra params 必须是 JSON 对象");
  extra.duration = dur;
  body.set("extra_params", JSON.stringify(extra));
  if (Number.isInteger(dur)) body.set("seconds", String(dur));
  else body.delete("seconds");
  return body;
}

function captureParams() {
  const p = {
    mode: activeMode,
    size: currentSize,
    count,
    format: outputFormat,
    strength,
    prompt: promptInput.value.trim(),
    structured: structuredEnabled && isVideoMode(activeMode)
      ? { visuals: structuredVisuals.value, sound: structuredSound.value, music: structuredMusic.value }
      : null,
  };
  if (isVideoMode(activeMode)) {
    p.seconds = duration;
    p.steps = videoStepsInput.value;
    p.seed = videoSeedInput.value;
  } else {
    p.createMode = activeMode === "qwen_image" ? qwenCreateMode : zCreateMode;
    p.steps = imageStepsInput.value;
    p.seed = imageSeedInput.value;
    p.compression = compressionInput.value;
    p.cfg = activeMode === "qwen_image" ? qwenCfgInput.value : zCfgInput.value;
    if (activeMode === "z_image") p.device = deviceSelect.value;
  }
  p.negative = negativeInput.value.trim();
  return p;
}

function collectVideoBody() {
  const mode = activeMode;
  const body = new FormData();
  body.set("task_type", mode);
  body.set("prompt", buildPrompt());
  if (!body.get("prompt")) throw new Error("提示词不能为空");
  if (mode === "fl2va") {
    body.set("frame_mode", frameMode);
    const images = referencePond.getFiles();
    const expected = frameMode === "first_last" ? 2 : 1;
    if (images.length !== expected) {
      throw new Error(frameMode === "first_last" ? "首尾帧模式必须上传两张图片" : "请上传一张关键帧图片");
    }
    const field = expected === 2 ? "input_references" : "input_reference";
    images.forEach((item) => body.append(field, item.file, item.file.name));
  } else if (mode === "ref2va") {
    const images = referencePond2.getFiles();
    const videos = videoReferencePond.getFiles();
    const audios = audioReferencePond.getFiles();
    const total = images.length + videos.length + audios.length;
    if (!total) throw new Error("Ref2VA 至少需要一个参考素材");
    if (audios.length && !images.length && !videos.length) throw new Error("音频参考必须与图片或视频参考一起使用");
    [...images, ...videos, ...audios].forEach((item) => body.append("input_references", item.file, item.file.name));
  }
  if (currentSize) body.set("size", normalizeSize(currentSize));
  body.set("seconds", String(duration));
  body.set("num_outputs_per_prompt", String(count));
  const advFields = [
    "seed", "num_frames", "fps", "num_inference_steps", "guidance_scale", "guidance_scale_2",
    "true_cfg_scale", "boundary_ratio", "flow_shift", "sound_duration", "start_time_seconds",
    "enable_frame_interpolation", "frame_interpolation_exp", "frame_interpolation_scale",
    "frame_interpolation_model_path", "negative_prompt", "lora",
  ];
  for (const name of advFields) {
    const el = creationForm.querySelector(`[name="${name}"]`);
    const value = el ? String(el.value).trim() : "";
    if (value) body.set(name, value);
  }
  const extraRaw = String($("#extraParamsInput").value || "").trim();
  if (extraRaw) body.set("extra_params", extraRaw);
  prepareVideoRequest(body);
  return body;
}

async function submitVideoJob() {
  const captured = captureParams();
  creationSubmit.disabled = true;
  try {
    const body = collectVideoBody();
    const job = await parseResponse(await fetch("/api/jobs", { method: "POST", body }));
    submittedParams.set(job.id, captured);
    openConversation(job);
    setView("conversation");
    showToast(`任务已加入队列，当前第 ${job.queue_position || 1} 位`, "success");
    loadHistory();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    creationSubmit.disabled = false;
  }
}

function collectImagePayload(kind) {
  const prompt = promptInput.value.trim();
  if (!prompt) throw new Error("提示词不能为空");
  const payload = { prompt };
  const createMode = kind === "qwen" ? qwenCreateMode : zCreateMode;
  payload.mode = createMode;
  if (createMode === "edit") {
    const refs = kind === "qwen" ? qwenReferencePond.getFiles() : zImageReferencePond.getFiles();
    if (kind === "qwen") {
      if (!refs.length || refs.length > 4) throw new Error("参考图编辑需要上传 1–4 张图片");
    } else {
      if (refs.length !== 1) throw new Error("单图重绘必须上传 1 张原图");
    }
    if (refs.some((item) => item.status !== FilePond.FileStatus.IDLE)) throw new Error("请等待参考图片载入完成，并移除格式或大小不符合要求的文件");
  } else if (kind === "qwen" ? qwenReferencePond.getFiles().length : zImageReferencePond.getFiles().length) {
    throw new Error(kind === "qwen" ? "使用参考图片时请选择参考图编辑" : "使用参考图片时请选择单图重绘");
  }
  const cfg = MODE_CONFIG[kind === "qwen" ? "qwen_image" : "z_image"];
  const size = normalizeSize(currentSize || cfg.sizeDefault);
  if (!/^\d{2,5}x\d{2,5}$/.test(size)) throw new Error("图片尺寸格式应为 宽x高");
  if (size.split("x").map(Number).some((value) => value < 256 || value > 4096 || value % cfg.sizeMultiple)) {
    throw new Error(`图片宽高须为 256–4096 之间的 ${cfg.sizeMultiple} 的整数倍`);
  }
  payload.size = size;
  const n = Number(count);
  if (!Number.isSafeInteger(n) || n < 1 || n > 10) throw new Error("数量须为 1–10 的整数");
  payload.n = n;
  const stepsText = String(imageStepsInput.value || "").trim();
  if (stepsText) {
    const steps = Number(stepsText);
    if (!Number.isSafeInteger(steps) || steps < 1 || steps > 200) throw new Error("推理步数须为 1–200 的整数");
    payload.num_inference_steps = steps;
  }
  const seedText = String(imageSeedInput.value || "").trim();
  if (seedText) {
    if (!/^\d+$/.test(seedText) || !Number.isSafeInteger(Number(seedText))) throw new Error("随机种子须为非负整数");
    payload.seed = Number(seedText);
  }
  payload.output_format = outputFormat;
  const compText = String(compressionInput.value || "").trim();
  if (compText) {
    const comp = Number(compText);
    if (!Number.isSafeInteger(comp) || comp < 0 || comp > 100) throw new Error("输出编码参数须在 0–100 之间");
    if (kind === "qwen" || createMode === "edit") payload.output_compression = comp;
  }
  const negative = negativeInput.value.trim();
  if (negative) {
    if (negative.length > 4000) throw new Error("负面提示词不能超过 4000 个字符");
    payload.negative_prompt = negative;
  }
  if (kind === "qwen") {
    const c = Number(qwenCfgInput.value || 1);
    if (!Number.isFinite(c) || c < 0 || c > 20) throw new Error("True CFG 须在 0–20 之间");
    payload.true_cfg_scale = c;
    if (negative && c <= 1) throw new Error("使用负面提示词时，True CFG 必须大于 1");
    if (c > 1 && !negative) throw new Error("True CFG 大于 1 时，请填写负面提示词");
  } else {
    const c = Number(zCfgInput.value || 4);
    if (!Number.isFinite(c) || c < 0 || c > 20) throw new Error("CFG 须在 0–20 之间");
    payload.guidance_scale = c;
    if (createMode === "edit") {
      const st = Number(strength);
      if (!Number.isFinite(st) || st <= 0 || st > 1) throw new Error("重绘强度须大于 0 且不超过 1");
      payload.strength = st;
      const total = payload.num_inference_steps || 50;
      const effective = total - Math.trunc(Math.max(total - total * st, 0));
      if (effective < 2) throw new Error("重绘强度与步数组合过低，请提高强度或步数");
      const device = deviceSelect.value;
      if (device) payload.generator_device = device;
    }
  }
  return payload;
}

async function submitImageJob(kind) {
  const captured = captureParams();
  creationSubmit.disabled = true;
  try {
    const payload = collectImagePayload(kind);
    const url = kind === "qwen" ? "/api/qwen-image-jobs" : "/api/z-image-jobs";
    let options;
    if (payload.mode === "edit") {
      const refs = kind === "qwen" ? qwenReferencePond.getFiles() : zImageReferencePond.getFiles();
      const body = new FormData();
      for (const [key, value] of Object.entries(payload)) body.append(key, String(value));
      refs.forEach((item) => body.append("image", item.file, item.file.name));
      options = { method: "POST", body };
    } else {
      options = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) };
    }
    const job = await parseResponse(await fetch(url, options));
    submittedParams.set(job.id, captured);
    openConversation(job);
    setView("conversation");
    showToast(`${kind === "qwen" ? "Qwen 图像" : "造相"}任务已加入队列，当前第 ${job.queue_position || 1} 位`, "success");
    loadHistory();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    creationSubmit.disabled = false;
  }
}

creationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  closeAllPopovers();
  if (isVideoMode(activeMode)) submitVideoJob();
  else if (activeMode === "qwen_image") submitImageJob("qwen");
  else submitImageJob("z");
});

/* ============ 数据加载 ============ */
async function loadHistory() {
  if (!currentUser) return;
  try {
    const payload = await parseResponse(await fetch("/api/jobs?limit=30", { cache: "no-store" }));
    allJobs = payload.data || [];
    renderSidebarJobs();
    if (currentView === "assets") renderAssets();
    if (selectedJobId) {
      const updated = allJobs.find((j) => j.id === selectedJobId);
      if (updated && (!selectedJob || updated.updated_at > selectedJob.updated_at)) {
        selectedJob = updated;
        if (currentView === "conversation") renderConversation(updated, null);
      }
    }
  } catch (error) {
    if (!allJobs.length) {
      const empty = document.createElement("div");
      empty.className = "sidebar-jobs-empty";
      empty.textContent = error.message;
      sidebarJobs.replaceChildren(empty);
    }
  }
}

function renderModeServices(services) {
  document.querySelectorAll(".mo-service").forEach((node) => {
    const info = services && services[node.dataset.service];
    const state = info ? (info.ok ? "online" : "offline") : "unknown";
    node.classList.remove("online", "offline", "unknown");
    node.classList.add(state);
    const label = state === "online" ? "在线" : state === "offline" ? "离线" : "检查中";
    node.title = (info && info.url ? `${info.url} · ` : "") + label;
  });
}

async function checkHealth() {
  if (healthRequestPending) return;
  healthRequestPending = true;
  window.clearTimeout(healthTimer);
  try {
    const health = await parseResponse(await fetch("/api/health", { cache: "no-store" }));
    renderModeServices(health.services);
    queueRunningCount.textContent = String(health.running ?? "—");
    queueWaitingCount.textContent = String(health.queued ?? "—");
    serviceState.className = `service-state mini ${health.ok ? "online" : "offline"}`;
    serviceState.querySelector(".service-state-text").textContent = health.ok ? "推理服务在线" : "推理服务不可用";
  } catch {
    renderModeServices({});
    queueRunningCount.textContent = "—";
    queueWaitingCount.textContent = "—";
    serviceState.className = "service-state mini offline";
    serviceState.querySelector(".service-state-text").textContent = "网关服务不可用";
  } finally {
    healthRequestPending = false;
    if (currentUser) healthTimer = window.setTimeout(() => {
      if (!currentUser) return;
      checkHealth();
      loadHistory();
    }, 15000);
  }
}

/* ============ 启动 ============ */
async function loadSession() {
  try {
    const payload = await parseResponse(await fetch("/api/auth/me", { cache: "no-store" }));
    await showApplication(payload.user);
  } catch { showLogin(); }
}

// 初始化：默认 t2va
activeMode = "t2va";
restoreComposerState();
applyModeUI();
loadSession();
