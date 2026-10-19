const $ = (selector) => document.querySelector(selector);

/* ============ 元素引用 ============ */
const appFrame = $("#appFrame");
const sidebar = $("#sidebar");
const sidebarJobs = $("#sidebarJobs");
const sidebarCollapse = $("#sidebarCollapse");
const sidebarExpand = $("#sidebarExpand");
const newCreationButton = $("#newCreationButton");
const viewTitle = $("#viewTitle");
const topbarSearch = $("#topbarSearch");
const conversationSearch = $("#conversationSearch");
const queueMiniDot = $("#queueMiniDot");
const queueRunningCount = $("#queueRunningCount");
const queueWaitingCount = $("#queueWaitingCount");
const genPlaceholder = $("#genPlaceholder");
const genPulse = $("#genPulse");
const genPercent = $("#genPercent");
const genText = $("#genText");
const serviceState = $("#serviceState");
const userBadge = $("#userBadge");
const mainContent = $("#mainContent");
const conversationView = $("#conversationView");
const welcomeBlock = $("#welcomeBlock");
const conversationBlock = $("#conversationBlock");
const conversationMeta = $("#conversationMeta");
const conversationTitle = $("#conversationTitle");
const conversationDeleteButton = $("#conversationDeleteButton");
const threadHistory = $("#threadHistory");
const turnJump = $("#turnJump");
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

/* ============ 图标体系（统一线性 SVG） ============ */
const ICON_ATTRS = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
const ICONS = {
  plus: `<svg ${ICON_ATTRS}><path d="M12 5v14M5 12h14"/></svg>`,
  chat: `<svg ${ICON_ATTRS}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  gallery: `<svg ${ICON_ATTRS}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`,
  users: `<svg ${ICON_ATTRS}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  menu: `<svg ${ICON_ATTRS}><path d="M3 6h18M3 12h18M3 18h18"/></svg>`,
  chevronLeft: `<svg ${ICON_ATTRS}><path d="m15 18-6-6 6-6"/></svg>`,
  clapper: `<svg ${ICON_ATTRS}><path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1-.3 2.1.3 2.4 1.3z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
  frame: `<svg ${ICON_ATTRS}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>`,
  film: `<svg ${ICON_ATTRS}><rect x="2" y="2" width="20" height="20" rx="2.2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/></svg>`,
  sparkle: `<svg ${ICON_ATTRS}><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg>`,
  palette: `<svg ${ICON_ATTRS}><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  layers: `<svg ${ICON_ATTRS}><path d="m12 2-10 5 10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>`,
  crop: `<svg ${ICON_ATTRS}><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/></svg>`,
  clock: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  copy: `<svg ${ICON_ATTRS}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  file: `<svg ${ICON_ATTRS}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M13 2v7h7"/></svg>`,
  contrast: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/></svg>`,
  sliders: `<svg ${ICON_ATTRS}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>`,
  pen: `<svg ${ICON_ATTRS}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>`,
  refresh: `<svg ${ICON_ATTRS}><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  swap: `<svg ${ICON_ATTRS}><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>`,
  sun: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  moon: `<svg ${ICON_ATTRS}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  search: `<svg ${ICON_ATTRS}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  x: `<svg ${ICON_ATTRS}><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  trash: `<svg ${ICON_ATTRS}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/></svg>`,
  dots: `<svg ${ICON_ATTRS}><circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg>`,
  toBottom: `<svg ${ICON_ATTRS}><path d="M12 4v11M7 11l5 5 5-5"/><path d="M5 20h14"/></svg>`,
};
document.querySelectorAll("[data-icon]").forEach((el) => {
  el.innerHTML = ICONS[el.dataset.icon] || "";
});

/* ============ 状态 ============ */
let currentUser = null;
let currentView = "conversation";
let selectedJobId = null;
let selectedJob = null;
let allJobs = [];
let assetsFilterValue = "all";

/* ============ 多轮对话 ============ */
let currentConversationId = "";
let selectedConversation = null; // { id, title, jobs: [] }
let conversations = []; // 来自 /api/conversations
let threadSignature = "";
let threadRequestSeq = 0;

function newConversationId() {
  try {
    return crypto.randomUUID();
  } catch (e) {
    return `conv_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  }
}
function loadConversationId() {
  try {
    const saved = localStorage.getItem("kaishi_conversation_id");
    if (saved && /^[A-Za-z0-9_-]{8,64}$/.test(saved)) return saved;
  } catch (e) {}
  const id = newConversationId();
  try { localStorage.setItem("kaishi_conversation_id", id); } catch (e) {}
  return id;
}
function saveConversationId(id) {
  try { localStorage.setItem("kaishi_conversation_id", id); } catch (e) {}
}
currentConversationId = loadConversationId();
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
// 面向普通用户的任务类型名（参数摘要用），技术名保留在 tooltip
const friendlyTask = {
  t2va: "文生视频", fl2va: "关键帧视频", ref2va: "多参考视频",
  text_to_image: "文生图", qwen_text_to_image: "Qwen 文生图", qwen_image_edit: "Qwen 参考图编辑",
  z_image_text_to_image: "造相文生图", z_image_image_to_image: "造相单图重绘",
  z_image_base_text_to_image: "造相文生图", z_image_base_image_to_image: "造相单图重绘",
};
const isVideoMode = (mode) => ["t2va", "fl2va", "ref2va"].includes(mode);

