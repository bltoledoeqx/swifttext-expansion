// SnapText Dashboard
const DEFAULT_SNIPPETS = [
  { id: "1", trigger: "/vm", title: "Restart VM", body: "Realizado restart da VM, serviço normalizado sem impacto adicional.", category: "Ops", uses: 0, updated: "agora", hue: "oklch(0.88 0.22 130)" },
  { id: "2", trigger: "/sla", title: "SLA padrão", body: "Conforme SLA acordado, prazo de atendimento de até 4 horas úteis.", category: "Suporte", uses: 0, updated: "agora", hue: "oklch(0.78 0.14 210)" },
  { id: "3", trigger: "/ack", title: "Acknowledge", body: "Recebido. Iniciando análise, retorno em até 30 minutos com update.", category: "Resposta", uses: 0, updated: "agora", hue: "oklch(0.78 0.16 320)" },
  { id: "4", trigger: "/sig", title: "Assinatura padrão", body: "Atenciosamente,\nEquipe de Operações N2", category: "Email", uses: 0, updated: "agora", hue: "oklch(0.80 0.14 60)" },
  { id: "5", trigger: "/inc", title: "Incidente template", body: "Incidente {{ticket}} aberto em {{saudacao}}.\nSeveridade: \nResponsável: {{clientuser}}", category: "Variável", uses: 0, updated: "agora", hue: "oklch(0.72 0.18 25)" },
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
  renderPreview(s.body);

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
  renderPreview(body);
}

function renderPreview(raw) {
  // Replace [code][/code] wrappers (ServiceNow HTML) — just strip the tags for preview
  let html = raw.replace(/\[code\]/gi, "").replace(/\[\/code\]/gi, "");
  // Sample variable substitution for preview
  const hour = new Date().getHours();
  const saudacao = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  html = html
    .replace(/\{\{saudacao\}\}/gi, `<em style="color:var(--primary)">${saudacao}</em>`)
    .replace(/\{\{date\}\}/gi, `<em style="color:var(--primary)">${saudacao}</em>`)
    .replace(/\{\{datetime\}\}/gi, `<em style="color:var(--primary)">${new Date().toLocaleString("pt-BR")}</em>`)
    .replace(/\{\{ticket\}\}/gi, '<em style="color:var(--primary)">INC0012345</em>')
    .replace(/\{\{clientuser\}\}/gi, '<em style="color:var(--primary)">João Silva</em>')
    .replace(/\{\{user\}\}/gi, '<em style="color:var(--primary)">João Silva</em>');
  // Convert newlines to <br> for plain text parts
  html = html.replace(/\n/g, "<br>");
  document.getElementById("preview-body").innerHTML = html;
}

document.getElementById("ed-body").addEventListener("input", updateMeta);

document.querySelectorAll(".var-btn").forEach((b) => {
  b.addEventListener("click", () => {
    insertAtCursorInTextarea(document.getElementById("ed-body"), b.dataset.var);
  });
});

// ── Formatting toolbar ────────────────────────────────────
function wrapSelection(ta, open, close) {
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const sel = ta.value.slice(start, end);
  const replacement = open + sel + close;
  ta.value = ta.value.slice(0, start) + replacement + ta.value.slice(end);
  ta.focus();
  ta.selectionStart = start + open.length;
  ta.selectionEnd = start + open.length + sel.length;
  updateMeta();
}

function insertAtCursorInTextarea(ta, text) {
  const start = ta.selectionStart;
  ta.value = ta.value.slice(0, start) + text + ta.value.slice(ta.selectionEnd);
  ta.focus();
  ta.selectionStart = ta.selectionEnd = start + text.length;
  updateMeta();
}

document.querySelectorAll(".fmt-btn[data-fmt]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const ta = document.getElementById("ed-body");
    const fmt = btn.dataset.fmt;
    const fmtMap = {
      bold:      ["<b>", "</b>"],
      italic:    ["<i>", "</i>"],
      underline: ["<u>", "</u>"],
      strike:    ["<s>", "</s>"],
      h1:        ["<h1>", "</h1>"],
      h2:        ["<h2>", "</h2>"],
      ul:        ["<ul>\n  <li>", "</li>\n</ul>"],
      ol:        ["<ol>\n  <li>", "</li>\n</ol>"],
      codetag:   ["[code]\n", "\n[/code]"],
    };
    if (fmtMap[fmt]) {
      wrapSelection(ta, fmtMap[fmt][0], fmtMap[fmt][1]);
    }
  });
});

