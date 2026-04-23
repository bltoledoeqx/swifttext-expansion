import { Download, Package, CheckCircle2 } from "lucide-react";

export function DownloadBanner() {
  const handleDownload = () => {
    fetch("/snaptext-extension.zip")
      .then((res) => {
        if (!res.ok) throw new Error(`Falha no download: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "snaptext-extension.zip";
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-primary/30 ring-hairline mb-6"
      style={{
        background:
          "radial-gradient(80% 60% at 0% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 60%), var(--gradient-card)",
      }}
    >
      <div
        aria-hidden
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-50"
        style={{ background: "color-mix(in oklab, var(--primary) 60%, transparent)" }}
      />
      <div className="relative p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow), var(--shadow-inset-hi)",
          }}
        >
          <Package className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-semibold tracking-tight">
              Extensão pronta para instalar
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary">
              Manifest V3
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            HTML/CSS/JS puros · funciona em Chrome, Edge, Brave, Arc, Opera. Baixe o ZIP, descompacte e carregue como extensão de desenvolvedor.
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow), var(--shadow-inset-hi)",
          }}
        >
          <Download className="w-4 h-4" strokeWidth={2.5} />
          Baixar extensão (.zip)
        </button>
      </div>

      <div className="relative px-6 md:px-7 pb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          "Baixe o ZIP e descompacte",
          "Abra chrome://extensions",
          "Ative o Modo desenvolvedor",
          "Clique em Carregar sem compactação",
        ].map((step, i) => (
          <div
            key={i}
            className="flex items-start gap-2 p-3 rounded-xl bg-background/40 border border-border/60"
          >
            <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-[10px] font-mono font-semibold text-primary">
              {i + 1}
            </span>
            <span className="text-xs text-muted-foreground leading-relaxed">{step}</span>
          </div>
        ))}
      </div>

      <div className="relative px-6 md:px-7 pb-6 flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
        <CheckCircle2 className="w-3 h-3 text-primary" />
        Compatível com qualquer navegador Chromium
      </div>
    </div>
  );
}
