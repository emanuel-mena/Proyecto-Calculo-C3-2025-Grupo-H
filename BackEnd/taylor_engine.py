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

from manual_diff import manual_diff_k  # derivador manual

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
# Helper: envolver LaTeX
# ============================================================

def wrap_latex(expr: str) -> str:
    """Devuelve la expresión envuelta como $...$ para MathLive."""
    return f"${expr}$"


# ============================================================
# Parsing helpers
# ============================================================

def parse_expression(expr_str: str) -> sp.Expr:
    try:
        return sp.sympify(expr_str, locals=_ALLOWED_LOCALS)
    except (sp.SympifyError, TypeError) as e:
        raise ValueError(f"No se pudo parsear la expresión: {expr_str}. Error: {e}")


def parse_expression_from_latex(expr_latex: str) -> sp.Expr:
    try:
        from sympy.parsing.latex import parse_latex
        return parse_latex(expr_latex)
    except Exception:
        return parse_expression(expr_latex)


# ============================================================
# Taylor core
# ============================================================

def factorial(n: int) -> int:
    return math.factorial(n)


def compute_taylor_coefficients(
    sym_expr: sp.Expr,
    center: float,
    order: int,
) -> Tuple[List[float], List[str]]:

    coefs: List[float] = []
    steps: List[str] = []

    for k in range(order + 1):

        # Derivada manual k-ésima
        f_k = manual_diff_k(sym_expr, x, k)

        # Evaluación numérica en a
        f_k_at_a = f_k.subs(x, center)
        f_k_numeric = float(sp.N(f_k_at_a))

        coef_k = f_k_numeric / factorial(k)
        coefs.append(coef_k)

        steps.append(
            f"k={k}: f^{k}(a) = {wrap_latex(str(sp.simplify(f_k)))} "
            f"evaluada en a={wrap_latex(str(center))} → {f_k_numeric}; "
            f"c_{k} = {wrap_latex(f'f^{k}(a)/{k}!')} = {coef_k}"
        )

    return coefs, steps


def evaluate_taylor_poly_with_partials(
    coefs: List[float],
    center: float,
    x_val: float,
) -> Tuple[float, List[float]]:

    dx = x_val - center
    result = 0.0
    power = 1.0
    partials: List[float] = []

    for c in coefs:
        result += c * power
        partials.append(result)
        power *= dx

    return result, partials


def derivative_of_taylor(coefs: List[float], center: float, x_val: float) -> float:
    dx = x_val - center
    total = 0.0
    for k in range(1, len(coefs)):
        total += k * coefs[k] * (dx ** (k - 1))
    return total


def exact_value(sym_expr: sp.Expr, x_val: float) -> Optional[float]:
    try:
        return float(sp.N(sym_expr.subs(x, x_val)))
    except Exception:
        return None


def exact_derivative_value(sym_expr: sp.Expr, x_val: float) -> Optional[float]:
    try:
        f_prime = manual_diff_k(sym_expr, x, 1)
        return float(sp.N(f_prime.subs(x, x_val)))
    except Exception:
        return None


# ============================================================
# Tabla de convergencia
# ============================================================

def build_convergence_table(partials: List[float], exact: Optional[float]):
    table = []
    for k, approx in enumerate(partials):
        if exact is None:
            table.append({
                "order": k, "approx": approx,
                "exact": None, "abs_error": None,
                "rel_error": None, "rel_error_pct": None
            })
        else:
            abs_err = abs(approx - exact)
            rel_err = abs_err / abs(exact) if exact != 0 else None
            table.append({
                "order": k,
                "approx": approx,
                "exact": exact,
                "abs_error": abs_err,
                "rel_error": rel_err,
                "rel_error_pct": rel_err * 100 if rel_err else None
            })
    return table


# ============================================================
# Gráfica
# ============================================================

def plot_function_and_taylor(sym_expr, coefs, center, x_min, x_max, num_points=300):

    f_num = sp.lambdify(x, sym_expr, modules=["numpy"])
    xs = np.linspace(x_min, x_max, num_points)
    try:
        ys_real = f_num(xs)
    except Exception:
        ys_real = np.array([float(sym_expr.subs(x, float(xx))) for xx in xs])

    dxs = xs - center
    powers = np.vstack([dxs**k for k in range(len(coefs))])
    ys_taylor = (np.array(coefs).reshape(-1, 1) * powers).sum(axis=0)

    plt.figure(figsize=(8, 4.5))
    plt.plot(xs, ys_real, label="f(x)")
    plt.plot(xs, ys_taylor, linestyle="--", label="Serie de Taylor")
    plt.axvline(center, color="gray", linestyle=":")
    plt.scatter([center], [coefs[0]])
    plt.legend()
    plt.grid(True)

    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format="png")
    plt.close()
    return base64.b64encode(buf.getvalue()).decode("ascii")


