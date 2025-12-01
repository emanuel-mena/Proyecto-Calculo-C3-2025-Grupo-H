# taylor_engine.py
from typing import List, Dict, Optional, Tuple
import io
import base64
import math

import matplotlib
matplotlib.use("Agg")  # backend sin interfaz gráfica (para servidores)
import matplotlib.pyplot as plt
import numpy as np
import sympy as sp

# Variable simbólica global
x = sp.symbols("x")

# Funciones permitidas al parsear texto
_ALLOWED_LOCALS = {
    "sin": sp.sin,
    "cos": sp.cos,
    "tan": sp.tan,
    "exp": sp.exp,
    "log": sp.log,
    "sqrt": sp.sqrt,
}


# ============================================================
# Parsing helpers
# ============================================================

def parse_expression(expr_str: str) -> sp.Expr:
    """
    Parseo de expresión tipo texto SymPy-like, ej: 'sin(x) + x**2'.
    """
    try:
        return sp.sympify(expr_str, locals=_ALLOWED_LOCALS)
    except (sp.SympifyError, TypeError) as e:
        raise ValueError(f"No se pudo parsear la expresión: {expr_str}. Error: {e}")


def parse_expression_from_latex(expr_latex: str) -> sp.Expr:
    """
    Intenta parsear LaTeX hacia una expresión SymPy.
    Si falla, intenta interpretarla como texto normal.
    """
    try:
        from sympy.parsing.latex import parse_latex
        return parse_latex(expr_latex)
    except Exception as e:
        print(e)
        return parse_expression(expr_latex)


# ============================================================
# Taylor core: coeficientes y evaluaciones
# ============================================================

def factorial(n: int) -> int:
    return math.factorial(n)


def compute_taylor_coefficients(
    sym_expr: sp.Expr,
    center: float,
    order: int,
) -> Tuple[List[float], List[str]]:
    """
    Devuelve:
      - coefs: [c0, c1, ..., c_order]
      - steps: explicaciones textuales por coeficiente.
    """
    coefs: List[float] = []
    steps: List[str] = []

    for k in range(order + 1):
        f_k = sp.diff(sym_expr, (x, k))    # k-ésima derivada
        f_k_at_a = f_k.subs(x, center)     # evaluada en a
        try:
            f_k_numeric = float(sp.N(f_k_at_a))
        except Exception:
            f_k_numeric = float(sp.N(sp.N(f_k_at_a, 15)))

        coef_k = f_k_numeric / factorial(k)
        coefs.append(coef_k)

        steps.append(
            f"k={k}: f^{k}(a) = {sp.simplify(f_k)} evaluada en a={center} -> {f_k_numeric}; "
            f"c_{k} = f^{k}(a)/{k}! = {coef_k}"
        )

    return coefs, steps


def evaluate_taylor_poly_with_partials(
    coefs: List[float],
    center: float,
    x_val: float,
) -> Tuple[float, List[float]]:
    """
    Evalúa P_n(x) = Σ c_k (x-a)^k y también devuelve todas las sumas parciales:

      partials[k] = P_k(x)

    Esto es lo que nos permite “ver la convergencia” término a término.
    """
    dx = x_val - center
    result = 0.0
    power = 1.0
    partials: List[float] = []

    for c in coefs:
        result += c * power
        partials.append(result)
        power *= dx

    return result, partials


def derivative_of_taylor(
    coefs: List[float],
    center: float,
    x_val: float,
) -> float:
    """
    Derivada del polinomio de Taylor:

      P_n'(x) = Σ_{k=1..n} k * c_k * (x-a)^{k-1}
    """
    dx = x_val - center
    result = 0.0
    for k in range(1, len(coefs)):
        result += k * coefs[k] * (dx ** (k - 1))
    return result


def exact_value(sym_expr: sp.Expr, x_val: float) -> Optional[float]:
    try:
        f_at = sym_expr.subs(x, x_val)
        return float(sp.N(f_at))
    except Exception:
        return None


def exact_derivative_value(sym_expr: sp.Expr, x_val: float) -> Optional[float]:
    try:
        f_prime = sp.diff(sym_expr, x)
        f_prime_at = f_prime.subs(x, x_val)
        return float(sp.N(f_prime_at))
    except Exception:
        return None


# ============================================================
# Tabla de convergencia
# ============================================================

