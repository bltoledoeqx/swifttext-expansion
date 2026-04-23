// SnapText Dashboard
const DEFAULT_SNIPPETS = [
  { id: "1", trigger: "/vm", title: "Restart VM", body: "Realizado restart da VM, serviço normalizado sem impacto adicional.", category: "Ops", uses: 0, updated: "agora", hue: "oklch(0.88 0.22 130)" },
  { id: "2", trigger: "/sla", title: "SLA padrão", body: "Conforme SLA acordado, prazo de atendimento de até 4 horas úteis.", category: "Suporte", uses: 0, updated: "agora", hue: "oklch(0.78 0.14 210)" },
  { id: "3", trigger: "/ack", title: "Acknowledge", body: "Recebido. Iniciando análise, retorno em até 30 minutos com update.", category: "Resposta", uses: 0, updated: "agora", hue: "oklch(0.78 0.16 320)" },
  { id: "4", trigger: "/sig", title: "Assinatura padrão", body: "Atenciosamente,\nEquipe de Operações N2", category: "Email", uses: 0, updated: "agora", hue: "oklch(0.80 0.14 60)" },
  { id: "5", trigger: "/inc", title: "Incidente template", body: "Incidente {{ticket}} aberto em {{date}}.\nSeveridade: {{sev}}\nResponsável: {{user}}", category: "Variável", uses: 0, updated: "agora", hue: "oklch(0.72 0.18 25)" },
  { id: "6", trigger: "/rca", title: "Root cause analysis", body: "Root cause: configuração incorreta.\nAção: rollback aplicado e validado em produção.", category: "Postmortem", uses: 0, updated: "agora", hue: "oklch(0.78 0.14 280)" },
];

let snippets = [];
let selectedId = "1";
let activeFolder = "Todos";
let query = "";

const foldersList = document.getElementById("folders-list");
const snippetsList = document.getElementById("snippets-list");
const searchEl = document.getElementById("dash-search");

function load() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.local.get(["snippets"], (res) => {
      snippets = res.snippets && res.snippets.length ? res.snippets : DEFAULT_SNIPPETS;
      if (!res.snippets) chrome.storage.local.set({ snippets });
      renderAll();
    });
  } else {
    snippets = DEFAULT_SNIPPETS;
    renderAll();
  }
}

function save() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.local.set({ snippets });
  }
}

function renderAll() { renderFolders(); renderSnippets(); renderEditor(); }

