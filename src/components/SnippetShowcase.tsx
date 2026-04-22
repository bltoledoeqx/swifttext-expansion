const snippets = [
  { trigger: "/vm", expand: "Realizado restart da VM, serviço normalizado sem impacto adicional.", tag: "Ops" },
  { trigger: "/sla", expand: "Conforme SLA acordado, prazo de atendimento de até 4 horas úteis.", tag: "Suporte" },
  { trigger: "/ack", expand: "Recebido. Iniciando análise, retorno em até 30 minutos com update.", tag: "Resposta" },
  { trigger: "/sig", expand: "Atenciosamente,\nEquipe de Operações N2", tag: "Assinatura" },
  { trigger: "/inc", expand: "Incidente {{ticket}} aberto em {{date}}. Severidade {{sev}}.", tag: "Variável" },
  { trigger: "/rca", expand: "Root cause: configuração incorreta. Ação: rollback aplicado e validado em produção.", tag: "Postmortem" },
];

export function SnippetShowcase() {
  return (
    <section id="snippets" className="py-24 border-t border-border/50">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono text-primary uppercase tracking-wider">
            // your library
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
            Snippets que trabalham
            <br />
            por você.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Comece com nossos templates ou crie do zero. Importe, exporte e compartilhe com seu time.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-soft">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-surface-elevated text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <div className="col-span-2">Trigger</div>
            <div className="col-span-8">Expansão</div>
            <div className="col-span-2 text-right">Categoria</div>
          </div>
          <div className="divide-y divide-border">
            {snippets.map((s) => (
              <div
                key={s.trigger}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-surface-elevated transition-colors group"
              >
                <div className="col-span-2">
                  <code className="inline-block px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary font-mono text-xs">
                    {s.trigger}
                  </code>
                </div>
                <div className="col-span-8 text-sm text-foreground/90 font-mono truncate">
                  {s.expand}
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                    {s.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
