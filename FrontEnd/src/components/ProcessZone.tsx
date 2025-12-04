// src/components/ProcessZone.tsx
import React from "react";
import type { TaylorAnalysisResponseDTO } from "../lib/api/taylorTypes";
import { AnimatePresence, motion } from "framer-motion";
import InlineLatex from "./InlineLaTex";

interface ProcessZoneProps {
  loading: boolean;
  result: TaylorAnalysisResponseDTO | null;
}

/**
 * Extrae el índice (ej: "1", "2", "10") y el contenido del paso.
 */
function parseStep(step: string): { index?: string; content: string } {
  const match = step.match(/^(\d+)\)\s*(.*)$/);
  if (!match) {
    return { content: step };
  }
  return {
    index: match[1],
    content: match[2] || "",
  };
}

/**
 * Divide el contenido usando $...$ como bloques LaTeX inline.
 */
function splitContentWithLatex(content: string): Array<
  { type: "text"; value: string } | { type: "latex"; value: string }
> {
  const parts = content.split("$");

  if (parts.length === 1) {
    return [{ type: "text", value: content }];
  }

  const segments: Array<
    { type: "text"; value: string } | { type: "latex"; value: string }
  > = [];

  parts.forEach((part, idx) => {
    if (idx % 2 === 1) {
      // Dentro de $...$
      if (part.length > 0) {
        segments.push({ type: "latex", value: part });
      }
    } else {
      // Texto fuera de $...$
      if (part.length > 0) {
        segments.push({ type: "text", value: part });
      }
    }
  });

  return segments;
}

/**
 * Renderiza el contenido del paso con texto + LaTeX inline.
 * Usamos whitespace-pre-wrap para respetar saltos/indentación pero permitir wrapping.
 */
function renderStepContent(content: string) {
  const segments = splitContentWithLatex(content);

  return (
    <p className="text-xs md:text-sm text-[rgb(var(--app-text))] whitespace-pre-wrap break-words leading-relaxed">
      {segments.map((seg, i) =>
        seg.type === "text" ? (
          <span key={i}>{seg.value}</span>
        ) : (
          <InlineLatex key={i} latex={seg.value} className="mx-1" />
        )
      )}
    </p>
  );
}

/**
 * Zona de proceso:
 * - Scroll vertical con estilo custom.
 * - Cada step con más espacio vertical.
 * - LaTex inline usando $...$.
 */
const ProcessZone: React.FC<ProcessZoneProps> = ({ loading, result }) => {
  const steps = result?.steps ?? [];

  return (
    <div className="bg-[rgb(var(--app-surface))] border border-[rgb(var(--app-border))] rounded-2xl p-4 md:p-5 shadow-lg flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Zona de proceso</h2>
      <p className="text-xs md:text-sm text-[rgb(var(--app-muted))] mb-3">
        Aquí se muestran los pasos simbólicos que el backend ejecuta: derivadas,
        coeficientes y construcción del polinomio de Taylor.
      </p>

      {/* Contenedor con scroll vertical (sin scroll horizontal) */}
      <div className="flex-1 rounded-xl border border-[rgb(var(--app-border))] bg-[rgba(var(--app-bg),0.6)] px-3 py-3 overflow-y-auto overflow-x-hidden max-h-[32rem] custom-scroll">
        {loading && (
          <div className="h-full flex items-center justify-center text-xs text-[rgb(var(--app-muted))]">
            Procesando función y generando serie de Taylor…
          </div>
        )}

        {!loading && !result && (
          <div className="h-full flex items-center justify-center text-center text-xs text-[rgb(var(--app-muted))]">
            Ejecuta un análisis para ver el desarrollo paso a paso del polinomio
            de Taylor.
          </div>
        )}

        {!loading && result && steps.length > 0 && (
          <div className="space-y-4">
            <AnimatePresence>
              {steps.map((step, idx) => {
                const { index, content } = parseStep(step);

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    className="relative rounded-2xl border border-[rgb(var(--app-border))] bg-[rgba(var(--app-bg),0.8)] px-4 py-3 shadow-sm"
                  >
                    {index && (
                      <div className="absolute -top-2 -left-2 inline-flex items-center justify-center rounded-full bg-[rgb(var(--app-accent))] text-[11px] font-bold text-[rgb(var(--app-bg))] px-2 py-0.5 shadow">
                        {index}
                      </div>
                    )}

                    {/* Si algo se va MUY largo, scrollea horizontal solo el contenido */}
                    <div className="custom-scroll overflow-x-auto">
                      {renderStepContent(content)}
                    </div>
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
