// SnapText content script — listens for messages and expands /atalhos in real time.

const DEFAULT_SNIPPETS = [
  { trigger: "/vm", body: "Realizado restart da VM, serviço normalizado sem impacto adicional." },
  { trigger: "/sla", body: "Conforme SLA acordado, prazo de atendimento de até 4 horas úteis." },
  { trigger: "/ack", body: "Recebido. Iniciando análise, retorno em até 30 minutos com update." },
  { trigger: "/sig", body: "Atenciosamente,\nEquipe de Operações N2" },
  { trigger: "/inc", body: "Incidente {{ticket}} aberto em {{date}}.\nSeveridade: {{sev}}\nResponsável: {{user}}" },
  { trigger: "/rca", body: "Root cause: configuração incorreta.\nAção: rollback aplicado e validado em produção." },
];

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

function resolveVars(text) {
  const date = new Date().toLocaleDateString("pt-BR");
  return text
    .replace(/\{\{date\}\}/g, date)
    .replace(/\{\{user\}\}/g, "Você")
    .replace(/\{\{ticket\}\}/g, "INC" + Math.floor(Math.random() * 900000 + 100000))
    .replace(/\{\{sev\}\}/g, "P3");
}

function insertAtCursor(el, text) {
  const resolved = resolveVars(text);
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

function replaceTriggerAt(el, triggerLen, body) {
  const resolved = resolveVars(body);
  if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
    const pos = el.selectionStart;
    el.value = el.value.slice(0, pos - triggerLen) + resolved + el.value.slice(pos);
    el.selectionStart = el.selectionEnd = pos - triggerLen + resolved.length;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  } else if (el.isContentEditable) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.setStart(range.endContainer, Math.max(0, range.endOffset - triggerLen));
    range.deleteContents();
    range.insertNode(document.createTextNode(resolved));
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

let isReplacingTrigger = false;
let scheduledExpand = null;

function tryExpandTrigger(el) {
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

  const match = textBefore.match(/(\/[a-zA-Z0-9_-]+)$/);
  if (!match) return false;

  const trig = match[1];
  const found = snippetsCache.find((s) => s.trigger === trig);
  if (!found) return false;

  isReplacingTrigger = true;
  try {
    replaceTriggerAt(el, trig.length, found.body);
  } finally {
    isReplacingTrigger = false;
  }
  return true;
}

function scheduleTriggerExpansion() {
  if (scheduledExpand) return;
  scheduledExpand = setTimeout(() => {
    scheduledExpand = null;
    const el = document.activeElement;
    tryExpandTrigger(el);
  }, 0);
}

document.addEventListener("input", () => {
  scheduleTriggerExpansion();
}, true);

document.addEventListener("keyup", (e) => {
  if (e.key === "Tab") return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  scheduleTriggerExpansion();
}, true);

document.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const el = document.activeElement;
  if (!el) return;
  const expanded = tryExpandTrigger(el);
  if (!expanded) return;
  e.preventDefault();
}, true);

if (typeof chrome !== "undefined" && chrome.runtime) {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "INSERT_SNIPPET") {
      const el = document.activeElement;
      if (el) insertAtCursor(el, msg.body);
      sendResponse({ ok: true });
    }
  });
}
