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
      if (res.snippets && res.snippets.length) snippetsCache = res.snippets;
    });
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.snippets) snippetsCache = changes.snippets.newValue || DEFAULT_SNIPPETS;
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

document.addEventListener("keydown", (e) => {
  if (e.key !== "Tab" && e.key !== " ") return;
  const el = document.activeElement;
  if (!el) return;
  let textBefore = "";
  if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
    textBefore = (el.value || "").slice(0, el.selectionStart);
  } else if (el.isContentEditable) {
    const sel = window.getSelection();
    if (sel.rangeCount) {
      const r = sel.getRangeAt(0);
      textBefore = (r.endContainer.textContent || "").slice(0, r.endOffset);
    }
  } else return;

  const match = textBefore.match(/(\/[a-zA-Z0-9_-]+)$/);
  if (!match) return;
  const trig = match[1];
  const found = snippetsCache.find((s) => s.trigger === trig);
  if (!found) return;
  e.preventDefault();
  replaceTriggerAt(el, trig.length, found.body);
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
