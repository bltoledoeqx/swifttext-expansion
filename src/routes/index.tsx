import { createFileRoute, Link } from "@tanstack/react-router";
import { PluginDashboard } from "@/components/plugin/PluginDashboard";
import { AppWindow } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none bg-grid opacity-40"
      />
      <div className="relative max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-sm font-mono text-muted-foreground">
              <span className="text-primary">//</span> dashboard
            </h1>
          </div>
          <Link
            to="/popup"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface/80 backdrop-blur hover:bg-surface-elevated text-xs font-medium transition-colors ring-hairline"
          >
            <AppWindow className="w-3.5 h-3.5" />
            Ver popup do navegador
          </Link>
        </div>
        <PluginDashboard />
      </div>
    </div>
  );
}
