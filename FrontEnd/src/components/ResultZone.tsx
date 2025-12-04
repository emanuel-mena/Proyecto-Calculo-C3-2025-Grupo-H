// src/components/ResultZone.tsx
import React, { useState } from "react";
import type { TaylorAnalysisResponseDTO } from "../lib/api/taylorTypes";
import LatexDisplay from "./LaTexDisplay";
import { motion, AnimatePresence } from "framer-motion";

interface ResultZoneProps {
  loading: boolean;
  result: TaylorAnalysisResponseDTO | null;
}

/**
 * Zona de resultado con tabs:
 * - Resumen: fórmulas + valores numéricos
 * - Gráfica: imagen de convergencia con lightbox (zoom)
 */
const ResultZone: React.FC<ResultZoneProps> = ({ loading, result }) => {
  const [activeTab, setActiveTab] = useState<"resumen" | "grafica">("resumen");
  const [zoomed, setZoomed] = useState(false);

  if (loading) {
    return (
      <div className="bg-[rgb(var(--app-surface))] border border-[rgb(var(--app-border))] rounded-2xl p-4 md:p-5 shadow-lg flex flex-col">
        <h2 className="text-lg font-semibold mb-2">Zona de resultado</h2>
        <p className="text-xs md:text-sm text-[rgb(var(--app-muted))] mb-3">
          Resumen numérico: valor de la función, aproximación por Taylor,
          derivadas y errores relativos. Incluye, además, una gráfica de
          convergencia generada por el backend.
        </p>
        <div className="flex-1 rounded-xl border border-[rgb(var(--app-border))] bg-[rgba(var(--app-bg),0.4)] px-3 py-2 flex items-center justify-center text-xs text-[rgb(var(--app-muted))]">
          Calculando resultados…
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-[rgb(var(--app-surface))] border border-[rgb(var(--app-border))] rounded-2xl p-4 md:p-5 shadow-lg flex flex-col">
        <h2 className="text-lg font-semibold mb-2">Zona de resultado</h2>
        <p className="text-xs md:text-sm text-[rgb(var(--app-muted))] mb-3">
          Resumen numérico: valor de la función, aproximación por Taylor,
          derivadas y errores relativos. Incluye, además, una gráfica de
          convergencia generada por el backend.
        </p>
        <div className="flex-1 rounded-xl border border-[rgb(var(--app-border))] bg-[rgba(var(--app-bg),0.4)] px-3 py-2 flex items-center justify-center text-center text-xs text-[rgb(var(--app-muted))]">
          Ejecuta un análisis para visualizar resultados numéricos y la
          gráfica de convergencia de la serie de Taylor.
        </div>
      </div>
    );
  }

  const r = result;

  const valueErrorRel =
    r.value_errors?.relative !== null && r.value_errors?.relative !== undefined
      ? (r.value_errors.relative * 100).toExponential(3)
      : "--";

  const derivErrorRel =
    r.derivative_errors?.relative !== null &&
    r.derivative_errors?.relative !== undefined
      ? (r.derivative_errors.relative * 100).toExponential(3)
      : "--";

  const handleOpenZoom = () => {
    if (!r.plot_base64_png) return;
    setZoomed(true);
  };

  const handleCloseZoom = () => {
    setZoomed(false);
  };

  return (
    <>
      <div className="bg-[rgb(var(--app-surface))] border border-[rgb(var(--app-border))] rounded-2xl p-4 md:p-5 shadow-lg flex flex-col">
        <h2 className="text-lg font-semibold mb-2">Zona de resultado</h2>
        <p className="text-xs md:text-sm text-[rgb(var(--app-muted))] mb-3">
          Resumen numérico: valor de la función, aproximación por Taylor,
          derivadas y errores relativos. Incluye, además, una gráfica de
          convergencia generada por el backend.
        </p>

        {/* Tabs */}
        <div className="mb-3 flex border-b border-[rgb(var(--app-border))] text-xs md:text-sm">
          <button
            type="button"
            onClick={() => setActiveTab("resumen")}
            className={`px-3 py-1.5 border-b-2 transition-colors ${
              activeTab === "resumen"
                ? "border-[rgb(var(--app-accent-strong))] text-[rgb(var(--app-accent-strong))]"
                : "border-transparent text-[rgb(var(--app-muted))] hover:text-[rgb(var(--app-text))]"
            }`}
          >
            Resumen
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("grafica")}
            className={`px-3 py-1.5 border-b-2 transition-colors ${
              activeTab === "grafica"
                ? "border-[rgb(var(--app-accent-strong))] text-[rgb(var(--app-accent-strong))]"
                : "border-transparent text-[rgb(var(--app-muted))] hover:text-[rgb(var(--app-text))]"
            }`}
          >
            Gráfica
          </button>
        </div>

        {/* Contenido de tabs */}
        <div className="flex-1 rounded-xl border border-[rgb(var(--app-border))] bg-[rgba(var(--app-bg),0.4)] px-3 py-2 flex flex-col gap-3 overflow-auto">
          {activeTab === "resumen" && (
            <>
              {/* Expresión original y polinomio en LaTeX */}
              <div className="text-xs md:text-sm space-y-2">
                <div>
                  <span className="font-semibold text-[rgb(var(--app-text))]">
                    f(x):
                  </span>{" "}
                  <code className="text-[rgb(var(--app-accent-strong))] break-all">
                    {r.expression_sympy_str}
                  </code>
                </div>

                <div>
                  <span className="font-semibold text-[rgb(var(--app-text))]">
                    P<sub>{r.order}</sub>(x):
                  </span>
                  <LatexDisplay
                    latex={r.polynomial_latex}
                    className="mt-1 rounded-md bg-[rgba(var(--app-bg),0.7)] border border-[rgb(var(--app-border))] px-2 py-1"
                  />
                </div>
              </div>

              {/* Valores numéricos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm">
                <div className="rounded-lg bg-[rgba(var(--app-bg),0.7)] border border-[rgb(var(--app-border))] p-2">
                  <div className="font-semibold text-[rgb(var(--app-text))] mb-1">
                    Valor en x = {r.x_eval}
                  </div>
                  <div className="space-y-0.5">
                    <div>
                      <span className="text-[rgb(var(--app-muted))]">
                        f(x) exacta:
                      </span>{" "}
                      <span className="text-[rgb(var(--app-accent-strong))]">
                        {r.exact_value_at_x?.toPrecision(8)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[rgb(var(--app-muted))]">
                        P<sub>{r.order}</sub>(x):
                      </span>{" "}
                      <span className="text-[rgb(var(--app-accent))]">
                        {r.approx_value_at_x?.toPrecision(8)}
                      </span>
                    </div>
                    <div className="text-[11px] text-[rgb(var(--app-muted))] mt-1">
                      Error relativo:{" "}
                      <span className="text-[rgb(var(--app-accent-strong))]">
                        {valueErrorRel}
                      </span>{" "}
                      %
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-[rgba(var(--app-bg),0.7)] border border-[rgb(var(--app-border))] p-2">
                  <div className="font-semibold text-[rgb(var(--app-text))] mb-1">
                    Derivada en x = {r.x_eval}
                  </div>
                  <div className="space-y-0.5">
                    <div>
                      <span className="text-[rgb(var(--app-muted))]">
                        f&apos;(x) exacta:
                      </span>{" "}
                      <span className="text-[rgb(var(--app-accent-strong))]">
                        {r.derivative_exact_at_x?.toPrecision(8)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[rgb(var(--app-muted))]">
                        P<sub>{r.order}</sub>&apos;(x):
                      </span>{" "}
                      <span className="text-[rgb(var(--app-accent))]">
                        {r.derivative_approx_at_x?.toPrecision(8)}
                      </span>
                    </div>
                    <div className="text-[11px] text-[rgb(var(--app-muted))] mt-1">
                      Error relativo:{" "}
                      <span className="text-[rgb(var(--app-accent-strong))]">
                        {derivErrorRel}
                      </span>{" "}
                      %
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "grafica" && (
            <>
              {!r.plot_base64_png && (
                <div className="h-full flex items-center justify-center text-center text-xs text-[rgb(var(--app-muted))]">
                  No se recibió una gráfica desde el backend para esta petición.
                </div>
              )}

              {r.plot_base64_png && (
                <div className="flex-1 flex flex-col gap-2">
                  <div className="text-xs text-[rgb(var(--app-muted))]">
                    Haz clic en la imagen para ampliarla.
                  </div>
                  <div className="rounded-lg bg-[rgba(var(--app-bg),0.8)] border border-[rgb(var(--app-border))] p-2">
                    <img
                      src={`data:image/png;base64,${r.plot_base64_png}`}
                      alt="Gráfica de f(x) y su aproximación de Taylor"
                      className="w-full h-auto rounded-md cursor-zoom-in transition-transform duration-200 hover:scale-[1.01]"
                      onClick={handleOpenZoom}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lightbox / modal para la gráfica ampliada */}
      <AnimatePresence>
        {zoomed && r.plot_base64_png && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseZoom}
          >
            <motion.img
              src={`data:image/png;base64,${r.plot_base64_png}`}
              alt="Gráfica (ampliada)"
              className="max-w-[95vw] max-h-[90vh] rounded-xl shadow-2xl border border-[rgb(var(--app-border))]"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              // Importante: parar la propagación para que el click sobre la imagen no cierre el modal
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResultZone;
