// SnapText popup
const DEFAULT_SNIPPETS = [];

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