/* ============ 主题 ============ */
function currentTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem("kaishi_theme", theme); } catch (e) {}
  const label = theme === "light" ? `${ICONS.moon}<span>深色</span>` : `${ICONS.sun}<span>浅色</span>`;
  for (const el of [themeToggle, themeToggleLogin]) {
    if (el) el.innerHTML = label;
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
function askText({ title = "输入", label = "请输入", min = 1, max = 64, value = "", type = "text", okLabel = "保存" }) {
  return new Promise((resolve) => {
    promptResolver = resolve;
    $("#promptTitle").textContent = title;
    $("#promptLabel").textContent = label;
    const input = $("#promptInputValue");
    input.type = type;
    input.minLength = min;
    input.maxLength = max;
    input.value = value;
    input.setCustomValidity("");
    $("#promptOkButton").textContent = okLabel;
    $("#promptModal").hidden = false;
    input.focus();
    input.select();
  });
}
function askPrompt({ title, label }) {
  return askText({ title, label, min: 8, max: 64, type: "password", okLabel: "确认" });
}
function closePrompt(result) {
  if (!$("#promptModal").hidden) $("#promptModal").hidden = true;
  if (promptResolver) { promptResolver(result); promptResolver = null; }
}
$("#promptOkButton").addEventListener("click", () => {
  const input = $("#promptInputValue");
  const value = input.value.trim();
  const min = Number(input.minLength || 1);
  if (value.length < min) {
    input.setCustomValidity(`内容至少需要 ${min} 个字符`);
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
      // 分段按钮历史上混用 data-value / data-filter 两种属性
      onChange(btn.dataset.value ?? btn.dataset.filter);
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
  conversations = [];
  selectedConversation = null;
  conversationMeta.hidden = true;
  threadHistory.replaceChildren();
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
const isMobileViewport = () => window.matchMedia("(max-width: 760px)").matches;

function applySidebarRailState() {
  if (isMobileViewport()) {
    // 移动端：侧边栏是抽屉，顶栏必须始终显示 ☰ 打开按钮
    appFrame.classList.remove("rail");
    sidebarExpand.hidden = false;
    return;
  }
  let rail = false;
  try { rail = localStorage.getItem("kaishi_sidebar_rail") === "1"; } catch (e) {}
  appFrame.classList.toggle("rail", rail);
  sidebarExpand.hidden = !rail;
}
let railResizeTimer = null;
window.addEventListener("resize", () => {
  window.clearTimeout(railResizeTimer);
  railResizeTimer = window.setTimeout(applySidebarRailState, 150);
});
sidebarCollapse.addEventListener("click", () => {
  appFrame.classList.add("rail");
  sidebarExpand.hidden = false;
  try { localStorage.setItem("kaishi_sidebar_rail", "1"); } catch (e) {}
});
sidebarExpand.addEventListener("click", () => {
  if (isMobileViewport()) {
    appFrame.classList.toggle("mobile-open");
  } else {
    appFrame.classList.remove("rail");
    sidebarExpand.hidden = true;
    try { localStorage.setItem("kaishi_sidebar_rail", "0"); } catch (e) {}
  }
});
// 点击内容区或遮罩关闭移动端抽屉
mainContent.addEventListener("click", () => appFrame.classList.remove("mobile-open"));
appFrame.addEventListener("click", (event) => {
  if (isMobileViewport() && event.target === appFrame) appFrame.classList.remove("mobile-open");
});

newCreationButton.addEventListener("click", newCreation);
function newCreation() {
  currentConversationId = newConversationId();
  saveConversationId(currentConversationId);
  selectedConversation = null;
  conversationMeta.hidden = true;
  threadHistory.replaceChildren();
  threadSignature = "";
  turnJump.hidden = true;
  window.clearTimeout(pollTimer);
  selectedJobId = null;
  selectedJob = null;
  setView("conversation");
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
  topbarSearch.hidden = view !== "conversation";
  if (view !== "conversation") {
    conversationSearch.value = "";
    hideTurnCard();
    turnJump.hidden = true; // 轮次轨道只在对话视图显示
  } else {
    renderTurnJump();
  }
  appFrame.classList.remove("mobile-open");
  // 注意：不能加 allJobs.length 守卫——数据未加载完时也要渲染（显示空态提示）
  if (view === "assets") renderAssets();
  if (view === "admin" && currentUser?.role === "admin") loadUsers();
  mainContent.scrollTop = 0;
}

function formatTime(timestamp) {
  if (!timestamp) return "";
  return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(timestamp * 1000));
}

function relativeTime(timestamp) {
  const diff = Math.max(0, Date.now() / 1000 - timestamp);
  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  if (diff < 172800) return "昨天";
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} 天前`;
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(new Date(timestamp * 1000));
}

// 侧边栏友好标题：结构化拼装文本取 [镜头N] 后的中文内容
function jobTitle(job) {
  const raw = job.prompt || job.id;
  if (raw.includes("integrated_multimodal_description:")) {
    const m = raw.match(/integrated_multimodal_description:\s*([^\n]+)/);
    const content = (m ? m[1] : raw).replace(/^\[镜头\d+\]\s*/, "").trim();
    return content.slice(0, 20) + (content.length > 20 ? "…" : "");
  }
  return raw.length > 40 ? raw.slice(0, 40) + "…" : raw;
}

let searchQuery = "";
conversationSearch.addEventListener("input", () => {
  searchQuery = conversationSearch.value.trim().toLowerCase();
  renderSidebarJobs();
});

async function loadConversations() {
  if (!currentUser) return;
  try {
    const payload = await parseResponse(await fetch("/api/conversations?limit=30", { cache: "no-store" }));
    conversations = payload.data || [];
  } catch {
    conversations = [];
  }
}

function buildThumbFor(job) {
  const thumb = document.createElement("span");
  thumb.className = "sj-thumb";
  if (job && job.result_type === "image" && job.outputs?.length) {
    const img = document.createElement("img");
    img.src = `${job.outputs[0].url}?v=${job.updated_at || ""}`;
    img.alt = "";
    img.loading = "lazy";
    thumb.append(img);
  } else {
    thumb.innerHTML = job && job.result_type === "image" ? ICONS.frame : ICONS.clapper;
  }
  return thumb;
}

function buildJobItem(job) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.dataset.jobId = job.id;
  btn.className = "sidebar-job" + (job.id === selectedJobId && !selectedConversation ? " active" : "");
  const copy = document.createElement("span");
  copy.className = "sj-copy";
  const strong = document.createElement("strong");
  strong.textContent = jobTitle(job);
  const small = document.createElement("small");
  const dot = document.createElement("i");
  dot.className = `sj-dot ${job.status || ""}`;
  small.append(dot, document.createTextNode(`${friendlyTask[job.task_type] || taskLabels[job.task_type] || job.task_type || "任务"} · ${relativeTime(job.created_at)}`));
  copy.append(strong, small);
  btn.append(buildThumbFor(job), copy);
  btn.title = `${job.prompt || job.id}\n${formatTime(job.created_at)}`;
  btn.addEventListener("click", () => {
    setView("conversation");
    openJobOrConversation(job);
  });
  return btn;
}

function buildConversationItem(conv, jobs) {
  const btn = document.createElement("div");
  btn.className = "sidebar-job" + (selectedConversation?.id === conv.id ? " active" : "");
  btn.tabIndex = 0;
  btn.dataset.convId = conv.id;
  const latestInList = jobs.find((j) => j.id === conv.latest_job_id) || jobs[0] || null;
  const copy = document.createElement("span");
  copy.className = "sj-copy";
  const strong = document.createElement("strong");
  strong.textContent = conv.title;
  const small = document.createElement("small");
  const dot = document.createElement("i");
  dot.className = `sj-dot ${conv.latest_status || ""}`;
  small.append(dot, document.createTextNode(`${conv.turn_count} 轮 · ${relativeTime(conv.updated_at)}`));
  copy.append(strong, small);
  // DSH 逻辑：行尾 "⋯" 按钮（标题 hover 时出现，拦截点击），点开菜单
  const kebab = document.createElement("button");
  kebab.type = "button";
  kebab.className = "sj-kebab";
  kebab.title = "对话操作";
  kebab.setAttribute("aria-label", "对话操作");
  kebab.innerHTML = ICONS.dots;
  kebab.addEventListener("click", (event) => {
    event.stopPropagation();
    openConversationMenu(conv, kebab);
  });
  btn.append(buildThumbFor(latestInList), copy, kebab);
  btn.title = conv.title;
  btn.addEventListener("click", () => {
    setView("conversation");
    openConversationThread(conv.id);
  });
  btn.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      setView("conversation");
      openConversationThread(conv.id);
    }
  });
  // DSH 逻辑：双击标题 = 重命名
  copy.addEventListener("dblclick", (event) => {
    event.stopPropagation();
    renameConversation(conv.id, conv.title);
  });
  return btn;
}

/* ============ 对话操作菜单（DSH "⋯" 模式） ============ */
let convMenu = null;
function closeConversationMenu() {
  if (convMenu) {
    convMenu.remove();
    convMenu = null;
  }
  document.querySelectorAll(".sj-kebab.menu-open").forEach((b) => b.classList.remove("menu-open"));
}
function openConversationMenu(conv, anchor) {
  closeConversationMenu();
  anchor.classList.add("menu-open");
  convMenu = document.createElement("div");
  convMenu.className = "conv-menu";
  convMenu.setAttribute("role", "menu");
  const mkItem = (icon, text, onClick, danger = false) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "conv-menu-item" + (danger ? " danger" : "");
    item.setAttribute("role", "menuitem");
    const ic = document.createElement("span");
    ic.className = "ic";
    ic.innerHTML = icon;
    item.append(ic, document.createTextNode(text));
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      closeConversationMenu();
      onClick();
    });
    return item;
  };
  convMenu.append(
    mkItem(ICONS.pen, "重命名对话", () => renameConversation(conv.id, conv.title)),
  );
  const sep = document.createElement("div");
  sep.className = "conv-menu-sep";
  convMenu.append(sep, mkItem(ICONS.trash, "删除对话", () => deleteConversationById(conv.id, conv.title), true));
  document.body.append(convMenu);
  const rect = anchor.getBoundingClientRect();
  const mw = convMenu.offsetWidth;
  const mh = convMenu.offsetHeight;
  let left = rect.right - mw;
  let top = rect.bottom + 6;
  if (top + mh > window.innerHeight - 8) top = rect.top - mh - 6;
  left = Math.max(8, left);
  convMenu.style.left = `${left}px`;
  convMenu.style.top = `${top}px`;
}
document.addEventListener("click", (event) => {
  if (convMenu && !convMenu.contains(event.target) && !event.target.closest?.(".sj-kebab")) closeConversationMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeConversationMenu();
});

function renderSidebarJobs() {
  sidebarJobs.replaceChildren();
  const q = searchQuery;
  const convs = conversations
    .map((conv) => ({ conv, jobs: allJobs.filter((j) => j.conversation_id === conv.id) }))
    .filter(({ conv, jobs }) => !q || conv.title.toLowerCase().includes(q) || jobs.some((j) => (j.prompt || "").toLowerCase().includes(q)));
  const legacy = allJobs
    .filter((j) => !j.conversation_id)
    .filter((j) => !q || (j.prompt || "").toLowerCase().includes(q) || jobTitle(j).toLowerCase().includes(q));
  if (!convs.length && !legacy.length) {
    const empty = document.createElement("div");
    empty.className = "sidebar-jobs-empty";
    empty.textContent = q ? "没有匹配的对话记录" : "暂无对话记录\n点“新对话”开始创作";
    sidebarJobs.append(empty);
    return;
  }
  convs.forEach(({ conv, jobs }) => sidebarJobs.append(buildConversationItem(conv, jobs)));
  legacy.forEach((job) => sidebarJobs.append(buildJobItem(job)));
}

/* ============ 对话视图 ============ */
function openConversation(job) {
  selectedConversation = null;
  conversationMeta.hidden = true;
  threadHistory.replaceChildren();
  threadSignature = "";
  turnJump.hidden = true;
  selectedJobId = job.id;
  selectedJob = job;
  welcomeBlock.hidden = true;
  conversationBlock.hidden = false;
  renderConversation(job, null);
  renderSidebarJobs();
  mainContent.scrollTop = 0;
  pollJob(job.id);
}

function openJobOrConversation(job) {
  setView("conversation");
  if (job.conversation_id) {
    openConversationThread(job.conversation_id);
  } else {
    openConversation(job);
  }
}

async function openConversationThread(convId) {
  const seq = ++threadRequestSeq;
  currentConversationId = convId;
  saveConversationId(convId);
  setView("conversation");
  welcomeBlock.hidden = true;
  conversationBlock.hidden = false;
  conversationMeta.hidden = false;
  conversationTitle.textContent = "加载中…";
  threadHistory.replaceChildren();
  threadSignature = "";
  mainContent.scrollTop = 0;
  try {
    const data = await parseResponse(await fetch(`/api/conversations/${encodeURIComponent(convId)}`, { cache: "no-store" }));
    if (seq !== threadRequestSeq) return; // 用户已切走
    if (!data.data.length) {
      showToast("该对话的任务已全部删除", "info");
      newCreation();
      return;
    }
    selectedConversation = { ...data.conversation, jobs: data.data };
    conversationTitle.textContent = data.conversation.title;
    renderSidebarJobs();
    const last = data.data[data.data.length - 1];
    selectedJobId = last ? last.id : null;
    selectedJob = last || null;
    renderThread();
  } catch (error) {
    if (seq !== threadRequestSeq) return;
    showToast(error.message, "error");
  }
}

conversationDeleteButton.addEventListener("click", () => {
  if (selectedConversation) deleteConversationById(selectedConversation.id, selectedConversation.title);
});

async function deleteConversationById(convId, title) {
  const ok = await askConfirm({
    title: "删除对话",
    message: `确定删除对话“${title}”吗？其中全部任务记录和已生成的文件将被永久删除，无法恢复。`,
    okLabel: "删除对话",
  });
  if (!ok) return;
  try {
    await parseResponse(await fetch(`/api/conversations/${encodeURIComponent(convId)}`, { method: "DELETE" }));
    showToast("对话已删除", "success");
    if (selectedConversation?.id === convId) {
      selectedConversation = null;
      conversationMeta.hidden = true;
      threadHistory.replaceChildren();
      threadSignature = "";
      turnJump.hidden = true;
      newCreation();
    }
    await Promise.all([loadHistory(), loadConversations()]);
    renderSidebarJobs();
  } catch (error) {
    showToast(error.message, "error");
  }
}

// 重命名入口在侧边栏对话项 hover 按钮（对标 DeepSeek Harness）
async function renameConversation(convId, currentTitle) {
  const title = await askText({
    title: "重命名对话",
    label: "对话标题（1–64 个字符）",
    min: 1, max: 64,
    value: currentTitle,
  });
  if (title === null) return;
  try {
    const payload = await parseResponse(await fetch(`/api/conversations/${encodeURIComponent(convId)}/title`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }));
    conversations = conversations.map((c) => (c.id === convId ? { ...c, title: payload.title } : c));
    if (selectedConversation?.id === convId) {
      selectedConversation.title = payload.title;
      conversationTitle.textContent = payload.title;
    }
    renderSidebarJobs();
    showToast("对话已重命名", "success");
  } catch (error) {
    showToast(error.message, "error");
  }
}

function renderThread() {
  if (!selectedConversation || !selectedConversation.jobs.length) return;
  const last = selectedConversation.jobs[selectedConversation.jobs.length - 1];
  refreshThreadHistory();
  renderConversation(last, null);
  mainContent.scrollTop = 0;
  pollJob(last.id);
}

function refreshThreadHistory() {
  if (!selectedConversation) return;
  const past = selectedConversation.jobs.slice(0, -1);
  const sig = past.map((j) => `${j.id}:${j.status}`).join("|");
  if (sig !== threadSignature) {
    threadSignature = sig;
    threadHistory.replaceChildren();
    past.forEach((job) => threadHistory.append(buildTurnCard(job)));
  }
  renderTurnJump();
}

/* ============ 轮次轨道（DSH 逻辑：固定间距刻度 + 滚动跟随高亮 + 预览卡片 + 回到底部） ============ */
const turnTrackCard = document.createElement("div");
turnTrackCard.className = "tj-card";
document.body.append(turnTrackCard);
function showTurnCard(mark, index, job) {
  turnTrackCard.replaceChildren();
  const head = document.createElement("div");
  head.className = "tj-card-head";
  head.textContent = `第 ${index + 1} 轮 · ${labels[job.status] || job.status}`;
  const prompt = document.createElement("div");
  prompt.className = "tj-card-prompt";
  prompt.textContent = job.prompt || `（第 ${index + 1} 轮）`;
  turnTrackCard.append(head, prompt);
  turnTrackCard.classList.add("show");
  const rect = mark.getBoundingClientRect();
  const w = turnTrackCard.offsetWidth;
  const h = turnTrackCard.offsetHeight;
  let top = rect.top + rect.height / 2 - h / 2;
  top = Math.min(Math.max(8, top), window.innerHeight - h - 8);
  turnTrackCard.style.left = `${Math.max(8, rect.left - w - 10)}px`;
  turnTrackCard.style.top = `${top}px`;
}
function hideTurnCard() {
  turnTrackCard.classList.remove("show");
}

function renderTurnJump() {
  turnJump.replaceChildren();
  hideTurnCard();
  const jobs = selectedConversation ? selectedConversation.jobs : [];
  if (!selectedConversation || jobs.length < 2) {
    turnJump.hidden = true;
    return;
  }
  turnJump.hidden = false;
  turnTrackPinnedUntil = 0; // 重新构建轨道时解除点击锁定
  const cards = [...threadHistory.children];
  jobs.forEach((job, index) => {
    const mark = document.createElement("button");
    mark.type = "button";
    mark.className = "tj-mark";
    mark.setAttribute("aria-label", `跳转到第 ${index + 1} 轮`);
    mark.addEventListener("mouseenter", () => showTurnCard(mark, index, job));
    mark.addEventListener("mouseleave", hideTurnCard);
    mark.addEventListener("focus", () => showTurnCard(mark, index, job));
    mark.addEventListener("blur", hideTurnCard);
    mark.addEventListener("click", () => {
      hideTurnCard();
      // 点击优先：立即高亮被点击的刻度，并锁定（平滑滚动期间几何判定不抢高亮）
      [...turnJump.querySelectorAll(".tj-mark")].forEach((m, i) => m.classList.toggle("current", i === index));
      const notScrollable = mainContent.scrollHeight <= mainContent.clientHeight + 4;
      // 整屏放得下的对话没有滚动可跟随，点击的刻度保持高亮；可滚动对话锁定 1.2s
      turnTrackPinnedUntil = notScrollable ? Number.MAX_SAFE_INTEGER : performance.now() + 1200;
      const target = index === jobs.length - 1
        ? conversationBlock.querySelector(".conversation-head")
        : cards[index];
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    turnJump.append(mark);
  });
  // 回到底部（DSH：轨道旁的回到底部按钮）
  const back = document.createElement("button");
  back.type = "button";
  back.className = "tj-back";
  back.title = "回到最新一轮";
  back.setAttribute("aria-label", "回到最新一轮");
  back.innerHTML = ICONS.toBottom;
  back.addEventListener("click", () => {
    const head = conversationBlock.querySelector(".conversation-head");
    if (head) head.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  turnJump.append(back);
  updateTurnTrackActive();
}

// 高亮跟随滚动（顶线穿越算法）：最后一个"顶部已越过检测线"的轮次为当前轮次。
// 检测线取容器顶部下方 96px——点击某刻度滚动到位后，其上方不会再有轮次越线，高亮稳定不漂移
let turnTrackPinnedUntil = 0;
function updateTurnTrackActive() {
  if (turnJump.hidden || !selectedConversation) return;
  const marks = [...turnJump.querySelectorAll(".tj-mark")];
  if (!marks.length) return;
  if (performance.now() < turnTrackPinnedUntil) return; // 锁定期间尊重点击的刻度
  const notScrollable = mainContent.scrollHeight <= mainContent.clientHeight + 4;
  if (notScrollable) {
    // 整屏可见：活动轮次是最新一轮（DSH 尾部定位语义）
    marks.forEach((m, i) => m.classList.toggle("current", i === marks.length - 1));
    return;
  }
  const box = mainContent.getBoundingClientRect();
  const line = box.top + 96;
  const targets = [...threadHistory.children];
  const head = conversationBlock.querySelector(".conversation-head");
  if (head) targets.push(head);
  let found = 0;
  targets.forEach((el, i) => {
    if (el.getBoundingClientRect().top <= line) found = i;
  });
  marks.forEach((mark, i) => mark.classList.toggle("current", i === found));
}
let turnTrackRaf = 0;
mainContent.addEventListener("scroll", () => {
  if (turnTrackRaf) return;
  turnTrackRaf = requestAnimationFrame(() => {
    turnTrackRaf = 0;
    updateTurnTrackActive();
  });
});
// 内容尺寸变化（新轮次/媒体加载/窗口缩放）时同步高亮，避免状态过期
try {
  new ResizeObserver(() => updateTurnTrackActive()).observe(conversationBlock);
} catch (e) {}
let turnTrackResizeTimer = 0;
window.addEventListener("resize", () => {
  window.clearTimeout(turnTrackResizeTimer);
  turnTrackResizeTimer = window.setTimeout(updateTurnTrackActive, 150);
});

function buildTurnCard(job) {
  const card = document.createElement("div");
  card.className = `turn-card turn-${job.status || ""}`;
  const head = document.createElement("div");
  head.className = "turn-head";
  const pill = document.createElement("span");
  pill.className = `status-pill ${job.status || ""}`;
  pill.textContent = labels[job.status] || job.status;
  const time = document.createElement("span");
  time.className = "turn-time";
  time.textContent = formatTime(job.created_at);
  head.append(pill, time);
  const promptEl = document.createElement("div");
  promptEl.className = "turn-prompt";
  promptEl.textContent = job.prompt || "";
  card.append(head, promptEl);
  if (job.download_url) {
    const vid = document.createElement("video");
    vid.controls = true;
    vid.playsInline = true;
    vid.preload = "metadata";
    vid.src = `${job.download_url}?v=${job.updated_at || ""}`;
    card.append(vid);
  }
  if (job.result_type === "image" && job.outputs?.length) {
    const row = document.createElement("div");
    row.className = "turn-images";
    job.outputs.forEach((output, index) => {
      const img = document.createElement("img");
      img.src = `${output.url}?v=${job.updated_at || ""}`;
      img.alt = `第 ${index + 1} 张图片`;
      img.loading = "lazy";
      img.addEventListener("click", () => openImagePreview(img.src, `图片 ${index + 1}`));
      row.append(img);
    });
    card.append(row);
  }
  const failure = errorText(job.error);
  if (failure) {
    const err = document.createElement("div");
    err.className = "turn-error";
    err.textContent = failure;
    card.append(err);
  }
  const actions = document.createElement("div");
  actions.className = "turn-actions";
  actions.append(mkTurnButton("pen", "重新编辑", () => prefillFromJob(job)));
  if (job.status === "queued") {
    const cancel = mkTurnButton("x", "取消任务", async () => {
      const ok = await askConfirm({ title: "取消任务", message: "该任务尚未开始处理，确定取消吗？", okLabel: "取消任务" });
      if (!ok) return;
      cancel.disabled = true;
      try {
        await parseResponse(await fetch(`/api/jobs/${encodeURIComponent(job.id)}`, { method: "DELETE" }));
        showToast("任务已取消", "success");
        await openConversationThread(selectedConversation.id);
      } catch (error) {
        showToast(error.message, "error");
      }
    });
    actions.append(cancel);
  }
  if (["failed", "cancelled"].includes(job.status)) {
    const regen = mkTurnButton("refresh", "再次生成", async () => {
      regen.disabled = true;
      try {
        await parseResponse(await fetch(`/api/jobs/${encodeURIComponent(job.id)}/retry`, { method: "POST" }));
        showToast("任务已重新提交", "success");
        await openConversationThread(selectedConversation.id);
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        regen.disabled = false;
      }
    });
    actions.append(regen);
  }
  card.append(actions);
  return card;
}

function mkTurnButton(icon, text, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "ghost-button sm";
  const ic = document.createElement("span");
  ic.className = "ic";
  ic.innerHTML = ICONS[icon] || "";
  btn.append(ic, document.createTextNode(text));
  btn.addEventListener("click", onClick);
  return btn;
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
    // "progress" 会与 Bootstrap 的 .progress 组件样式冲突，改用别名
    const safeType = entry.type === "progress" ? "progress-step" : (entry.type || "");
    item.className = `runtime-event ${safeType}`;
    item.textContent = entry.message;
    runtimeEvents.append(item);
  });
  runtimeEvents.hidden = false;
}

// 结构化提示词按官方三字段渲染为中文标签行；普通提示词原样展示
function renderPromptBlock(job) {
  conversationPrompt.replaceChildren();
  const raw = job.prompt || "";
  if (!raw) return;
  if (!raw.includes("integrated_multimodal_description:")) {
    conversationPrompt.textContent = raw;
    return;
  }
  const keyLabels = {
    integrated_multimodal_description: "画面与动作",
    overall_soundscape: "环境声音",
    non_diegetic_music: "背景音乐",
  };
  const sections = raw.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  let started = false;
  sections.forEach((section) => {
    let labelName = null;
    let keyName = "";
    let value = section;
    for (const [key, name] of Object.entries(keyLabels)) {
      if (section.startsWith(key + ":")) {
        labelName = name;
        keyName = key;
        value = section.slice(key.length + 1).trim();
        break;
      }
    }
    if (!labelName && !started) labelName = "关键帧对齐";
    started = true;
    if (!value || value === "N/A") return;
    const row = document.createElement("div");
    row.className = "prompt-field-row";
    const lab = document.createElement("span");
    lab.className = "pf-label";
    lab.textContent = labelName;
    if (keyName) lab.title = keyName;
    const val = document.createElement("span");
    val.className = "pf-value";
    val.textContent = value;
    row.append(lab, val);
    conversationPrompt.append(row);
  });
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
  progressBar.classList.toggle("flowing", job.status === "in_progress");
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
  renderPromptBlock(job);
  const p = submittedParams.get(job.id) || {};
  conversationParams.replaceChildren();
  const mkParam = (text, bold = false, title = "") => {
    const span = document.createElement("span");
    span.className = "conv-param";
    if (title) span.title = title;
    if (bold) {
      const b = document.createElement("b");
      b.textContent = text;
      span.append(b);
    } else {
      span.textContent = text;
    }
    return span;
  };
  conversationParams.append(mkParam(friendlyTask[job.task_type] || job.task_type || "任务", true, taskLabels[job.task_type] || ""));
  if (p.size) conversationParams.append(mkParam(String(p.size)));
  if (p.seconds) conversationParams.append(mkParam(`${p.seconds}s`));
  if (p.count) conversationParams.append(mkParam(`${p.count} 个`));
  if (job.result_type === "image" && p.format) conversationParams.append(mkParam(String(p.format).toUpperCase()));
  if (job.model && job.model !== "MiniMaxH3") conversationParams.append(mkParam(String(job.model), true));
  conversationParams.hidden = false;
  // 视频任务生成中：画幅占位块
  const videoActive = job.result_type === "video" && ["queued", "submitting", "in_progress"].includes(job.status);
  genPlaceholder.hidden = !videoActive;
  if (videoActive) {
    const size = p.size || job.size || "";
    const [w, h] = String(size).toLowerCase().split("x").map(Number);
    genPlaceholder.style.aspectRatio = w && h ? `${w} / ${h}` : "16 / 9";
    if (job.status === "in_progress") {
      genPulse.hidden = true;
      const gp = runtime?.generation_progress ?? null;
      genPercent.hidden = gp == null;
      genPercent.textContent = gp != null ? `${gp}%` : "";
      genText.textContent = runtime?.step != null && runtime.total_steps
        ? `扩散生成 ${runtime.step}/${runtime.total_steps}`
        : "模型正在生成";
    } else {
      genPulse.hidden = false;
      genPercent.hidden = true;
      genText.textContent = job.status === "queued"
        ? `排队等待${job.queue_position ? ` · 第 ${job.queue_position} 位` : ""}`
        : "正在提交到模型服务";
    }
  }
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
  if (selectedJob) prefillFromJob(selectedJob);
});

function prefillFromJob(job) {
  const p = submittedParams.get(job.id) || {};
  // 重新编辑继承该任务所属的对话
  if (job.conversation_id) {
    currentConversationId = job.conversation_id;
    saveConversationId(currentConversationId);
  }
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
}

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
    if (selectedConversation && job.conversation_id === selectedConversation.id) {
      const idx = selectedConversation.jobs.findIndex((j) => j.id === job.id);
      if (idx !== -1) selectedConversation.jobs[idx] = job;
      refreshThreadHistory();
    }
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
    openJobOrConversation(job);
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
    if (selectedJobId === id) {
      const convId = selectedConversation?.id;
      selectedConversation = null;
      selectedJobId = null;
      selectedJob = null;
      conversationMeta.hidden = true;
      threadHistory.replaceChildren();
      threadSignature = "";
      if (convId) {
        await openConversationThread(convId); // 对话内已无任务时会自动开新对话
      } else {
        newCreation();
      }
    }
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
    if (selectedConversation && job.conversation_id === selectedConversation.id) {
      const idx = selectedConversation.jobs.findIndex((j) => j.id === job.id);
      if (idx === -1) selectedConversation.jobs.push(job);
      else selectedConversation.jobs[idx] = job;
      refreshThreadHistory();
    }
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
  if (currentConversationId) body.set("conversation_id", currentConversationId);
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
    openJobOrConversation(job);
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
  if (currentConversationId) payload.conversation_id = currentConversationId;
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
    openJobOrConversation(job);
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
    await loadConversations();
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
    queueMiniDot.className = `qm-dot ${health.ok ? "on" : "off"}`;
    queueMiniDot.title = health.ok ? "推理服务在线" : "推理服务不可用";
    queueRunningCount.textContent = String(health.running ?? "—");
    queueWaitingCount.textContent = String(health.queued ?? "—");
    serviceState.className = `service-state mini ${health.ok ? "online" : "offline"}`;
    serviceState.querySelector(".service-state-text").textContent = health.ok ? "推理服务在线" : "推理服务不可用";
  } catch {
    renderModeServices({});
    queueMiniDot.className = "qm-dot off";
    queueMiniDot.title = "网关服务不可用";
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
