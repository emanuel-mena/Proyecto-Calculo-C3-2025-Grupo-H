// src/components/ProcessZone.tsx
import React from "react";
import type { TaylorAnalysisResponseDTO } from "../lib/api/taylorTypes";
import { AnimatePresence, motion } from "framer-motion";

interface ProcessZoneProps {
  loading: boolean;
  result: TaylorAnalysisResponseDTO | null;
}

/**
 * Extrae el índice (ej: "1", "2", "7.b") y el contenido del paso.
 * Si no matchea el patrón, devuelve todo como contenido.
 */
function parseStep(step: string): { index?: string; content: string } {
  const match = step.match(/^(\d+(\.\w+)?)\)\s*(.*)$/);
  if (!match) {
    return { content: step };
  }
  return {
    index: match[1],
    content: match[3] || "",
  };
}

/**
 * Zona de proceso:
 * - Cada paso se muestra como una tarjeta independiente, con animación al aparecer.
 */
const ProcessZone: React.FC<ProcessZoneProps> = ({ loading, result }) => {
  const steps = result?.steps ?? [];

  return (
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

        {!loading && !result && (
          <div className="h-full flex items-center justify-center text-center text-xs text-slate-500">
            Ejecuta un análisis para ver el desarrollo paso a paso del polinomio
            de Taylor.
          </div>
        )}

        {!loading && result && steps.length > 0 && (
          <div className="space-y-3">
            <AnimatePresence>
              {steps.map((step, idx) => {
                const { index, content } = parseStep(step);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    className="relative rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 shadow-sm shadow-slate-900/60"
                  >
                    {index && (
                      <div className="absolute -top-2 -left-2 inline-flex items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white px-2 py-0.5 shadow shadow-sky-900/70">
                        {index}
                      </div>
                    )}

                    <p className="text-xs md:text-sm text-slate-200 whitespace-pre-line leading-snug">
                      {content}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessZone;
