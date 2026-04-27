// SnapText service worker
const DEFAULT_SNIPPETS_BG = [];

function buildContextMenus(snippets) {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "snaptext-root",
      title: "SnapText — Inserir snippet",
      contexts: ["editable"],
    });
    snippets.forEach((s) => {
      chrome.contextMenus.create({
        id: `snaptext-snippet-${s.id}`,
        parentId: "snaptext-root",
        title: `${s.trigger}  —  ${s.title}`,
        contexts: ["editable"],
      });
    });
    chrome.contextMenus.create({
      id: "snaptext-separator",
      parentId: "snaptext-root",
      type: "separator",
      contexts: ["editable"],
    });
    chrome.contextMenus.create({
      id: "snaptext-dashboard",
      parentId: "snaptext-root",
      title: "⚙ Gerenciar snippets…",
      contexts: ["editable"],
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["snippets"], (res) => {
    const snippets = res.snippets && res.snippets.length ? res.snippets : DEFAULT_SNIPPETS_BG;
    if (!res.snippets) chrome.storage.local.set({ snippets });
    buildContextMenus(snippets);
  });
});

// Rebuild menus whenever snippets change
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.snippets) {
    buildContextMenus(changes.snippets.newValue || []);
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "snaptext-dashboard") {
    chrome.runtime.openOptionsPage();
    return;
  }
  if (!String(info.menuItemId).startsWith("snaptext-snippet-")) return;

  const snippetId = String(info.menuItemId).replace("snaptext-snippet-", "");
  chrome.storage.local.get(["snippets"], (res) => {
    const snippets = res.snippets || DEFAULT_SNIPPETS_BG;
    const s = snippets.find((x) => x.id === snippetId);
    if (!s || !tab) return;

    // Track use via unified handler
    chrome.runtime.sendMessage({ type: "TRACK_USE", id: s.id, trigger: s.trigger });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: "MAIN",
      args: [s.body],
      func: (text) => {
        const el = document.activeElement;
        if (!el) return;
        // Standard editable elements
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          const start = el.selectionStart;
          el.value = el.value.slice(0, start) + text + el.value.slice(el.selectionEnd);
          el.selectionStart = el.selectionEnd = start + text.length;
          el.dispatchEvent(new Event("input", { bubbles: true }));
          return;
        }
        // contenteditable
        if (el.isContentEditable) {
          document.execCommand("insertText", false, text);
        }
      },
    });
  });
});



chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // ── Track snippet usage (fired from any context: content, popup, context menu) ──
  if (msg.type === "TRACK_USE") {
    chrome.storage.local.get(["snippets"], (res) => {
      const snippets = res.snippets || [];
      const idx = snippets.findIndex((s) => s.id === msg.id || s.trigger === msg.trigger);
      if (idx >= 0) {
        snippets[idx].uses = (snippets[idx].uses || 0) + 1;
        snippets[idx].updated = new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
        chrome.storage.local.set({ snippets });
      }
    });
    sendResponse({ ok: true });
    return;
  }

  if (msg.type !== "FETCH_SN_CASE_CONTEXT") return;

  const tabId = sender.tab?.id;
  const frameId = sender.frameId;
  if (typeof tabId !== "number") {
    sendResponse({ ok: false });
    return;
  }

  chrome.scripting.executeScript(
    {
      target: { tabId, frameIds: typeof frameId === "number" ? [frameId] : undefined },
      world: "MAIN",
      args: [msg.sysId],
      func: async (sysId) => {
        try {
          if (!window.g_ck || !sysId) return null;
          const headers = {
            Accept: "application/json",
            "X-UserToken": window.g_ck,
          };
          const r = await fetch(
            `/api/now/table/sn_customerservice_case/${sysId}?sysparm_display_value=all&sysparm_fields=u_order_number,contact`,
            { headers }
          );
          if (!r.ok) return null;
          const payload = await r.json();
          const result = payload?.result || {};
          const rawTicket = result.u_order_number;
          const ticket = typeof rawTicket === "object"
            ? (rawTicket.display_value || rawTicket.value || "")
            : (rawTicket || "");
          const rawUser = result.contact;
          const user = typeof rawUser === "object"
            ? (rawUser.display_value || rawUser.value || "")
            : (rawUser || "");
          return { ticket, user };
        } catch {
          return null;
        }
      },
    },
    (results) => {
      const ctx = results?.[0]?.result || null;
      sendResponse({ ok: true, context: ctx });
    }
  );

  return true;
});
