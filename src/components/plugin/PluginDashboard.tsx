import { useState } from "react";
import {
  Search, Plus, Zap, Settings, Folder, Tag, BarChart3,
  Command, Trash2, Copy, Save, Variable, Hash, Calendar, User,
  ChevronRight, MoreHorizontal,
} from "lucide-react";

type Snippet = {
  id: string;
  trigger: string;
  title: string;
  body: string;
  category: string;
  uses: number;
  updated: string;
};

const SNIPPETS: Snippet[] = [
  { id: "1", trigger: "/vm", title: "Restart VM", body: "Realizado restart da VM, serviço normalizado sem impacto adicional.", category: "Ops", uses: 142, updated: "há 2h" },
  { id: "2", trigger: "/sla", title: "SLA padrão", body: "Conforme SLA acordado, prazo de atendimento de até 4 horas úteis.", category: "Suporte", uses: 89, updated: "ontem" },
  { id: "3", trigger: "/ack", title: "Acknowledge", body: "Recebido. Iniciando análise, retorno em até 30 minutos com update.", category: "Resposta", uses: 76, updated: "ontem" },
  { id: "4", trigger: "/sig", title: "Assinatura padrão", body: "Atenciosamente,\nEquipe de Operações N2", category: "Email", uses: 54, updated: "3 dias" },
  { id: "5", trigger: "/inc", title: "Incidente template", body: "Incidente {{ticket}} aberto em {{date}}.\nSeveridade: {{sev}}\nResponsável: {{user}}", category: "Variável", uses: 41, updated: "1 sem" },
  { id: "6", trigger: "/rca", title: "Root cause analysis", body: "Root cause: configuração incorreta.\nAção: rollback aplicado e validado em produção.", category: "Postmortem", uses: 23, updated: "2 sem" },
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
    <div className="w-full h-[640px] rounded-2xl border border-border bg-surface shadow-elevated overflow-hidden flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border bg-surface-elevated flex flex-col">
        <div className="px-4 py-3.5 border-b border-border flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Zap className="w-3 h-3 text-primary-foreground" fill="currentColor" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-sm">SnapText</span>
        </div>

        <div className="p-2">
          <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            Novo snippet
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
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                activeFolder === f.name
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <f.icon className="w-3.5 h-3.5" />
                {f.name}
              </span>
              <span className="text-[10px] font-mono opacity-60">{f.count}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-2 space-y-0.5">
          <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <BarChart3 className="w-3.5 h-3.5" /> Estatísticas
          </button>
          <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Settings className="w-3.5 h-3.5" /> Configurações
          </button>
        </div>
      </aside>

      {/* Snippet list */}
      <div className="w-72 border-r border-border flex flex-col bg-background/30">
        <div className="px-3 py-2.5 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              placeholder="Buscar…"
              className="w-full h-8 pl-8 pr-2 rounded-md bg-surface border border-border text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 font-mono"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {SNIPPETS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className={`w-full text-left p-2.5 rounded-lg transition-colors border ${
                selectedId === s.id
                  ? "bg-surface border-primary/30"
                  : "border-transparent hover:bg-surface/60"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <code
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${
                    selectedId === s.id
                      ? "bg-primary/15 border-primary/30 text-primary"
                      : "bg-background border-border text-muted-foreground"
                  }`}
                >
                  {s.trigger}
                </code>
                <span className="text-[9px] font-mono text-muted-foreground">{s.uses} usos</span>
              </div>
              <div className="text-xs font-medium text-foreground truncate">{s.title}</div>
              <div className="text-[11px] text-muted-foreground truncate font-mono mt-0.5">
                {s.body.split("\n")[0]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Snippets</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{selected.title}</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
              <Save className="w-3 h-3" strokeWidth={2.5} />
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
                <input
                  defaultValue={selected.trigger}
                  className="flex-1 h-9 px-3 rounded-lg bg-background border border-border text-sm font-mono text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                />
                <span className="text-[10px] font-mono text-muted-foreground">+ Tab</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Título
              </label>
              <input
                defaultValue={selected.title}
                className="mt-1.5 w-full h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Texto expandido
              </label>
              <div className="flex items-center gap-1">
                <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-background border border-border text-[10px] font-mono text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                  <Calendar className="w-2.5 h-2.5" /> {`{{date}}`}
                </button>
                <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-background border border-border text-[10px] font-mono text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                  <Hash className="w-2.5 h-2.5" /> {`{{ticket}}`}
                </button>
                <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-background border border-border text-[10px] font-mono text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                  <User className="w-2.5 h-2.5" /> {`{{user}}`}
                </button>
              </div>
            </div>
            <textarea
              defaultValue={selected.body}
              rows={8}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-sm font-mono leading-relaxed resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
            />
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span>{selected.body.length} caracteres</span>
              <span>~{Math.round(selected.body.length / 5)} palavras economizadas por uso</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-background border border-border">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Categoria
              </div>
              <div className="mt-1 text-sm font-medium">{selected.category}</div>
            </div>
            <div className="p-3 rounded-lg bg-background border border-border">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Usos totais
              </div>
              <div className="mt-1 text-sm font-medium text-primary">{selected.uses}</div>
            </div>
            <div className="p-3 rounded-lg bg-background border border-border">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Atualizado
              </div>
              <div className="mt-1 text-sm font-medium">{selected.updated}</div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Pré-visualização
            </label>
            <div className="mt-1.5 rounded-lg border border-border bg-background/60 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-surface-elevated text-[10px] font-mono text-muted-foreground">
                <Command className="w-3 h-3" /> Como vai aparecer no campo
              </div>
              <div className="p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap">
                {selected.body}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