// Color picker
document.getElementById("fmt-color").addEventListener("input", (e) => {
  const ta = document.getElementById("ed-body");
  const color = e.target.value;
  wrapSelection(ta, `<span style="color:${color}">`, "</span>");
});
document.querySelector(".fmt-color-wrap").addEventListener("click", () => {
  document.getElementById("fmt-color").click();
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

document.getElementById("btn-copy").addEventListener("click", () => {
  const s = snippets.find((x) => x.id === selectedId);
  if (!s) return;
  navigator.clipboard.writeText(s.body).then(() => {
    const btn = document.getElementById("btn-copy");
    const orig = btn.innerHTML;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    btn.style.color = "oklch(0.75 0.18 145)";
    setTimeout(() => { btn.innerHTML = orig; btn.style.color = ""; }, 1500);
  });
});

load();

// ── Import / Export ────────────────────────────────────

function showToast(msg, type = "success") {
  const t = document.getElementById("io-toast");
  t.textContent = msg;
  t.className = "io-toast " + type;
  t.style.display = "block";
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.display = "none"; }, 4000);
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Exportar JSON (backup nativo) ──
document.getElementById("btn-export-json").addEventListener("click", () => {
  const data = JSON.stringify({ version: 1, exported: new Date().toISOString(), snippets }, null, 2);
  const date = new Date().toISOString().slice(0, 10);
  downloadFile(`snaptext-backup-${date}.json`, data, "application/json");
  showToast(`✓ ${snippets.length} snippets exportados como JSON`);
});

// ── Exportar CSV (compatível Text Blaze / PhraseExpress import) ──
document.getElementById("btn-export-csv").addEventListener("click", () => {
  const header = ["trigger", "title", "body", "category"];
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = snippets.map((s) => [s.trigger, s.title, s.body, s.category || "Geral"].map(escape).join(","));
  const csv = [header.join(","), ...rows].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  downloadFile(`snaptext-${date}.csv`, csv, "text/csv");
  showToast(`✓ ${snippets.length} snippets exportados como CSV`);
});

// ── Importar (JSON / CSV / XML PhraseExpress) ──
document.getElementById("btn-import").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  e.target.value = ""; // reset so same file can be re-imported
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const text = ev.target.result;
      const ext = file.name.split(".").pop().toLowerCase();
      let imported = [];

      if (ext === "json") {
        imported = parseImportJSON(text);
      } else if (ext === "csv") {
        imported = parseImportCSV(text);
      } else if (ext === "xml") {
        imported = parseImportXML(text);
      } else {
        showToast("Formato não suportado. Use JSON, CSV ou XML.", "error");
        return;
      }

      if (!imported.length) {
        showToast("Nenhum snippet encontrado no arquivo.", "error");
        return;
      }

      // Merge: skip triggers that already exist, add new ones
      const existingTriggers = new Set(snippets.map((s) => s.trigger));
      const hues = ["oklch(0.88 0.22 130)", "oklch(0.78 0.14 210)", "oklch(0.78 0.16 320)", "oklch(0.80 0.14 60)", "oklch(0.72 0.18 25)", "oklch(0.78 0.14 280)"];
      let added = 0;
      imported.forEach((s, i) => {
        if (existingTriggers.has(s.trigger)) return;
        snippets.push({
          id: String(Date.now() + i),
          trigger: s.trigger,
          title: s.title || s.trigger,
          body: s.body,
          category: s.category || "Importado",
          uses: 0,
          updated: "agora",
          hue: hues[i % hues.length],
        });
        added++;
      });

      save();
      renderAll();
      showToast(`✓ ${added} snippets importados (${imported.length - added} duplicatas ignoradas)`);
    } catch (err) {
      showToast("Erro ao ler arquivo: " + err.message, "error");
    }
  };
  reader.readAsText(file, "utf-8");
});

function parseImportJSON(text) {
  const data = JSON.parse(text);
  // Formato nativo SnapText
  if (data.snippets && Array.isArray(data.snippets)) return data.snippets;
  // Array direto
  if (Array.isArray(data)) return data;
  throw new Error("JSON inválido ou formato desconhecido");
}

function parseImportCSV(text) {
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  if (lines.length < 2) return [];

  const parseRow = (line) => {
    const cols = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"' && !inQ) { inQ = true; continue; }
      if (c === '"' && inQ) {
        if (line[i + 1] === '"') { cur += '"'; i++; } else { inQ = false; }
        continue;
      }
      if (c === ',' && !inQ) { cols.push(cur); cur = ""; continue; }
      cur += c;
    }
    cols.push(cur);
    return cols;
  };

  const header = parseRow(lines[0]).map((h) => h.toLowerCase().trim());
  // Detecta colunas — suporta Text Blaze (shortcut/snippet) e formato nativo
  const col = (names) => { for (const n of names) { const i = header.indexOf(n); if (i >= 0) return i; } return -1; };
  const iT = col(["trigger", "shortcut", "abbreviation", "keyword"]);
  const iB = col(["body", "snippet", "text", "content", "phrase"]);
  const iTi = col(["title", "name", "description", "label"]);
  const iC = col(["category", "folder", "group", "tag"]);

  if (iT < 0 || iB < 0) throw new Error("CSV sem colunas 'trigger'/'shortcut' e 'body'/'snippet'");

  return lines.slice(1).map((line) => {
    const cols = parseRow(line);
    return {
      trigger: cols[iT]?.trim() || "",
      body: cols[iB]?.trim() || "",
      title: iTi >= 0 ? (cols[iTi]?.trim() || "") : "",
      category: iC >= 0 ? (cols[iC]?.trim() || "Importado") : "Importado",
    };
  }).filter((s) => s.trigger && s.body);
}

function parseImportXML(text) {
  // PhraseExpress XML format
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/xml");
  const results = [];

  // PhraseExpress uses <phrase> elements with <keyword> and <phrase_text>/<phrasebody>
  const phrases = doc.querySelectorAll("phrase");
  phrases.forEach((p) => {
    const keyword = p.querySelector("keyword")?.textContent?.trim() || "";
    const body = (p.querySelector("phrase_text") || p.querySelector("phrasebody"))?.textContent?.trim() || "";
    const title = p.querySelector("description")?.textContent?.trim() || keyword;
    const category = p.closest("phrasegroup")?.querySelector(":scope > description")?.textContent?.trim() || "Importado";
    if (keyword && body) results.push({ trigger: keyword, body, title, category });
  });

  // Fallback: generic XML with <snippet>/<item> elements
  if (!results.length) {
    doc.querySelectorAll("snippet, item").forEach((el) => {
      const trigger = (el.getAttribute("trigger") || el.querySelector("trigger,shortcut")?.textContent || "").trim();
      const body = (el.getAttribute("body") || el.querySelector("body,text,content")?.textContent || "").trim();
      const title = (el.getAttribute("title") || el.querySelector("title,name")?.textContent || trigger).trim();
      if (trigger && body) results.push({ trigger, body, title, category: "Importado" });
    });
  }

  return results;
}
