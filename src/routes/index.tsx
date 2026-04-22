import { createFileRoute, Link } from "@tanstack/react-router";
import { PluginDashboard } from "@/components/plugin/PluginDashboard";
import { AppWindow } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-sm font-mono text-muted-foreground">
              <span className="text-primary">//</span> dashboard
            </h1>
          </div>
          <Link
            to="/popup"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-xs font-medium transition-colors"
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
