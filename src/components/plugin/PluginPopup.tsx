import { useState } from "react";
import { Search, Plus, Zap, Settings, ArrowUpRight, Sparkles } from "lucide-react";

type Snippet = {
  trigger: string;
  title: string;
  preview: string;
  category: string;
  uses: number;
  hue: string;
};

const SNIPPETS: Snippet[] = [
  { trigger: "/vm", title: "Restart VM", preview: "Realizado restart da VM, serviço normalizado…", category: "Ops", uses: 142, hue: "var(--primary)" },
  { trigger: "/sla", title: "SLA padrão", preview: "Conforme SLA acordado, prazo de até 4 horas úteis.", category: "Suporte", uses: 89, hue: "var(--cyan)" },
  { trigger: "/ack", title: "Acknowledge", preview: "Recebido. Iniciando análise, retorno em 30min.", category: "Resposta", uses: 76, hue: "oklch(0.78 0.16 320)" },
  { trigger: "/sig", title: "Assinatura", preview: "Atenciosamente, Equipe de Operações N2", category: "Email", uses: 54, hue: "oklch(0.80 0.14 60)" },
  { trigger: "/inc", title: "Incidente", preview: "Incidente {{ticket}} aberto em {{date}}…", category: "Variável", uses: 41, hue: "oklch(0.72 0.18 25)" },
  { trigger: "/rca", title: "Root cause", preview: "Root cause: configuração incorreta. Rollback…", category: "Postmortem", uses: 23, hue: "oklch(0.78 0.14 280)" },
];

export function PluginPopup() {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const filtered = SNIPPETS.filter(
    (s) =>
      s.trigger.toLowerCase().includes(query.toLowerCase()) ||
      s.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="relative">
      {/* outer glow */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[2rem] opacity-60 blur-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--primary) 30%, transparent), transparent 70%)",
        }}
      />

      <div
        className="relative w-[380px] h-[540px] rounded-[1.75rem] overflow-hidden flex flex-col surface-premium ring-hairline"
        style={{
          backgroundImage:
            "radial-gradient(120% 60% at 50% -10%, color-mix(in oklab, var(--primary) 8%, transparent), transparent 60%), var(--gradient-card)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 backdrop-blur-md bg-surface-elevated/60">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow), var(--shadow-inset-hi)" }}
              >
                <Zap className="w-3.5 h-3.5 text-primary-foreground" fill="currentColor" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-semibold text-sm tracking-tight">SnapText</span>
              <span className="text-[9px] font-mono text-muted-foreground mt-0.5">v2.1 · pro</span>
            </div>
            <span className="ml-1 inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary">
              <span className="w-1 h-1 rounded-full bg-primary glow-dot" />
              ON
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-3">
          <div className="relative group">
            <div
              aria-hidden
              className="absolute -inset-px rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"
              style={{ background: "var(--gradient-primary)", filter: "blur(8px)" }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground z-10" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIdx(0);
              }}
              placeholder="Buscar snippet ou /atalho…"
              className="relative w-full h-10 pl-9 pr-16 rounded-xl bg-background/80 border border-border text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 font-mono"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono rounded-md bg-muted border border-border text-muted-foreground z-10">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <div className="px-2 py-1.5 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {filtered.length} snippets
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
              <Sparkles className="w-2.5 h-2.5 text-primary" />
              sugeridos
            </span>
          </div>
          <div className="space-y-1">
            {filtered.map((s, i) => (
              <button
                key={s.trigger}
                onMouseEnter={() => setActiveIdx(i)}
                className={`w-full text-left px-2.5 py-2.5 rounded-xl transition-all duration-150 group flex items-center gap-3 border ${
                  activeIdx === i
                    ? "bg-accent/80 border-border/80 shadow-[0_4px_16px_-8px_oklch(0_0_0/0.5)]"
                    : "border-transparent hover:bg-accent/40"
                }`}
              >
                <span
                  className="shrink-0 w-1 h-8 rounded-full transition-opacity"
                  style={{
                    background: s.hue,
                    boxShadow: activeIdx === i ? `0 0 12px ${s.hue}` : "none",
                    opacity: activeIdx === i ? 1 : 0.5,
                  }}
                />
                <code
                  className={`shrink-0 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold border transition-colors ${
                    activeIdx === i
                      ? "bg-primary/15 border-primary/30 text-primary"
                      : "bg-background/80 border-border text-muted-foreground"
                  }`}
                >
                  {s.trigger}
                </code>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate tracking-tight">
                    {s.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate font-mono mt-0.5">
                    {s.preview}
                  </div>
                </div>
                {activeIdx === i && (
                  <kbd className="shrink-0 px-1.5 py-0.5 text-[9px] font-mono rounded-md bg-background border border-border text-muted-foreground">
                    ↵
                  </kbd>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-10 text-center text-xs text-muted-foreground">
                Nenhum snippet encontrado
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-2.5 border-t border-border/60 backdrop-blur-md bg-surface-elevated/60 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-md bg-background border border-border">↑↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-md bg-background border border-border">Tab</kbd>
              inserir
            </span>
          </div>
          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
            Dashboard <ArrowUpRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
