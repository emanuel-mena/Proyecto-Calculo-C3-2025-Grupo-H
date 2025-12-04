// src/components/InputZone.tsx
import React from "react";
import MathLiveInput from "./MathLiveInput";
import type { TaylorRequestDTO } from "../lib/api/taylorTypes";

interface InputZoneProps {
  latex: string;
  onLatexChange: (latex: string) => void;
  center: number;
  xEval: number;
  order: number;
  setCenter: (value: number) => void;
  setXEval: (value: number) => void;
  setOrder: (value: number) => void;
  loading: boolean;
  error: string | null;
  lastRequest: TaylorRequestDTO | null;
  onAnalyze: () => void;
  onReset: () => void;
}

/**
 * Zona de entrada:
 * - Editor MathLive
 * - Parámetros numéricos (centro, x_eval, orden)
 * - Botones de acción + mensajes de error / metadatos
 */
const InputZone: React.FC<InputZoneProps> = ({
  latex,
  onLatexChange,
  center,
  xEval,
  order,
  setCenter,
  setXEval,
  setOrder,
  loading,
  error,
  lastRequest,
  onAnalyze,
  onReset,
}) => {
  return (
    <div className="bg-[rgb(var(--app-surface))] border border-[rgb(var(--app-border))] rounded-2xl p-4 md:p-5 shadow-lg flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Zona de entrada</h2>

      <p className="text-xs md:text-sm text-[rgb(var(--app-muted))]">
        Aquí el usuario escribe la función en notación matemática. El valor se
        guarda como LaTeX y se envía al endpoint{" "}
        <code className="text-[rgb(var(--app-accent-strong))]">
          /taylor/analyze
        </code>
        .
      </p>

      <MathLiveInput
        initialLatex={latex}
        label="Función f(x) a analizar con Taylor"
        onChangeLatex={onLatexChange}
      />

      {/* Parámetros numéricos básicos */}
      <div className="mt-2 grid grid-cols-3 gap-3 text-xs md:text-sm">
        <div className="flex flex-col gap-1">
          <label className="text-[rgb(var(--app-text))] font-medium">
            Centro (a)
          </label>
          <input
            type="number"
            value={center}
            onChange={(e) => setCenter(Number(e.target.value))}
            className="
              rounded-lg 
              bg-[rgba(var(--app-bg),0.9)] 
              border border-[rgb(var(--app-border))]
              px-2 py-1 
              text-xs md:text-sm 
              outline-none 
              focus:ring-2 
              focus:ring-[rgba(var(--app-accent-strong),0.7)]
            "
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[rgb(var(--app-text))] font-medium">
            x_eval
          </label>
          <input
            type="number"
            value={xEval}
            onChange={(e) => setXEval(Number(e.target.value))}
            className="
              rounded-lg 
              bg-[rgba(var(--app-bg),0.9)] 
              border border-[rgb(var(--app-border))]
              px-2 py-1 
              text-xs md:text-sm 
              outline-none 
              focus:ring-2 
              focus:ring-[rgba(var(--app-accent-strong),0.7)]
            "
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[rgb(var(--app-text))] font-medium">
            Orden (n)
          </label>
          <input
            type="number"
            min={0}
            max={50}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="
              rounded-lg 
              bg-[rgba(var(--app-bg),0.9)] 
              border border-[rgb(var(--app-border))]
              px-2 py-1 
              text-xs md:text-sm 
              outline-none 
              focus:ring-2 
              focus:ring-[rgba(var(--app-accent-strong),0.7)]
            "
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={onAnalyze}
          disabled={loading || !latex.trim()}
          className="
            inline-flex items-center justify-center
            rounded-lg 
            bg-[rgb(var(--app-accent))]
            hover:bg-[rgb(var(--app-accent-soft))]
            px-3 py-1.5 
            text-xs md:text-sm font-medium 
            text-[rgb(var(--app-bg))]
            shadow-sm
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-colors
          "
        >
          {loading ? "Analizando..." : "Analizar con Taylor"}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="
            inline-flex items-center justify-center
            rounded-lg 
            border border-[rgb(var(--app-border))]
            px-3 py-1.5 
            text-xs md:text-sm font-medium 
            text-[rgb(var(--app-text))]
            hover:bg-[rgb(var(--app-surface-soft))]
            transition-colors
          "
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
        <div className="mt-2 text-[11px] text-[rgb(var(--app-muted))] border-t border-[rgb(var(--app-border))] pt-2">
          <div className="font-semibold text-[rgb(var(--app-text))] mb-1">
            Última petición enviada:
          </div>
          <div>
            <span className="font-mono text-[rgb(var(--app-accent-strong))]">
              a ={" "}
            </span>
            {lastRequest.center}{" "}
            <span className="font-mono text-[rgb(var(--app-accent-strong))]">
              , x_eval ={" "}
            </span>
            {lastRequest.x_eval}{" "}
            <span className="font-mono text-[rgb(var(--app-accent-strong))]">
              , orden ={" "}
            </span>
            {lastRequest.order}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputZone;
