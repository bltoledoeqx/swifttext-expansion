import { createFileRoute, Link } from "@tanstack/react-router";
import { PluginShowcase } from "@/components/plugin/PluginShowcase";
import { Zap, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/plugin")({
  component: PluginPage,
  head: () => ({
    meta: [
      { title: "SnapText — Interface do Plugin" },
      { name: "description", content: "Veja como funciona a interface do plugin SnapText: popup do navegador e dashboard de gerenciamento de snippets." },
    ],
  }),
});

function PluginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} fill="currentColor" />
            </div>
            <span className="font-semibold tracking-tight">SnapText</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para landing
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-6 py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs font-mono text-primary uppercase tracking-wider">
            // plugin interface
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
            A interface do plugin
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Dois contextos de uso: o popup rápido que abre direto no navegador,
            e o dashboard completo para gerenciar toda sua biblioteca de snippets.
          </p>
        </div>

        <PluginShowcase />
      </main>
    </div>
  );
}
