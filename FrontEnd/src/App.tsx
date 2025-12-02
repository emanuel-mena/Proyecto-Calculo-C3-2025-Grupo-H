// src/App.tsx
import { useState } from "react";
import MathLiveInput from "./components/MathLiveInput";
import useTaylorAnalysis from "./hooks/useTaylorAnalysis";

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
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">
            Calculus Solver <span className="text-sky-400">/ TaylorLab</span>
          </h1>
          <span className="text-xs md:text-sm text-slate-400">
            Prototipo académico con MathLive + FastAPI
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
        {/* Descripción corta */}
        <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 md:p-5">
          <p className="text-sm md:text-base text-slate-300">
            Este prototipo conecta un editor{" "}
            <span className="text-emerald-400 font-medium">MathLive</span> con
            un backend en{" "}
            <span className="text-sky-400 font-medium">FastAPI</span> que
            calcula el polinomio de Taylor, errores y una gráfica de convergencia.
          </p>
          <p className="mt-2 text-xs md:text-sm text-slate-400">
            Toda la lógica de comunicación con el backend se concentra en este{" "}
            <code className="text-emerald-300">App.tsx</code>, mientras que las
            zonas de entrada, proceso y resultado se mantienen como componentes
            principalmente visuales.
          </p>
        </section>

        {/* Tres zonas: entrada / proceso / resultado */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* Zona de entrada */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 md:p-5 shadow-lg shadow-slate-900/40 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Zona de entrada</h2>
            <p className="text-xs md:text-sm text-slate-400">
              Aquí el usuario escribe la función en notación matemática. El valor
              se guarda como LaTeX y se envía al endpoint{" "}
              <code className="text-emerald-300">/taylor/analyze</code>.
            </p>

            <MathLiveInput
              initialLatex={latex}
              label="Función f(x) a analizar con Taylor"
              onChangeLatex={setLatex}
            />

            {/* Parámetros numéricos básicos */}
            <div className="mt-2 grid grid-cols-3 gap-3 text-xs md:text-sm">
              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-medium">
                  Centro (a)
                </label>
                <input
                  type="number"
                  value={center}
                  onChange={(e) => setCenter(Number(e.target.value))}
                  className="rounded-lg bg-slate-900/80 border border-slate-700 px-2 py-1 text-xs md:text-sm outline-none focus:ring-2 focus:ring-sky-500/60"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-medium">
                  x_eval
                </label>
                <input
                  type="number"
                  value={xEval}
                  onChange={(e) => setXEval(Number(e.target.value))}
                  className="rounded-lg bg-slate-900/80 border border-slate-700 px-2 py-1 text-xs md:text-sm outline-none focus:ring-2 focus:ring-sky-500/60"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-medium">
                  Orden (n)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="rounded-lg bg-slate-900/80 border border-slate-700 px-2 py-1 text-xs md:text-sm outline-none focus:ring-2 focus:ring-sky-500/60"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={handleAnalyze}
                disabled={loading || !latex.trim()}
                className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-3 py-1.5 text-xs md:text-sm font-medium text-white shadow-sm shadow-sky-900/40 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? "Analizando..." : "Analizar con Taylor"}
              </button>

              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-3 py-1.5 text-xs md:text-sm font-medium text-slate-200 hover:bg-slate-700/60 transition"
              >
                Limpiar resultado
              </button>
            </div>

            {/* Estado de error / metadatos */}
            {error && (
              <div className="mt-2 rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                <strong className="font-semibold">Error al analizar:</strong>{" "}
                {error}
              </div>
            )}

            {lastRequest && !error && (
              <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-700/70 pt-2">
                <div className="font-semibold text-slate-300 mb-1">
                  Última petición enviada:
                </div>
                <div>
                  <span className="font-mono text-emerald-300">a = </span>
                  {lastRequest.center}{" "}
                  <span className="font-mono text-emerald-300">, x_eval = </span>
                  {lastRequest.x_eval}{" "}
                  <span className="font-mono text-emerald-300">
                    , orden ={" "}
                  </span>
                  {lastRequest.order}
                </div>
              </div>
            )}
          </div>

          {/* Zona de proceso */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 md:p-5 shadow-lg shadow-slate-900/40 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Zona de proceso</h2>
            <p className="text-xs md:text-sm text-slate-400 mb-3">
              Aquí se muestran los pasos simbólicos que el backend ejecuta:
              derivadas, coeficientes y construcción del polinomio de Taylor.
            </p>

            <div className="flex-1 rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-2 overflow-auto">
              {loading && (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Procesando función y generando serie de Taylor…
                </div>
              )}

              {!loading && result && result.steps && result.steps.length > 0 && (
                <ol className="space-y-2 text-xs md:text-sm text-slate-200 list-decimal list-inside">
                  {result.steps.map((step, idx) => (
                    <li key={idx} className="leading-snug">
                      {step}
                    </li>
                  ))}
                </ol>
              )}

              {!loading && !result && (
                <div className="h-full flex items-center justify-center text-center text-xs text-slate-500">
                  Ejecuta un análisis para ver el desarrollo paso a paso del
                  polinomio de Taylor.
                </div>
              )}
            </div>
          </div>

          {/* Zona de resultado */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 md:p-5 shadow-lg shadow-slate-900/40 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Zona de resultado</h2>
            <p className="text-xs md:text-sm text-slate-400 mb-3">
              Resumen numérico: valor de la función, aproximación por Taylor,
              derivadas y errores relativos. Incluye, además, una gráfica de
              convergencia generada por el backend.
            </p>

            <div className="flex-1 rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-2 flex flex-col gap-3 overflow-auto">
              {loading && (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Calculando resultados…
                </div>
              )}

              {!loading && result && (
                <>
                  {/* Expresión y polinomio */}
                  <div className="text-xs md:text-sm space-y-1">
                    <div>
                      <span className="font-semibold text-slate-200">
                        f(x) (SymPy):
                      </span>{" "}
                      <code className="text-emerald-300 break-all">
                        {result.expression_sympy_str}
                      </code>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200">
                        P<sub>{result.order}</sub>(x) (SymPy):
                      </span>{" "}
                      <code className="text-sky-300 break-all">
                        {result.polynomial_sympy_str}
                      </code>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200">
                        P<sub>{result.order}</sub>(x) (LaTeX):
                      </span>{" "}
                      <code className="text-sky-300 break-all">
                        {result.polynomial_latex}
                      </code>
                    </div>
                  </div>

                  {/* Valores numéricos */}
                  <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                    <div className="rounded-lg bg-slate-900/70 border border-slate-700 p-2">
                      <div className="font-semibold text-slate-200 mb-1">
                        Valor en x = {result.x_eval}
                      </div>
                      <div className="space-y-0.5">
                        <div>
                          <span className="text-slate-400">
                            f(x) exacta:
                          </span>{" "}
                          <span className="text-emerald-300">
                            {result.exact_value_at_x?.toPrecision(8)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">
                            P<sub>{result.order}</sub>(x):
                          </span>{" "}
                          <span className="text-sky-300">
                            {result.approx_value_at_x?.toPrecision(8)}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Error relativo:{" "}
                          <span className="text-amber-300">
                            {result.value_errors?.relative !== null &&
                            result.value_errors?.relative !== undefined
                              ? (
                                  result.value_errors.relative * 100
                                ).toExponential(3)
                              : "--"}
                          </span>{" "}
                          %
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-900/70 border border-slate-700 p-2">
                      <div className="font-semibold text-slate-200 mb-1">
                        Derivada en x = {result.x_eval}
                      </div>
                      <div className="space-y-0.5">
                        <div>
                          <span className="text-slate-400">
                            f&apos;(x) exacta:
                          </span>{" "}
                          <span className="text-emerald-300">
                            {result.derivative_exact_at_x?.toPrecision(8)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">
                            P<sub>{result.order}</sub>&apos;(x):
                          </span>{" "}
                          <span className="text-sky-300">
                            {result.derivative_approx_at_x?.toPrecision(8)}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Error relativo:{" "}
                          <span className="text-amber-300">
                            {result.derivative_errors?.relative !== null &&
                            result.derivative_errors?.relative !== undefined
                              ? (
                                  result.derivative_errors.relative * 100
                                ).toExponential(3)
                              : "--"}
                          </span>{" "}
                          %
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gráfica */}
                  {result.plot_base64_png && (
                    <div className="mt-1 border-t border-slate-700 pt-2">
                      <div className="text-xs text-slate-400 mb-1">
                        Gráfica generada por el backend (f(x) vs P
                        <sub>{result.order}</sub>(x)):
                      </div>
                      <div className="rounded-lg bg-slate-900/80 border border-slate-700 p-2">
                        <img
                          src={`data:image/png;base64,${result.plot_base64_png}`}
                          alt="Gráfica de f(x) y su aproximación de Taylor"
                          className="w-full h-auto rounded-md"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {!loading && !result && (
                <div className="h-full flex items-center justify-center text-center text-xs text-slate-500">
                  Ejecuta un análisis para visualizar resultados numéricos y la
                  gráfica de convergencia de la serie de Taylor.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
