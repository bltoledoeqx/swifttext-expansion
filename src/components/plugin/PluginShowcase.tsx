import { useState } from "react";
import { PluginPopup } from "./PluginPopup";
import { PluginDashboard } from "./PluginDashboard";
import { Layout, AppWindow } from "lucide-react";

export function PluginShowcase() {
  const [view, setView] = useState<"popup" | "dashboard">("popup");

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-border bg-surface-elevated">
          <button
            onClick={() => setView("popup")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === "popup"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AppWindow className="w-4 h-4" />
            Popup do navegador
          </button>
          <button
            onClick={() => setView("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === "dashboard"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layout className="w-4 h-4" />
            Dashboard completo
          </button>
        </div>
      </div>

      {/* Mockup */}
      <div className="relative flex items-center justify-center min-h-[680px]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--gradient-radial)" }}
        />
        {view === "popup" ? (
          <div className="relative animate-float-up">
            {/* Browser window mock around popup */}
            <div className="absolute -top-10 -right-10 -left-10 -bottom-10 rounded-3xl border border-border/40 bg-surface/30 backdrop-blur-sm -z-10" />
            <div className="absolute -top-6 left-0 right-0 flex items-center gap-1.5 px-4">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.75_0.15_85)]/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary/50" />
            </div>
            <PluginPopup />
          </div>
        ) : (
          <div className="w-full max-w-5xl animate-float-up">
            <PluginDashboard />
          </div>
        )}
      </div>
    </div>
  );
}
