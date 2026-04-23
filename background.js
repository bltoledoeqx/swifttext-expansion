// SnapText service worker
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["snippets"], (res) => {
    if (!res.snippets) {
      chrome.storage.local.set({
        snippets: [
          { id: "1", trigger: "/vm", title: "Restart VM", body: "Realizado restart da VM, serviço normalizado sem impacto adicional.", category: "Ops", uses: 0, updated: "agora", hue: "oklch(0.88 0.22 130)" },
          { id: "2", trigger: "/sla", title: "SLA padrão", body: "Conforme SLA acordado, prazo de atendimento de até 4 horas úteis.", category: "Suporte", uses: 0, updated: "agora", hue: "oklch(0.78 0.14 210)" },
          { id: "3", trigger: "/ack", title: "Acknowledge", body: "Recebido. Iniciando análise, retorno em até 30 minutos com update.", category: "Resposta", uses: 0, updated: "agora", hue: "oklch(0.78 0.16 320)" },
          { id: "4", trigger: "/sig", title: "Assinatura padrão", body: "Atenciosamente,\nEquipe de Operações N2", category: "Email", uses: 0, updated: "agora", hue: "oklch(0.80 0.14 60)" },
          { id: "5", trigger: "/inc", title: "Incidente template", body: "Incidente {{ticket}} aberto em {{date}}.\nSeveridade: {{sev}}\nResponsável: {{user}}", category: "Variável", uses: 0, updated: "agora", hue: "oklch(0.72 0.18 25)" },
          { id: "6", trigger: "/rca", title: "Root cause analysis", body: "Root cause: configuração incorreta.\nAção: rollback aplicado e validado em produção.", category: "Postmortem", uses: 0, updated: "agora", hue: "oklch(0.78 0.14 280)" },
        ],
      });
    }
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
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
