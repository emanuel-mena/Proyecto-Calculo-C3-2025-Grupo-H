// src/lib/api/taylorApi.ts

import { apiFetchJson } from "./httpClient";
import type {
  TaylorRequestDTO,
  TaylorAnalysisResponseDTO,
} from "./taylorTypes";

/**
 * Crea un payload completo para el backend, aplicando defaults
 * para campos opcionales si hiciera falta.
 */
export function buildTaylorRequest(
  partial: Partial<TaylorRequestDTO> & {
    expression: string;
  }
): TaylorRequestDTO {
  return {
    expression: partial.expression,
    center: partial.center ?? 0.0,
    x_eval: partial.x_eval ?? 0.0,
    order: partial.order ?? 5,
    input_is_latex: partial.input_is_latex ?? true,
    plot_min: partial.plot_min ?? null,
    plot_max: partial.plot_max ?? null,
    num_points: partial.num_points ?? 300,
  };
}

/**
 * Llama al endpoint /taylor/analyze del backend.
 */
export async function analyzeTaylor(
  req: TaylorRequestDTO,
  signal?: AbortSignal
): Promise<TaylorAnalysisResponseDTO> {
  return apiFetchJson<TaylorAnalysisResponseDTO, TaylorRequestDTO>(
    "/taylor/analyze",
    {
      method: "POST",
      body: req,
      signal,
    }
  );
}