def build_convergence_table(
    partials: List[float],
    exact: Optional[float],
) -> List[Dict[str, Optional[float]]]:
    """
    Construye una tabla describiendo la convergencia de P_k(x) -> f(x).

    Cada fila:
      {
        "order": k,
        "approx": P_k(x),
        "exact": f(x) o None,
        "abs_error": ... o None,
        "rel_error": ... o None,
        "rel_error_pct": ... o None
      }
    """
    table: List[Dict[str, Optional[float]]] = []

    for k, approx in enumerate(partials):
        if exact is None:
            row = {
                "order": k,
                "approx": approx,
                "exact": None,
                "abs_error": None,
                "rel_error": None,
                "rel_error_pct": None,
            }
        else:
            abs_err = abs(approx - exact)
            if exact != 0:
                rel_err = abs_err / abs(exact)
                rel_pct = rel_err * 100.0
            else:
                rel_err = None
                rel_pct = None

            row = {
                "order": k,
                "approx": approx,
                "exact": exact,
                "abs_error": abs_err,
                "rel_error": rel_err,
                "rel_error_pct": rel_pct,
            }

        table.append(row)

    return table


# ============================================================
# Gráfica
# ============================================================

def plot_function_and_taylor(
    sym_expr: sp.Expr,
    coefs: List[float],
    center: float,
    x_min: float,
    x_max: float,
    num_points: int = 300,
) -> str:
    """
    Devuelve un PNG en base64 con f(x) y su polinomio de Taylor P_n(x).
    """
    f_num = sp.lambdify(x, sym_expr, modules=["numpy"])
    xs = np.linspace(x_min, x_max, num_points)

    try:
        ys_real = f_num(xs)
    except Exception:
        ys_real = np.array(
            [float(sp.N(sym_expr.subs(x, float(xx)))) for xx in xs],
            dtype=float,
        )

    dxs = xs - center
    powers = np.vstack([dxs ** k for k in range(len(coefs))])
    coefs_arr = np.array(coefs).reshape((-1, 1))
    ys_taylor = (coefs_arr * powers).sum(axis=0)

    plt.figure(figsize=(8, 4.5))
    plt.plot(xs, ys_real, label="f(x) real")
    plt.plot(
        xs,
        ys_taylor,
        label=f"P_n(x) Taylor (n={len(coefs) - 1})",
        linestyle="--",
    )
    plt.axvline(
        center,
        color="gray",
        linewidth=0.7,
        linestyle=":",
        label=f"centro a={center}",
    )
    # En x = a, P_n(a) ≈ f(a) ≈ c0
    plt.scatter([center], [coefs[0]], s=40)
    plt.legend()
    plt.xlabel("x")
    plt.ylabel("y")
    plt.grid(True)

    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)
    img_bytes = buf.read()
    img_b64 = base64.b64encode(img_bytes).decode("ascii")
    return img_b64


# ============================================================
# API de alto nivel para FastAPI
# ============================================================

