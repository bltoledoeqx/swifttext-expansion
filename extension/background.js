// SnapText service worker
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["snippets"], (res) => {
    if (!res.snippets) {
      chrome.storage.local.set({
        snippets: [
          { id: "1", trigger: "/vm", title: "Restart VM", body: "Realizado restart da VM, serviço normalizado sem impacto adicional.", category: "Ops", uses: 142, updated: "há 2h", hue: "oklch(0.88 0.22 130)" },
          { id: "2", trigger: "/sla", title: "SLA padrão", body: "Conforme SLA acordado, prazo de atendimento de até 4 horas úteis.", category: "Suporte", uses: 89, updated: "ontem", hue: "oklch(0.78 0.14 210)" },
          { id: "3", trigger: "/ack", title: "Acknowledge", body: "Recebido. Iniciando análise, retorno em até 30 minutos com update.", category: "Resposta", uses: 76, updated: "ontem", hue: "oklch(0.78 0.16 320)" },
          { id: "4", trigger: "/sig", title: "Assinatura padrão", body: "Atenciosamente,\nEquipe de Operações N2", category: "Email", uses: 54, updated: "3 dias", hue: "oklch(0.80 0.14 60)" },
          { id: "5", trigger: "/inc", title: "Incidente template", body: "Incidente {{ticket}} aberto em {{date}}.\nSeveridade: {{sev}}\nResponsável: {{user}}", category: "Variável", uses: 41, updated: "1 sem", hue: "oklch(0.72 0.18 25)" },
          { id: "6", trigger: "/rca", title: "Root cause analysis", body: "Root cause: configuração incorreta.\nAção: rollback aplicado e validado em produção.", category: "Postmortem", uses: 23, updated: "2 sem", hue: "oklch(0.78 0.14 280)" },
        ],
      });
    }
  });
});
