// SnapText popup
const DEFAULT_SNIPPETS = [
  { id: "1", trigger: "/vm", title: "Restart VM", body: "Realizado restart da VM, serviço normalizado sem impacto adicional.", category: "Ops", uses: 0, hue: "oklch(0.88 0.22 130)" },
  { id: "2", trigger: "/sla", title: "SLA padrão", body: "Conforme SLA acordado, prazo de atendimento de até 4 horas úteis.", category: "Suporte", uses: 0, hue: "oklch(0.78 0.14 210)" },
  { id: "3", trigger: "/ack", title: "Acknowledge", body: "Recebido. Iniciando análise, retorno em até 30 minutos com update.", category: "Resposta", uses: 0, hue: "oklch(0.78 0.16 320)" },
  { id: "4", trigger: "/sig", title: "Assinatura padrão", body: "Atenciosamente,\nEquipe de Operações N2", category: "Email", uses: 0, hue: "oklch(0.80 0.14 60)" },
  { id: "5", trigger: "/inc", title: "Incidente template", body: "Incidente {{ticket}} aberto em {{saudacao}}.\nSeveridade: \nResponsável: {{clientuser}}", category: "Variável", uses: 0, hue: "oklch(0.72 0.18 25)" },
  { id: "6", trigger: "/rca", title: "Root cause analysis", body: "Root cause: configuração incorreta.\nAção: rollback aplicado e validado em produção.", category: "Postmortem", uses: 0, hue: "oklch(0.78 0.14 280)" },
];

let snippets = [];
let activeIdx = 0;
let query = "";

const listEl = document.getElementById("snippet-list");
const searchEl = document.getElementById("search");
const countEl = document.getElementById("count");

function loadSnippets() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.local.get(["snippets"], (res) => {
      snippets = res.snippets && res.snippets.length ? res.snippets : DEFAULT_SNIPPETS;
      if (!res.snippets) chrome.storage.local.set({ snippets });
      render();
    });
  } else {
    snippets = DEFAULT_SNIPPETS;
    render();
  }
}

function filtered() {
  const q = query.toLowerCase();
  return snippets.filter(
    (s) => s.trigger.toLowerCase().includes(q) || s.title.toLowerCase().includes(q)
  );
}

function render() {
  const items = filtered();
  countEl.textContent = `${items.length} snippets`;
  listEl.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Nenhum snippet encontrado";
    listEl.appendChild(empty);
    return;
  }

  items.forEach((s, i) => {
    const btn = document.createElement("button");
    btn.className = "snippet-item" + (i === activeIdx ? " active" : "");
    btn.innerHTML = `
      <span class="snippet-bar" style="background:${s.hue};${i === activeIdx ? `box-shadow:0 0 12px ${s.hue};` : ""}"></span>
      <code class="snippet-trigger">${s.trigger}</code>
      <div class="snippet-info">
        <div class="snippet-title"></div>
        <div class="snippet-preview"></div>
      </div>
      <kbd class="snippet-enter">↵</kbd>
    `;
    btn.querySelector(".snippet-title").textContent = s.title;
    btn.querySelector(".snippet-preview").textContent = s.body.split("\n")[0];
    btn.addEventListener("mouseenter", () => {
      activeIdx = i;
      render();
    });
    btn.addEventListener("click", () => insertSnippet(s));
    listEl.appendChild(btn);
  });
}

function insertSnippet(s) {
  if (typeof chrome !== "undefined" && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, { type: "INSERT_SNIPPET", body: s.body, id: s.id, trigger: s.trigger }, () => {
        window.close();
      });
    });
  }
}

searchEl.addEventListener("input", (e) => {
  query = e.target.value;
  activeIdx = 0;
  render();
});

document.addEventListener("keydown", (e) => {
  const items = filtered();
  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIdx = Math.min(activeIdx + 1, items.length - 1);
    render();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIdx = Math.max(activeIdx - 1, 0);
    render();
  } else if (e.key === "Enter" || e.key === "Tab") {
    e.preventDefault();
    if (items[activeIdx]) insertSnippet(items[activeIdx]);
  }
});

document.getElementById("open-dashboard").addEventListener("click", () => {
  if (typeof chrome !== "undefined" && chrome.runtime) {
    chrome.runtime.openOptionsPage();
  }
});
document.getElementById("btn-settings").addEventListener("click", () => {
  if (typeof chrome !== "undefined" && chrome.runtime) chrome.runtime.openOptionsPage();
});
document.getElementById("btn-add").addEventListener("click", () => {
  if (typeof chrome !== "undefined" && chrome.runtime) chrome.runtime.openOptionsPage();
});

searchEl.focus();
loadSnippets();
