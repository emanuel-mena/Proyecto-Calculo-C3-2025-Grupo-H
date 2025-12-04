import { useState } from "react";
import useTaylorAnalysis from "./hooks/useTaylorAnalysis";
import InputZone from "./components/InputZone";
import ProcessZone from "./components/ProcessZone";
import ResultZone from "./components/ResultZone";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Info from "./components/Info";

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
      <Header />

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
        
        <Info></Info>

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

      <Footer></Footer>
    </div>
  );
}

export default App;