function getFolders() {
  const counts = snippets.reduce((acc, s) => {
    const cat = s.category || "Geral";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  return [{ name: "Todos", count: snippets.length }].concat(
    Object.entries(counts).map(([name, count]) => ({ name, count }))
  );
}

function getFilteredSnippets() {
  const q = query.toLowerCase();
  return snippets.filter((s) => {
    const matchesFolder = activeFolder === "Todos" || (s.category || "Geral") === activeFolder;
    const matchesQuery = s.trigger.toLowerCase().includes(q) || s.title.toLowerCase().includes(q);
    return matchesFolder && matchesQuery;
  });
}

function renderFolders() {
  foldersList.innerHTML = "";
  const folders = getFolders();
  if (!folders.some((f) => f.name === activeFolder)) activeFolder = "Todos";
  folders.forEach((f) => {
    const btn = document.createElement("button");
    btn.className = "folder-btn" + (activeFolder === f.name ? " active" : "");
    btn.innerHTML = `
      <span class="folder-name">
        <svg class="folder-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        ${f.name}
      </span>
      <span class="folder-count">${f.count}</span>
    `;
    btn.addEventListener("click", () => {
      activeFolder = f.name;
      renderAll();
    });
    foldersList.appendChild(btn);
  });
}

function renderSnippets() {
  const filtered = getFilteredSnippets();
  if (filtered.length && !filtered.some((s) => s.id === selectedId)) {
    selectedId = filtered[0].id;
  }
  snippetsList.innerHTML = "";
  filtered.forEach((s) => {
    const btn = document.createElement("button");
    btn.className = "snip-card" + (selectedId === s.id ? " active" : "");
    btn.innerHTML = `
      <span class="snip-bar" style="background:${s.hue};${selectedId === s.id ? `box-shadow:0 0 10px ${s.hue};` : ""}"></span>
      <div class="snip-body">
        <div class="snip-row">
          <code class="snip-trigger"></code>
          <span class="snip-uses">${s.uses}×</span>
        </div>
        <div class="snip-title"></div>
        <div class="snip-prev"></div>
      </div>
    `;
    btn.querySelector(".snip-trigger").textContent = s.trigger;
    btn.querySelector(".snip-title").textContent = s.title;
    btn.querySelector(".snip-prev").textContent = s.body.split("\n")[0];
    btn.addEventListener("click", () => { selectedId = s.id; renderSnippets(); renderEditor(); });
    snippetsList.appendChild(btn);
  });
}

function renderEditor() {
  const s = snippets.find((x) => x.id === selectedId) || snippets[0];
  if (!s) return;
  document.getElementById("ed-breadcrumb-title").textContent = s.title;
  document.getElementById("ed-trigger").value = s.trigger;
  document.getElementById("ed-title").value = s.title;
  document.getElementById("ed-category-input").value = s.category || "Geral";
  document.getElementById("ed-body").value = s.body;
  document.getElementById("stat-cat").textContent = s.category || "Geral";
  document.getElementById("stat-uses").textContent = s.uses;
  document.getElementById("stat-updated").textContent = s.updated || "agora";
  document.getElementById("preview-body").textContent = s.body;

  const cat = document.getElementById("ed-category");
  cat.innerHTML = `<span class="pill-dot" style="background:${s.hue}"></span>${s.category || "Geral"}`;
  cat.style.borderColor = `color-mix(in oklab, ${s.hue} 35%, transparent)`;
  cat.style.background = `color-mix(in oklab, ${s.hue} 10%, transparent)`;
  cat.style.color = s.hue;

  updateMeta();
}

function updateMeta() {
  const body = document.getElementById("ed-body").value;
  document.getElementById("char-count").textContent = `${body.length} caracteres`;
  document.getElementById("words-saved").textContent = `~${Math.round(body.length / 5)} palavras economizadas / uso`;
  document.getElementById("preview-body").textContent = body;
}

document.getElementById("ed-body").addEventListener("input", updateMeta);

document.querySelectorAll(".var-btn").forEach((b) => {
  b.addEventListener("click", () => {
    const ta = document.getElementById("ed-body");
    const v = b.dataset.var;
    const start = ta.selectionStart;
    ta.value = ta.value.slice(0, start) + v + ta.value.slice(ta.selectionEnd);
    ta.focus();
    ta.selectionStart = ta.selectionEnd = start + v.length;
    updateMeta();
  });
});

searchEl.addEventListener("input", (e) => { query = e.target.value; renderSnippets(); });

document.getElementById("btn-save").addEventListener("click", () => {
  const idx = snippets.findIndex((x) => x.id === selectedId);
  if (idx >= 0) {
    let trigger = document.getElementById("ed-trigger").value.trim();
    snippets[idx] = {
      ...snippets[idx],
      trigger,
      title: document.getElementById("ed-title").value,
      category: document.getElementById("ed-category-input").value.trim() || "Geral",
      body: document.getElementById("ed-body").value,
      updated: "agora",
    };
    save();
    renderAll();
  }
});

document.getElementById("btn-delete").addEventListener("click", () => {
  if (!confirm("Excluir este snippet?")) return;
  snippets = snippets.filter((x) => x.id !== selectedId);
  selectedId = snippets[0]?.id || "";
  save();
  renderAll();
});

document.getElementById("btn-new").addEventListener("click", () => {
  const id = String(Date.now());
  const novo = {
    id, trigger: "/novo", title: "Novo snippet",
    body: "Texto que será expandido…",
    category: "Geral", uses: 0, updated: "agora",
    hue: "oklch(0.78 0.14 210)",
  };
  snippets.unshift(novo);
  selectedId = id;
  save();
  renderAll();
});

load();
