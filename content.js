// SnapText content script — listens for messages and expands /atalhos in real time.

const DEFAULT_SNIPPETS = [];

let snippetsCache = DEFAULT_SNIPPETS;

function loadCache() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.local.get(["snippets"], (res) => {
      if (Array.isArray(res.snippets)) snippetsCache = res.snippets;
    });
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.snippets && Array.isArray(changes.snippets.newValue)) {
        snippetsCache = changes.snippets.newValue;
      }
    });
  }
}
loadCache();

let serviceNowCaseCache = null;

function isServiceNowPage() {
  return /service-now\.com$/i.test(window.location.hostname || "");
}

async function getServiceNowCaseData() {
  if (serviceNowCaseCache) return serviceNowCaseCache;
  if (!isServiceNowPage()) return null;

  const sysId = new URLSearchParams(window.location.search).get("sys_id");
  if (!sysId) return null;

  try {
    const fromMainWorld = await fetchServiceNowContextFromMainWorld(sysId);
    const ticket = fromMainWorld?.ticket || "";
    const user = fromMainWorld?.user || "";

    serviceNowCaseCache = {
      ticket: ticket || getServiceNowTicketFromDom(),
      user: user || getServiceNowUserFromDom(),
    };
    return serviceNowCaseCache;
  } catch {
    const ticket = getServiceNowTicketFromDom();
    const user = getServiceNowUserFromDom();
    if (!ticket && !user) return null;
    serviceNowCaseCache = { ticket, user };
    return serviceNowCaseCache;
  }
}

function fetchServiceNowContextFromMainWorld(sysId) {
  if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "FETCH_SN_CASE_CONTEXT", sysId }, (res) => {
      if (chrome.runtime.lastError || !res?.ok) {
        resolve(null);
        return;
      }
      resolve(res.context || null);
    });
  });
}

function getServiceNowTicketFromDom() {
  return (
    document.getElementById("sn_customerservice_case.u_order_number")?.value ||
    document.querySelector('[name="sn_customerservice_case.u_order_number"]')?.value ||
    ""
  ).trim();
}

function getServiceNowUserFromDom() {
  return (
    document.getElementById("sys_display.sn_customerservice_case.contact")?.value ||
    document.querySelector('[name="sys_display.sn_customerservice_case.contact"]')?.value ||
    ""
  ).trim();
}

async function resolveVars(text) {
  const nowDate = new Date();
  const dateTimeNow = nowDate.toLocaleString("pt-BR");
  const hour = nowDate.getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const onServiceNow = isServiceNowPage();
  let ticketValue = onServiceNow ? "{{ticket}}" : "INC" + Math.floor(Math.random() * 900000 + 100000);
  let userValue = onServiceNow ? "{{user}}" : "Você";

  // {{clipboard}} — resolve antes de tudo, com fallback silencioso
  if (/\{\{clipboard\}\}/i.test(text)) {
    const clip = await navigator.clipboard.readText().catch(() => "");
    text = text.replace(/\{\{clipboard\}\}/gi, clip);
  }

  if (/\{\{ticket\}\}|\{\{clientuser\}\}|\{\{user\}\}/.test(text)) {
    const caseData = await getServiceNowCaseData();
    if (caseData?.ticket) ticketValue = caseData.ticket;
    if (caseData?.user) userValue = caseData.user;
  }

  const normalizedGreetingText = text
    .replace(/\{\{greeting\}\}/gi, greeting)
    .replace(/\bBom dia\b|\bBoa tarde\b|\bBoa noite\b/i, greeting);

  return normalizedGreetingText
    .replace(/\{\{datetime\}\}/gi, dateTimeNow)
    .replace(/\{\{saudacao\}\}|\{\{date\}\}/gi, greeting)
    .replace(/\{\{clientuser\}\}|\{\{user\}\}/gi, userValue)
    .replace(/\{\{ticket\}\}/gi, ticketValue);
}

async function insertAtCursor(el, text) {
  const resolved = await resolveVars(text);
  if (el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && /text|search|email|url/i.test(el.type || "text"))) {
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    el.value = el.value.slice(0, start) + resolved + el.value.slice(end);
    el.selectionStart = el.selectionEnd = start + resolved.length;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  } else if (el.isContentEditable) {
    document.execCommand("insertText", false, resolved);
  }
}

async function replaceTriggerAt(el, typedToken, body) {
  const resolved = await resolveVars(body);
  if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
    const pos = el.selectionStart;
    if (!Number.isInteger(pos)) return;
    const start = Math.max(0, pos - typedToken.length);
    if (el.value.slice(start, pos) !== typedToken) return;
    el.value = el.value.slice(0, start) + resolved + el.value.slice(pos);
    el.selectionStart = el.selectionEnd = start + resolved.length;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  } else if (el.isContentEditable) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.setStart(range.endContainer, Math.max(0, range.endOffset - typedToken.length));
    range.deleteContents();
    range.insertNode(document.createTextNode(resolved));
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

let isReplacingTrigger = false;

async function tryExpandTrigger(el) {
  if (!el || isReplacingTrigger) return false;

  let textBefore = "";
  if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
    textBefore = (el.value || "").slice(0, el.selectionStart);
  } else if (el.isContentEditable) {
    const sel = window.getSelection();
    if (sel.rangeCount) {
      const r = sel.getRangeAt(0);
      textBefore = (r.endContainer.textContent || "").slice(0, r.endOffset);
    }
  } else {
    return false;
  }

  const match = textBefore.match(/([^\s]+)$/);
  if (!match) return false;

  const typedToken = match[1];
  const candidates = typedToken.startsWith("/")
    ? [typedToken, typedToken.slice(1)]
    : [typedToken, `/${typedToken}`];
  const found = snippetsCache.find((s) => candidates.includes((s.trigger || "").trim()));
  if (!found) return false;

  isReplacingTrigger = true;
  try {
    await replaceTriggerAt(el, typedToken, found.body);
    // Track real usage — fire-and-forget to background
    if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: "TRACK_USE", id: found.id, trigger: found.trigger });
    }
  } finally {
    isReplacingTrigger = false;
  }
  return true;
}

document.addEventListener("input", async (e) => {
  const el = e.target;
  await tryExpandTrigger(el);
}, true);

document.addEventListener("keydown", async (e) => {
  if (e.key !== "Tab") return;
  const el = document.activeElement;
  if (!el) return;
  const expanded = await tryExpandTrigger(el);
  if (!expanded) return;
  e.preventDefault();
}, true);

if (typeof chrome !== "undefined" && chrome.runtime) {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "INSERT_SNIPPET") {
      const el = document.activeElement;
      if (el) {
        insertAtCursor(el, msg.body).then(() => {
          // Track use — popup already tracks too, but background dedupes via id
          if (msg.id || msg.trigger) {
            chrome.runtime.sendMessage({ type: "TRACK_USE", id: msg.id, trigger: msg.trigger });
          }
          sendResponse({ ok: true });
        });
      } else {
        sendResponse({ ok: false });
      }
      return true;
    }
  });
}

getServiceNowCaseData();
