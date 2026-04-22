import { createFileRoute, Link } from "@tanstack/react-router";
import { PluginPopup } from "@/components/plugin/PluginPopup";
import { Layout } from "lucide-react";

export const Route = createFileRoute("/popup")({
  component: PopupPage,
  head: () => ({
    meta: [
      { title: "SnapText — Popup" },
      { name: "description", content: "Popup do plugin SnapText no navegador." },
    ],
  }),
});

function PopupPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-radial)" }}
      />

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <h1 className="text-sm font-mono text-muted-foreground">
          <span className="text-primary">//</span> popup
        </h1>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-xs font-medium transition-colors"
        >
          <Layout className="w-3.5 h-3.5" />
          Ver dashboard
        </Link>
      </div>

      <div className="relative animate-float-up">
        {/* simulated browser chrome */}
        <div className="absolute -top-8 left-0 right-0 flex items-center gap-1.5 px-1">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.75_0.15_85)]/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-primary/50" />
          <span className="ml-3 text-[10px] font-mono text-muted-foreground">
            extensão · 380×540
          </span>
        </div>
        <PluginPopup />
      </div>
    </div>
  );
}