def generar_taylor_con_analisis(
    expr_input: str,
    center: float,
    x_eval: float,
    order: int,
    *,
    input_is_latex: bool = True,
    plot_limits: Optional[Tuple[float, float]] = None,
    num_points: int = 300,
) -> Dict:
    """
    Punto de entrada principal para el backend.

    - expr_input: LaTeX (por defecto) o texto tipo 'sin(x)+x**2'
    - center: a
    - x_eval: punto donde se evalúan P_n(x), f(x), P_n'(x), f'(x)
    - order: orden del polinomio de Taylor
    - input_is_latex: si False, expr_input se interpreta como texto normal.
    """
    steps: List[str] = []

    # 1) Parseo de la expresión
    if input_is_latex:
        sym_expr = parse_expression_from_latex(expr_input)
        steps.append(f"1) Parseada la expresión LaTeX: '{expr_input}' -> {sym_expr}")
    else:
        sym_expr = parse_expression(expr_input)
        steps.append(f"1) Parseada la expresión texto: '{expr_input}' -> {sym_expr}")

    # 2) Coeficientes de Taylor
    coefs, coef_steps = compute_taylor_coefficients(sym_expr, center, order)
    steps.append("2) Cálculo de coeficientes c_k = f^{(k)}(a)/k!:")
    steps.extend([f"   - {p}" for p in coef_steps])

    # 3) Polinomio simbólico
    poly_sym = sum([sp.N(coefs[k]) * (x - center) ** k for k in range(len(coefs))])
    poly_sym_simpl = sp.simplify(poly_sym)
    steps.append(f"3) Polinomio de Taylor (simbólico): {poly_sym_simpl}")
    poly_latex = sp.latex(poly_sym_simpl)

    # 4) Evaluación de P_n(x_eval) y sumas parciales
    approx_val, partials = evaluate_taylor_poly_with_partials(coefs, center, x_eval)
    steps.append(f"4) Evaluado P_{order}(x) en x={x_eval} -> {approx_val}")

    # 4.b) Valor exacto f(x_eval)
    f_exact_at_x = exact_value(sym_expr, x_eval)
    if f_exact_at_x is not None:
        steps.append(f"4.b) Valor exacto f(x_eval) en x={x_eval} -> {f_exact_at_x}")
    else:
        steps.append("4.b) No fue posible calcular f(x_eval) de forma exacta.")

    # 5) Derivada aproximada via Taylor
    deriv_approx = derivative_of_taylor(coefs, center, x_eval)
    steps.append(
        f"5) Derivada aproximada P_{order}'(x) evaluada en x={x_eval} -> {deriv_approx}"
    )

    # 6) Derivada exacta
    deriv_exact = exact_derivative_value(sym_expr, x_eval)
    if deriv_exact is not None:
        steps.append(
            f"6) Derivada exacta f'(x) evaluada en x={x_eval} -> {deriv_exact}"
        )
    else:
        steps.append("6) No fue posible calcular simbólicamente la derivada exacta.")

    # 7) Errores para la derivada
    if deriv_exact is not None:
        abs_err_deriv = abs(deriv_approx - deriv_exact)
        rel_err_deriv = abs_err_deriv / (abs(deriv_exact) + 1e-16)
        steps.append(
            f"7) Errores de la derivada: absoluto = {abs_err_deriv}, relativo = {rel_err_deriv}"
        )
        derivative_errors = {
            "absolute": abs_err_deriv,
            "relative": rel_err_deriv,
        }
    else:
        derivative_errors = {"absolute": None, "relative": None}

    # 7.b) Errores para el valor de la función
    if f_exact_at_x is not None:
        abs_err_val = abs(approx_val - f_exact_at_x)
        rel_err_val = abs_err_val / (abs(f_exact_at_x) + 1e-16)
        steps.append(
            f"7.b) Errores del valor: absoluto = {abs_err_val}, relativo = {rel_err_val}"
        )
        value_errors = {
            "absolute": abs_err_val,
            "relative": rel_err_val,
        }
    else:
        value_errors = {"absolute": None, "relative": None}

    # 8) Tabla de convergencia P_k(x) -> f(x)
    convergence_table = build_convergence_table(partials, f_exact_at_x)
    steps.append("8) Tabla de convergencia generada para P_k(x).")

    # 9) Rango de la gráfica
    if plot_limits is None:
        span = max(1.0, abs(center) + 1.0)
        x_min, x_max = center - span, center + span
    else:
        x_min, x_max = plot_limits

    steps.append(
        f"9) Generando gráfica en rango [{x_min}, {x_max}] con {num_points} puntos."
    )

    # 10) Gráfica
    try:
        plot_b64 = plot_function_and_taylor(
            sym_expr, coefs, center, x_min, x_max, num_points
        )
        steps.append("10) Gráfica generada exitosamente (base64).")
    except Exception as e:
        plot_b64 = None
        steps.append(f"10) No se pudo generar la gráfica: {e}")

    # Payload final para FastAPI / frontend
    return {
        "expression_input": expr_input,
        "input_is_latex": input_is_latex,
        "expression_sympy_str": str(sym_expr),
        "center": center,
        "x_eval": x_eval,
        "order": order,
        "coefficients": coefs,
        "polynomial_sympy_str": str(poly_sym_simpl),
        "polynomial_latex": poly_latex,
        "approx_value_at_x": approx_val,
        "exact_value_at_x": f_exact_at_x,
        "derivative_approx_at_x": deriv_approx,
        "derivative_exact_at_x": deriv_exact,
        "value_errors": value_errors,
        "derivative_errors": derivative_errors,
        "convergence_table": convergence_table,
        "plot_base64_png": plot_b64,
        "steps": steps,
    }
