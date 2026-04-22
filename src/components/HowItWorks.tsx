const steps = [
  {
    n: "01",
    title: "Crie um snippet",
    desc: "Defina o atalho (ex: /vm) e o texto completo que ele expande.",
    code: `shortcut: /vm\nexpand: "Realizado restart da VM,\n  serviço normalizado sem\n  impacto adicional."`,
  },
  {
    n: "02",
    title: "Digite em qualquer lugar",
    desc: "Em qualquer campo de texto na web, comece a digitar seu atalho.",
    code: `> typing in #work-notes\n> /v\n> /vm  ← match found ✓`,
  },
  {
    n: "03",
    title: "Tab e pronto",
    desc: "Pressione Tab. O atalho desaparece, o texto completo toma o lugar.",
    code: `✓ snippet expanded\n  duration: 12ms\n  saved: 67 keystrokes`,
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 border-t border-border/50 relative">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono text-primary uppercase tracking-wider">
            // how it works
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
            Três passos.
            <br />
            Zero atrito.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="relative rounded-2xl border border-border bg-surface p-6 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-primary">{s.n}</span>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-3 w-6 h-px bg-gradient-to-r from-border to-transparent" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-5">{s.desc}</p>
              <pre className="text-xs font-mono bg-background/60 border border-border rounded-lg p-4 text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {s.code}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
