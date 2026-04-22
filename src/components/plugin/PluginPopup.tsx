import { useState } from "react";
import { Search, Plus, Zap, Settings, Folder, Command, ArrowUpRight } from "lucide-react";

type Snippet = {
  trigger: string;
  title: string;
  preview: string;
  category: string;
  uses: number;
};

const SNIPPETS: Snippet[] = [
  { trigger: "/vm", title: "Restart VM", preview: "Realizado restart da VM, serviço normalizado…", category: "Ops", uses: 142 },
  { trigger: "/sla", title: "SLA padrão", preview: "Conforme SLA acordado, prazo de até 4 horas úteis.", category: "Suporte", uses: 89 },
  { trigger: "/ack", title: "Acknowledge", preview: "Recebido. Iniciando análise, retorno em 30min.", category: "Resposta", uses: 76 },
  { trigger: "/sig", title: "Assinatura", preview: "Atenciosamente, Equipe de Operações N2", category: "Email", uses: 54 },
  { trigger: "/inc", title: "Incidente", preview: "Incidente {{ticket}} aberto em {{date}}…", category: "Variável", uses: 41 },
  { trigger: "/rca", title: "Root cause", preview: "Root cause: configuração incorreta. Rollback…", category: "Postmortem", uses: 23 },
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
    <div className="w-[380px] h-[540px] rounded-2xl border border-border bg-surface shadow-elevated overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-elevated">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Zap className="w-3 h-3 text-primary-foreground" fill="currentColor" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-sm">SnapText</span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground">
            ON
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            placeholder="Buscar snippet ou /atalho…"
            className="w-full h-9 pl-9 pr-16 rounded-lg bg-background border border-border text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 font-mono"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono rounded bg-muted border border-border text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          {filtered.length} snippets
        </div>
        <div className="space-y-0.5">
          {filtered.map((s, i) => (
            <button
              key={s.trigger}
              onMouseEnter={() => setActiveIdx(i)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors group flex items-center gap-3 ${
                activeIdx === i ? "bg-accent" : "hover:bg-accent/50"
              }`}
            >
              <code
                className={`shrink-0 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium border transition-colors ${
                  activeIdx === i
                    ? "bg-primary/15 border-primary/30 text-primary"
                    : "bg-background border-border text-muted-foreground"
                }`}
              >
                {s.trigger}
              </code>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {s.title}
                </div>
                <div className="text-xs text-muted-foreground truncate font-mono">
                  {s.preview}
                </div>
              </div>
              {activeIdx === i && (
                <kbd className="shrink-0 px-1.5 py-0.5 text-[9px] font-mono rounded bg-background border border-border text-muted-foreground">
                  ↵
                </kbd>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-xs text-muted-foreground">
              Nenhum snippet encontrado
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-border bg-surface-elevated flex items-center justify-between text-[10px] font-mono text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-background border border-border">↑↓</kbd>
            navegar
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-background border border-border">Tab</kbd>
            inserir
          </span>
        </div>
        <button className="flex items-center gap-1 hover:text-foreground transition-colors">
          Dashboard <ArrowUpRight className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
}
