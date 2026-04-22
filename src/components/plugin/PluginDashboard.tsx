import { useState } from "react";
import {
  Search, Plus, Zap, Settings, Folder, Tag, BarChart3,
  Command, Trash2, Copy, Save, Variable, Hash, Calendar, User,
  ChevronRight, MoreHorizontal, Sparkles,
} from "lucide-react";

type Snippet = {
  id: string;
  trigger: string;
  title: string;
  body: string;
  category: string;
  uses: number;
  updated: string;
  hue: string;
};

const SNIPPETS: Snippet[] = [
  { id: "1", trigger: "/vm", title: "Restart VM", body: "Realizado restart da VM, serviço normalizado sem impacto adicional.", category: "Ops", uses: 142, updated: "há 2h", hue: "var(--primary)" },
  { id: "2", trigger: "/sla", title: "SLA padrão", body: "Conforme SLA acordado, prazo de atendimento de até 4 horas úteis.", category: "Suporte", uses: 89, updated: "ontem", hue: "var(--cyan)" },
  { id: "3", trigger: "/ack", title: "Acknowledge", body: "Recebido. Iniciando análise, retorno em até 30 minutos com update.", category: "Resposta", uses: 76, updated: "ontem", hue: "oklch(0.78 0.16 320)" },
  { id: "4", trigger: "/sig", title: "Assinatura padrão", body: "Atenciosamente,\nEquipe de Operações N2", category: "Email", uses: 54, updated: "3 dias", hue: "oklch(0.80 0.14 60)" },
  { id: "5", trigger: "/inc", title: "Incidente template", body: "Incidente {{ticket}} aberto em {{date}}.\nSeveridade: {{sev}}\nResponsável: {{user}}", category: "Variável", uses: 41, updated: "1 sem", hue: "oklch(0.72 0.18 25)" },
  { id: "6", trigger: "/rca", title: "Root cause analysis", body: "Root cause: configuração incorreta.\nAção: rollback aplicado e validado em produção.", category: "Postmortem", uses: 23, updated: "2 sem", hue: "oklch(0.78 0.14 280)" },
];

const FOLDERS = [
  { name: "Todos", count: 24, icon: Folder },
  { name: "Ops", count: 8, icon: Tag },
  { name: "Suporte", count: 6, icon: Tag },
  { name: "Email", count: 5, icon: Tag },
  { name: "Postmortem", count: 3, icon: Tag },
  { name: "Variáveis", count: 2, icon: Variable },
];

