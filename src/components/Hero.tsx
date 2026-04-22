import { ArrowRight, Chrome } from "lucide-react";
import { SnippetDemo } from "./SnippetDemo";

export function Hero() {
  return (
    <section id="top" className="relative pt-20 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-radial)" }}
      />
      <div className="container mx-auto max-w-6xl px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/60 backdrop-blur text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-muted-foreground">Nova extensão · funciona em qualquer site</span>
          </div>

          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-gradient">
            Digite menos.
            <br />
            <span className="text-gradient-primary">Resolva mais.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transforme atalhos curtos em respostas completas em qualquer campo de texto na web.
            Snippets inteligentes, variáveis dinâmicas, expansão instantânea.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#cta"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all shadow-glow"
            >
              <Chrome className="w-5 h-5" strokeWidth={2} />
              Adicionar ao navegador
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-surface/60 backdrop-blur font-medium hover:bg-surface-elevated transition-colors"
            >
              Como funciona
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs font-mono text-muted-foreground">
            <span>✓ grátis para sempre</span>
            <span>✓ sem cadastro</span>
            <span>✓ 100% local</span>
          </div>
        </div>

        <div className="mt-20">
          <SnippetDemo />
        </div>
      </div>
    </section>
  );
}
