import { useEffect, useState } from "react";

const SHORTCUT = "/vm";
const EXPANDED = "Realizado restart da VM, serviço normalizado sem impacto adicional.";

export function SnippetDemo() {
  const [phase, setPhase] = useState<"typing" | "expanding" | "done" | "reset">("typing");
  const [typed, setTyped] = useState("");
  const [expandedChars, setExpandedChars] = useState(0);

  useEffect(() => {
    if (phase === "typing") {
      if (typed.length < SHORTCUT.length) {
        const t = setTimeout(() => setTyped(SHORTCUT.slice(0, typed.length + 1)), 220);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("expanding"), 600);
      return () => clearTimeout(t);
    }
    if (phase === "expanding") {
      if (expandedChars < EXPANDED.length) {
        const t = setTimeout(() => setExpandedChars((c) => c + 2), 18);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("done"), 2200);
      return () => clearTimeout(t);
    }
    if (phase === "done") {
      const t = setTimeout(() => setPhase("reset"), 400);
      return () => clearTimeout(t);
    }
    if (phase === "reset") {
      setTyped("");
      setExpandedChars(0);
      const t = setTimeout(() => setPhase("typing"), 200);
      return () => clearTimeout(t);
    }
  }, [phase, typed, expandedChars]);

  const displayText =
    phase === "typing" || phase === "reset"
      ? typed
      : EXPANDED.slice(0, expandedChars);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Browser chrome */}
      <div className="rounded-2xl border border-border bg-surface shadow-elevated overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-elevated">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-destructive/70" />
            <span className="w-3 h-3 rounded-full bg-[oklch(0.75_0.15_85)]" />
            <span className="w-3 h-3 rounded-full bg-primary/80" />
          </div>
          <div className="flex-1 mx-4 px-3 py-1 rounded-md bg-background/60 text-xs text-muted-foreground font-mono truncate">
            servicenow.com / incident · INC0042193
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-[10px] font-mono text-primary">SnapText</span>
          </div>
        </div>

        {/* Editor area */}
        <div className="p-6 min-h-[220px] bg-background/40">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
            Work notes
          </label>
          <div className="mt-3 relative">
            <div
              className={`font-mono text-base leading-relaxed transition-colors duration-300 ${
                phase === "expanding" || phase === "done"
                  ? "text-foreground"
                  : "text-primary"
              }`}
            >
              <span className="cursor-blink">{displayText}</span>
            </div>

            {/* Expansion popover hint */}
            {phase === "typing" && typed === SHORTCUT && (
              <div className="absolute left-0 top-full mt-3 animate-float-up">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/30 bg-surface-elevated shadow-soft">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-background border border-border text-muted-foreground">
                    Tab
                  </kbd>
                  <span className="text-xs text-muted-foreground">to expand snippet</span>
                  <span className="text-xs font-mono text-primary">/vm</span>
                </div>
              </div>
            )}

            {(phase === "expanding" || phase === "done") && (
              <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary-glow to-transparent rounded-full" />
            )}
          </div>
        </div>
      </div>

      {/* Floating shortcut chip */}
      <div className="absolute -top-4 -right-4 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-mono font-semibold shadow-glow">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
        expanded in 12ms
      </div>
    </div>
  );
}