export function PluginDashboard() {
  const [selectedId, setSelectedId] = useState("1");
  const [activeFolder, setActiveFolder] = useState("Todos");
  const selected = SNIPPETS.find((s) => s.id === selectedId)!;

  return (
    <div className="relative">
      {/* ambient glow */}
      <div
        aria-hidden
        className="absolute -inset-10 rounded-[3rem] opacity-50 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 40% at 20% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%), radial-gradient(40% 40% at 80% 100%, color-mix(in oklab, var(--cyan) 18%, transparent), transparent 70%)",
        }}
      />

      <div
        className="relative w-full h-[680px] rounded-[1.75rem] overflow-hidden flex surface-premium ring-hairline"
        style={{
          backgroundImage:
            "radial-gradient(80% 50% at 0% 0%, color-mix(in oklab, var(--primary) 6%, transparent), transparent 60%), var(--gradient-card)",
        }}
      >
        {/* Sidebar */}
        <aside className="w-60 border-r border-border/60 bg-surface-elevated/40 backdrop-blur-md flex flex-col">
          <div className="px-4 py-4 border-b border-border/60 flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow), var(--shadow-inset-hi)" }}
            >
              <Zap className="w-3.5 h-3.5 text-primary-foreground" fill="currentColor" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-semibold text-sm tracking-tight">SnapText</span>
              <span className="text-[9px] font-mono text-muted-foreground mt-0.5">v2.1 · pro</span>
            </div>
          </div>

          <div className="p-2.5">
            <button
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: "var(--gradient-primary)",
                boxShadow: "var(--shadow-glow), var(--shadow-inset-hi)",
              }}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.8} />
              Novo snippet
              <kbd className="ml-1 px-1 py-0.5 rounded text-[9px] font-mono bg-black/20 text-primary-foreground/80">⌘N</kbd>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 pb-2">
            <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Coleções
            </div>
            {FOLDERS.map((f) => (
              <button
                key={f.name}
                onClick={() => setActiveFolder(f.name)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all ${
                  activeFolder === f.name
                    ? "bg-accent/80 text-foreground shadow-[inset_0_1px_0_0_color-mix(in_oklab,white_6%,transparent)]"
                    : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <f.icon className={`w-3.5 h-3.5 ${activeFolder === f.name ? "text-primary" : ""}`} />
                  {f.name}
                </span>
                <span className="text-[10px] font-mono opacity-60 px-1.5 py-0.5 rounded bg-background/60">
                  {f.count}
                </span>
              </button>
            ))}

            <div className="mt-4 mx-2 p-3 rounded-xl border border-primary/20 bg-primary/5 relative overflow-hidden">
              <div
                aria-hidden
                className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl"
                style={{ background: "color-mix(in oklab, var(--primary) 40%, transparent)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-primary">
                  <Sparkles className="w-2.5 h-2.5" /> AI Suggest
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                  3 novos atalhos sugeridos com base no seu uso.
                </p>
                <button className="mt-2 text-[10px] font-mono text-primary hover:underline">
                  Revisar →
                </button>
              </div>
            </div>
          </nav>

          <div className="border-t border-border/60 p-2 space-y-0.5">
            <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors">
              <BarChart3 className="w-3.5 h-3.5" /> Estatísticas
            </button>
            <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors">
              <Settings className="w-3.5 h-3.5" /> Configurações
            </button>
            <div className="mt-2 px-2.5 py-2 flex items-center gap-2 rounded-lg bg-background/40">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                LP
              </div>
              <div className="flex-1 min-w-0 leading-tight">
                <div className="text-xs font-medium truncate">Lucas P.</div>
                <div className="text-[9px] font-mono text-muted-foreground">Pro plan</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Snippet list */}
        <div className="w-72 border-r border-border/60 flex flex-col bg-background/20">
          <div className="px-3 py-3 border-b border-border/60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                placeholder="Buscar snippets…"
                className="w-full h-9 pl-9 pr-12 rounded-xl bg-background/80 border border-border text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 font-mono"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono rounded-md bg-muted border border-border text-muted-foreground">
                /
              </kbd>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {SNIPPETS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`w-full text-left p-3 rounded-xl transition-all border flex gap-3 ${
                  selectedId === s.id
                    ? "bg-surface border-border/80 shadow-[0_8px_24px_-12px_oklch(0_0_0/0.6)]"
                    : "border-transparent hover:bg-surface/40"
                }`}
              >
                <span
                  className="shrink-0 w-1 rounded-full self-stretch transition-all"
                  style={{
                    background: s.hue,
                    boxShadow: selectedId === s.id ? `0 0 10px ${s.hue}` : "none",
                    opacity: selectedId === s.id ? 1 : 0.4,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <code
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${
                        selectedId === s.id
                          ? "bg-primary/15 border-primary/30 text-primary"
                          : "bg-background border-border text-muted-foreground"
                      }`}
                    >
                      {s.trigger}
                    </code>
                    <span className="text-[9px] font-mono text-muted-foreground">{s.uses}×</span>
                  </div>
                  <div className="text-xs font-medium text-foreground truncate tracking-tight">{s.title}</div>
                  <div className="text-[11px] text-muted-foreground truncate font-mono mt-0.5">
                    {s.body.split("\n")[0]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between backdrop-blur-md bg-surface-elevated/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Snippets</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{selected.title}</span>
              <span
                className="ml-2 inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full border"
                style={{
                  borderColor: `color-mix(in oklab, ${selected.hue} 35%, transparent)`,
                  background: `color-mix(in oklab, ${selected.hue} 10%, transparent)`,
                  color: selected.hue,
                }}
              >
                <span className="w-1 h-1 rounded-full" style={{ background: selected.hue }} />
                {selected.category}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-5 bg-border mx-1.5" />
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-glow), var(--shadow-inset-hi)",
                }}
              >
                <Save className="w-3 h-3" strokeWidth={2.8} />
                Salvar
              </button>
            </div>
          </div>

          {/* Editor body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Atalho
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      defaultValue={selected.trigger}
                      className="w-full h-10 px-3 rounded-xl bg-background/80 border border-border text-sm font-mono text-primary focus:outline-none focus:border-primary/40 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_15%,transparent)] transition-shadow"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">+ Tab</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Título
                </label>
                <input
                  defaultValue={selected.title}
                  className="mt-1.5 w-full h-10 px-3 rounded-xl bg-background/80 border border-border text-sm focus:outline-none focus:border-primary/40 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_15%,transparent)] transition-shadow"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Texto expandido
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono text-muted-foreground mr-1">inserir:</span>
                  <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 border border-border text-[10px] font-mono text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                    <Calendar className="w-2.5 h-2.5" /> {`{{date}}`}
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 border border-border text-[10px] font-mono text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                    <Hash className="w-2.5 h-2.5" /> {`{{ticket}}`}
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 border border-border text-[10px] font-mono text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                    <User className="w-2.5 h-2.5" /> {`{{user}}`}
                  </button>
                </div>
              </div>
              <div className="relative rounded-xl border border-border bg-background/80 overflow-hidden focus-within:border-primary/40 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_15%,transparent)] transition-shadow">
                <div className="absolute top-0 left-0 right-0 h-7 px-3 flex items-center gap-1.5 border-b border-border/60 bg-surface-elevated/40 text-[10px] font-mono text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.75_0.15_85)]/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  <span className="ml-2">snippet.md</span>
                </div>
                <textarea
                  defaultValue={selected.body}
                  rows={8}
                  className="w-full pt-9 pb-3 px-4 bg-transparent text-sm font-mono leading-relaxed resize-none focus:outline-none"
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span>{selected.body.length} caracteres</span>
                <span className="text-primary">
                  ~{Math.round(selected.body.length / 5)} palavras economizadas / uso
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Categoria", value: selected.category },
                { label: "Usos totais", value: `${selected.uses}`, accent: true },
                { label: "Atualizado", value: selected.updated },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="relative p-4 rounded-xl bg-background/60 border border-border overflow-hidden ring-hairline"
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </div>
                  <div
                    className={`mt-1 text-base font-semibold tracking-tight ${
                      stat.accent ? "text-primary" : ""
                    }`}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Preview */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Pré-visualização
              </label>
              <div className="mt-1.5 rounded-xl border border-border bg-background/40 overflow-hidden ring-hairline">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border/60 bg-surface-elevated/40 text-[10px] font-mono text-muted-foreground">
                  <Command className="w-3 h-3 text-primary" />
                  Como vai aparecer no campo
                </div>
                <div className="p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap">
                  {selected.body}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
