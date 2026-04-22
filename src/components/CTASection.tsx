import { Chrome, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section id="cta" className="py-24 border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-radial)" }}
      />
      <div className="container mx-auto max-w-4xl px-6 relative">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-gradient">
            Pare de redigitar.
            <br />
            <span className="text-gradient-primary">Comece a expandir.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Instale a extensão em 10 segundos. Crie seu primeiro snippet em 30. Economize horas todo dia.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all shadow-glow"
            >
              <Chrome className="w-5 h-5" strokeWidth={2} />
              Adicionar ao Chrome — grátis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-surface text-foreground font-medium hover:bg-surface-elevated transition-colors"
            >
              Ver demonstração
            </a>
          </div>
          <p className="mt-6 text-xs font-mono text-muted-foreground">
            Compatível com Chrome · Edge · Brave · Arc · Opera
          </p>
        </div>
      </div>
    </section>
  );
}
