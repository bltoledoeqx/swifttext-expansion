import { Zap, Variable, Globe, Sparkles, KeyboardIcon, Lock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Expansão instantânea",
    desc: "Digite o atalho, pressione Tab. Texto completo aparece em milissegundos, sem fricção.",
  },
  {
    icon: Globe,
    title: "Funciona em qualquer site",
    desc: "ServiceNow, Gmail, Jira, Slack, Notion — qualquer campo de texto vira playground de snippets.",
  },
  {
    icon: Variable,
    title: "Variáveis dinâmicas",
    desc: "Insira data, hora, número do ticket, nome do usuário. Snippets que se adaptam ao contexto.",
  },
  {
    icon: KeyboardIcon,
    title: "Autocomplete inteligente",
    desc: "Sugestões aparecem enquanto você digita. Navegue com setas, confirme com Tab.",
  },
  {
    icon: Sparkles,
    title: "Snippets ilimitados",
    desc: "Crie quantos atalhos quiser. Organize por pastas, tags e workspaces.",
  },
  {
    icon: Lock,
    title: "100% local e privado",
    desc: "Seus snippets ficam no seu navegador. Nenhum dado trafega por servidores externos.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 border-t border-border/50">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono text-primary uppercase tracking-wider">
            // features
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
            Menos digitação,
            <br />
            mais fluxo.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Tudo que você precisa para automatizar texto repetitivo e voltar ao que importa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative bg-surface p-8 hover:bg-surface-elevated transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
