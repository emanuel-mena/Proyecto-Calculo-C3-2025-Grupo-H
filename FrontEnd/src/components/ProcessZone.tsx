// src/components/ProcessZone.tsx
import React from "react";
import type { TaylorAnalysisResponseDTO } from "../lib/api/taylorTypes";

interface ProcessZoneProps {
  loading: boolean;
  result: TaylorAnalysisResponseDTO | null;
}

/**
 * Zona de proceso:
 * - Muestra los pasos que el backend va generando (steps[])
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

        {!loading && steps.length > 0 && (
          <ol className="space-y-2 text-xs md:text-sm text-slate-200 list-decimal list-inside">
            {steps.map((step, idx) => (
              <li key={idx} className="leading-snug">
                {step}
              </li>
            ))}
          </ol>
        )}

        {!loading && !result && (
          <div className="h-full flex items-center justify-center text-center text-xs text-slate-500">
            Ejecuta un análisis para ver el desarrollo paso a paso del polinomio
            de Taylor.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessZone;
