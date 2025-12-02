// src/lib/api/taylorTypes.ts

export interface TaylorRequestDTO {
  /** Expresión de entrada. Puede ser LaTeX o texto tipo SymPy. */
  expression: string;

  /** Centro de la expansión de Taylor (a). */
  center: number;

  /** Punto donde se evalúan P_n(x), f(x), P_n'(x), f'(x). */
  x_eval: number;

  /** Orden del polinomio de Taylor (n). */
  order: number;

  /** Si es true, 'expression' se interpreta como LaTeX. */
  input_is_latex: boolean;

  /** Límite inferior del rango de la gráfica (opcional). */
  plot_min?: number | null;

  /** Límite superior del rango de la gráfica (opcional). */
  plot_max?: number | null;

  /** Número de puntos para la gráfica. */
  num_points: number;
}

export interface ErrorMetricsDTO {
  absolute: number | null;
  relative: number | null;
}

export interface ConvergenceRowDTO {
  order: number;
  approx: number;
  exact: number | null;
  abs_error: number | null;
  rel_error: number | null;
  rel_error_pct: number | null;
}

export interface TaylorAnalysisResponseDTO {
  expression_input: string;
  input_is_latex: boolean;
  expression_sympy_str: string;
  center: number;
  x_eval: number;
  order: number;

  coefficients: number[];

  polynomial_sympy_str: string;
  polynomial_latex: string;

  approx_value_at_x: number | null;
  exact_value_at_x: number | null;

  derivative_approx_at_x: number | null;
  derivative_exact_at_x: number | null;

  value_errors: ErrorMetricsDTO;
  derivative_errors: ErrorMetricsDTO;

  convergence_table: ConvergenceRowDTO[];

  /** PNG en base64 (opcional, puede venir null). */
  plot_base64_png: string | null;

  /** Lista de pasos textuales generados por el motor. */
  steps: string[];
}
