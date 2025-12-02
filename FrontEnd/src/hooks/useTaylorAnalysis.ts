// src/hooks/useTaylorAnalysis.ts
import { useCallback, useRef, useState } from "react";
import {
  analyzeTaylor,
  buildTaylorRequest,
} from "../lib/api/taylorApi";
import type {
  TaylorRequestDTO,
  TaylorAnalysisResponseDTO,
} from "../lib/api/taylorTypes";
import { ApiError } from "../lib/api/httpClient";

/**
 * Config inicial para el hook (valores por defecto).
 * No incluye `expression` porque viene del editor.
 */
export type TaylorConfigDefaults = Partial<
  Omit<TaylorRequestDTO, "expression" | "input_is_latex">
> & {
  /** Si true, asumimos que la expresión que llega es LaTeX */
  input_is_latex?: boolean;
};

/**
 * API pública del hook.
 */
export interface UseTaylorAnalysisResult {
  /** Último resultado devuelto por el backend. */
  result: TaylorAnalysisResponseDTO | null;

  /** Última request enviada (payload completo). */
  lastRequest: TaylorRequestDTO | null;

  /** Estado de carga. */
  loading: boolean;

  /** Mensaje de error (ya listo para mostrar en UI) o null. */
  error: string | null;

  /**
   * Dispara el análisis de Taylor a partir de una expresión en LaTeX (o texto).
   * - `latexOrExpr`: expresión de entrada.
   * - `overrides`: permite sobreescribir centre, x_eval, order, etc.
   */
  analyzeFromLatex: (
    latexOrExpr: string,
    overrides?: Partial<TaylorRequestDTO>
  ) => Promise<void>;

  /**
   * Resetea el estado (resultado + error), pero conserva la config por defecto.
   */
  reset: () => void;
}

/**
 * Hook para comunicarse con /taylor/analyze de forma tipada y reutilizable.
 */
export function useTaylorAnalysis(
  defaults: TaylorConfigDefaults = {}
): UseTaylorAnalysisResult {
  const [result, setResult] = useState<TaylorAnalysisResponseDTO | null>(null);
  const [lastRequest, setLastRequest] = useState<TaylorRequestDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guardamos el AbortController actual para cancelar peticiones previas
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setLastRequest(null);
    setError(null);
    // no tocamos defaults ni abortRef
  }, []);

  const analyzeFromLatex = useCallback(
    async (latexOrExpr: string, overrides?: Partial<TaylorRequestDTO>) => {
      // Si hay una request anterior en vuelo, la cancelamos
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        // Construimos el payload completo:
        const effectiveReq: TaylorRequestDTO = buildTaylorRequest({
          // expresión que viene del editor
          expression: latexOrExpr,

          // defaults globales del hook
          center: defaults.center,
          x_eval: defaults.x_eval,
          order: defaults.order,
          input_is_latex: defaults.input_is_latex ?? true,
          plot_min: defaults.plot_min,
          plot_max: defaults.plot_max,
          num_points: defaults.num_points,

          // overrides de esta llamada (tienen prioridad)
          ...overrides,
        });

        setLastRequest(effectiveReq);

        const res = await analyzeTaylor(effectiveReq, controller.signal);
        setResult(res);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Petición cancelada, no mostramos error de usuario
          return;
        }

        console.error("Error calling /taylor/analyze:", err);

        if (err instanceof ApiError) {
          setError(
            typeof err.detail === "string"
              ? err.detail
              : err.message || "Error al llamar a la API de Taylor."
          );
        } else if (err instanceof Error) {
          setError(err.message || "Error inesperado al analizar la función.");
        } else {
          setError("Error desconocido al analizar la función.");
        }
      } finally {
        setLoading(false);
      }
    },
    [defaults.center, defaults.x_eval, defaults.order, defaults.input_is_latex, defaults.plot_min, defaults.plot_max, defaults.num_points]
  );

  return {
    result,
    lastRequest,
    loading,
    error,
    analyzeFromLatex,
    reset,
  };
}

export default useTaylorAnalysis;
