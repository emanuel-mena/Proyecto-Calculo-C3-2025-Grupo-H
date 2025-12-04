import { useState } from "react";
import useTaylorAnalysis from "./hooks/useTaylorAnalysis";
import InputZone from "./components/InputZone";
import ProcessZone from "./components/ProcessZone";
import ResultZone from "./components/ResultZone";

function App() {
  // =========================
  // Estado local (UI)
  // =========================
  const [latex, setLatex] = useState("\\sin(x) + x^2");
  const [center, setCenter] = useState<number>(0);
  const [xEval, setXEval] = useState<number>(0.5);
  const [order, setOrder] = useState<number>(5);

  // ========================= 
  // Hook para backend de Taylor
  // =========================
  const {
    result,
    lastRequest,
    loading,
    error,
    analyzeFromLatex,
    reset,
  } = useTaylorAnalysis({
    center,
    x_eval: xEval,
    order,
    input_is_latex: true,
    num_points: 300,
  });

  // Handler principal para lanzar el análisis
  const handleAnalyze = () => {
    if (!latex.trim()) return;
    analyzeFromLatex(latex);
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--app-bg))] text-[rgb(var(--app-text))]">
      {/* Header */}
      <header className="border-b border-[rgb(var(--app-border))] bg-[rgba(var(--app-bg),0.9)] backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">
            Taylor Machine
          </h1>
          <span className="text-xs md:text-sm text-[rgb(var(--app-muted))]">
            Prototipo académico con MathLive + FastAPI
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
        {/* Descripción corta */}
        <section className="bg-[rgb(var(--app-surface))] border border-[rgb(var(--app-border))] rounded-2xl p-4 md:p-5">
          <p className="text-sm md:text-base">
            Este prototipo conecta un editor{" "}
            <span className="text-[rgb(var(--app-accent-strong))] font-medium">
              MathLive
            </span>{" "}
            con un backend en{" "}
            <span className="text-[rgb(var(--app-accent))] font-medium">
              FastAPI
            </span>{" "}
            que calcula el polinomio de Taylor, errores y una gráfica de convergencia.
          </p>
          <p className="mt-2 text-xs md:text-sm text-[rgb(var(--app-muted))]">
            Toda la lógica de comunicación con el backend se concentra en{" "}
            <code className="text-[rgb(var(--app-accent-strong))]">
              App.tsx
            </code>
            , mientras que las zonas de entrada, proceso y resultado se mantienen
            como componentes principalmente visuales.
          </p>
        </section>

        {/* Tres zonas: entrada / proceso / resultado */}
        <section className="grid gap-6 md:grid-cols-3">
          <InputZone
            latex={latex}
            onLatexChange={setLatex}
            center={center}
            xEval={xEval}
            order={order}
            setCenter={setCenter}
            setXEval={setXEval}
            setOrder={setOrder}
            loading={loading}
            error={error}
            lastRequest={lastRequest}
            onAnalyze={handleAnalyze}
            onReset={reset}
          />

          <ProcessZone loading={loading} result={result} />

          <ResultZone loading={loading} result={result} />
        </section>
      </main>
    </div>
  );
}

export default App;