# ============================================================
# API
# ============================================================

def generar_taylor_con_analisis(
    expr_input: str,
    center: float,
    x_eval: float,
    order: int,
    *,
    input_is_latex=True,
    plot_limits=None,
    num_points=300,
):

    steps: List[str] = []

    # 1) Parseo
    if input_is_latex:
        sym_expr = parse_expression_from_latex(expr_input)
        steps.append(
            f"1) Parseada expresión LaTeX: {wrap_latex(expr_input)} "
            f"→ {wrap_latex(str(sym_expr))}"
        )
    else:
        sym_expr = parse_expression(expr_input)
        steps.append(
            f"1) Parseada expresión texto: {wrap_latex(expr_input)} "
            f"→ {wrap_latex(str(sym_expr))}"
        )

    # 2) Coeficientes
    coefs, coef_steps = compute_taylor_coefficients(sym_expr, center, order)
    steps.append("2) Cálculo de coeficientes cₖ = f⁽ᵏ⁾(a) / k!:")
    steps.extend([f"   - {p}" for p in coef_steps])

    # 3) Polinomio simbólico
    poly_sym = sum(sp.N(coefs[k]) * (x - center)**k for k in range(len(coefs)))
    poly_simpl = sp.simplify(poly_sym)
    steps.append(f"3) Polinomio de Taylor: {wrap_latex(str(poly_simpl))}")
    poly_latex = sp.latex(poly_simpl)

    # 4) Evaluación Taylor
    approx_val, partials = evaluate_taylor_poly_with_partials(coefs, center, x_eval)
    steps.append(
        f"4) Evaluado P_{order}({wrap_latex(str(x_eval))}) → {approx_val}"
    )

    # 5) Valor exacto
    f_exact = exact_value(sym_expr, x_eval)
    if f_exact is not None:
        steps.append(
            f"5) Valor exacto f({wrap_latex(str(x_eval))}) = {f_exact}"
        )
    else:
        steps.append("5) No se pudo calcular f(x_eval).")

    # 6) Derivada aproximada y exacta
    deriv_approx = derivative_of_taylor(coefs, center, x_eval)
    steps.append(
        f"6) Derivada aproximada P'({wrap_latex(str(x_eval))}) = {deriv_approx}"
    )

    deriv_exact = exact_derivative_value(sym_expr, x_eval)
    if deriv_exact is not None:
        steps.append(
            f"   Derivada exacta f'({wrap_latex(str(x_eval))}) = {deriv_exact}"
        )
    else:
        steps.append("   No se pudo calcular f'(x_eval).")

    # 7) Errores
    value_errors = {
        "absolute": abs(approx_val - f_exact) if f_exact else None,
        "relative": abs(approx_val - f_exact) / abs(f_exact) if f_exact else None,
    }
    derivative_errors = {
        "absolute": abs(deriv_approx - deriv_exact) if deriv_exact else None,
        "relative": abs(deriv_approx - deriv_exact) / abs(deriv_exact) if deriv_exact else None,
    }

    # 8) Tabla de convergencia
    convergence = build_convergence_table(partials, f_exact)
    steps.append("8) Tabla de convergencia generada.")

    # 9) Gráfica
    if plot_limits is None:
        span = max(1.0, abs(center) + 1.0)
        plot_limits = (center - span, center + span)

    steps.append(
        f"9) Generando gráfica en rango {plot_limits[0]} a {plot_limits[1]}."
    )

    try:
        plot_b64 = plot_function_and_taylor(
            sym_expr, coefs, center,
            plot_limits[0], plot_limits[1],
            num_points,
        )
        steps.append("10) Gráfica generada correctamente.")
    except Exception as e:
        plot_b64 = None
        steps.append(f"10) Error generando gráfica: {e}")

    return {
        "expression_input": expr_input,
        "input_is_latex": input_is_latex,
        "expression_sympy_str": str(sym_expr),
        "center": center,
        "x_eval": x_eval,
        "order": order,
        "coefficients": coefs,
        "polynomial_sympy_str": str(poly_simpl),
        "polynomial_latex": poly_latex,
        "approx_value_at_x": approx_val,
        "exact_value_at_x": f_exact,
        "derivative_approx_at_x": deriv_approx,
        "derivative_exact_at_x": deriv_exact,
        "value_errors": value_errors,
        "derivative_errors": derivative_errors,
        "convergence_table": convergence,
        "plot_base64_png": plot_b64,
        "steps": steps,
    }
