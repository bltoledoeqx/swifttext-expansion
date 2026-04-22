import { Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="container mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} fill="currentColor" />
          </div>
          <span className="font-semibold tracking-tight">SnapText</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            v1.0
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <Link to="/plugin" className="hover:text-foreground transition-colors">Interface</Link>
        </nav>

        <Link
          to="/plugin"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Ver plugin
        </Link>
      </div>
    </header>
  );
}
