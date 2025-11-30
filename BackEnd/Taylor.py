# backend/taylor.py
"""
Generador de Taylor con pasos detallados para devolver al frontend.

Devuelve:
 - coefficients: lista de coeficientes numéricos c_k
 - polynomial_str: representación simbólica (texto) del polinomio
 - approx_value_at_x: P_n(x_eval)
 - derivative_approx_at_x: P_n'(x_eval)
 - derivative_exact_at_x: f'(x_eval) si es posible (sino None)
 - errors: { absolute, relative } respecto a derivada exacta
 - plot_base64_png: la gráfica en base64 (string)
 - steps: lista de strings con el algoritmo paso a paso (valores numéricos)
"""
from typing import List, Dict, Optional, Tuple
import io
import base64
import math

import numpy as np
import matplotlib.pyplot as plt
import sympy as sp

# variable simbólica global
x = sp.symbols('x')

# parseo seguro (añadir funciones que quieras permitir)
_ALLOWED_LOCALS = {
    "sin": sp.sin, "cos": sp.cos, "tan": sp.tan,
    "exp": sp.exp, "log": sp.log, "sqrt": sp.sqrt
}


def factorial(n: int) -> int:
    return math.factorial(n)


def parse_expression(expr_str: str) -> sp.Expr:
    try:
        expr = sp.sympify(expr_str, locals=_ALLOWED_LOCALS)
        return expr
    except (sp.SympifyError, TypeError) as e:
        raise ValueError(f"No se pudo parsear la expresión: {expr_str}. Error: {e}")


def compute_taylor_coefficients(sym_expr: sp.Expr, center: float, order: int) -> Tuple[List[float], List[str]]:
    """
    Devuelve (coeficientes, pasos_coeficientes)
    coeficientes: [c0, c1, ...]
    pasos_coeficientes: explicaciones textuales por cada coeficiente
    """
    coefs: List[float] = []
    pasos: List[str] = []

    for k in range(order + 1):
        f_k = sp.diff(sym_expr, (x, k))                # derivada k-ésima simbólica
        f_k_at_a = f_k.subs(x, center)                 # evaluada en el centro a
        try:
            f_k_numeric = float(sp.N(f_k_at_a))
        except Exception:
            f_k_numeric = float(sp.N(sp.N(f_k_at_a, 15)))
        coef_k = f_k_numeric / factorial(k)
        coefs.append(coef_k)

        pasos.append(
            f"k={k}: f^{k}(a) = {sp.simplify(f_k)} evaluada en a={center} -> {f_k_numeric}; "
            f"c_{k} = f^{k}(a)/{k}! = {coef_k}"
        )

    return coefs, pasos


def evaluate_taylor_poly(coefs: List[float], center: float, x_val: float) -> float:
    dx = x_val - center
    result = 0.0
    power = 1.0
    for c in coefs:
        result += c * power
        power *= dx
    return result


def derivative_of_taylor(coefs: List[float], center: float, x_val: float) -> float:
    dx = x_val - center
    result = 0.0
    for k in range(1, len(coefs)):
        result += k * coefs[k] * (dx ** (k - 1))
    return result


def exact_derivative_value(sym_expr: sp.Expr, x_val: float) -> Optional[float]:
    try:
        f_prime = sp.diff(sym_expr, x)
        f_prime_at = f_prime.subs(x, x_val)
        return float(sp.N(f_prime_at))
    except Exception:
        return None


def plot_function_and_taylor(sym_expr: sp.Expr, coefs: List[float], center: float,
                             x_min: float, x_max: float, num_points: int = 300) -> str:
    # lambdify
    f_num = sp.lambdify(x, sym_expr, modules=["numpy"])
    xs = np.linspace(x_min, x_max, num_points)

    try:
        ys_real = f_num(xs)
    except Exception:
        ys_real = np.array([float(sp.N(sym_expr.subs(x, float(xx)))) for xx in xs], dtype=float)

    dxs = xs - center
    powers = np.vstack([dxs ** k for k in range(len(coefs))])
    coefs_arr = np.array(coefs).reshape((-1, 1))
    ys_taylor = (coefs_arr * powers).sum(axis=0)

    plt.figure(figsize=(8, 4.5))
    plt.plot(xs, ys_real, label="f(x) real")
    plt.plot(xs, ys_taylor, label=f"P_n(x) Taylor (n={len(coefs)-1})", linestyle='--')
    plt.axvline(center, color='gray', linewidth=0.7, linestyle=':', label=f"centro a={center}")
    plt.scatter([center], [evaluate_taylor_poly(coefs, center, center)], s=40)
    plt.legend()
    plt.xlabel("x")
    plt.ylabel("y")
    plt.grid(True)

    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    img_bytes = buf.read()
    img_b64 = base64.b64encode(img_bytes).decode('ascii')
    return img_b64


def generar_taylor_con_pasos(expr_str: str, center: float, x_eval: float, order: int,
                             plot_limits: Optional[Tuple[float, float]] = None,
                             num_points: int = 300) -> Dict:
    pasos: List[str] = []
    # 1) parsear
    sym_expr = parse_expression(expr_str)
    pasos.append(f"1) Parseada la expresión: '{expr_str}' -> {sym_expr}")

    # 2) coeficientes y pasos de coeficientes
    coefs, pasos_coef = compute_taylor_coefficients(sym_expr, center, order)
    pasos.append("2) Cálculo de coeficientes c_k = f^{(k)}(a)/k!:")
    pasos.extend([f"   - {p}" for p in pasos_coef])

    # 3) construir representación simbólica del polinomio (para mostrar)
    # crear expresión simbólica de P_n(x) usando coeficientes numéricos
    poly_sym = sum([sp.N(coefs[k]) * (x - center) ** k for k in range(len(coefs))])
    poly_sym_simpl = sp.simplify(poly_sym)
    pasos.append(f"3) Polinomio de Taylor (simbolico): {poly_sym_simpl}")

    # 4) evaluar P_n en x_eval
    approx_val = evaluate_taylor_poly(coefs, center, x_eval)
    pasos.append(f"4) Evaluado P_{order} en x={x_eval} -> {approx_val}")

    # 5) derivada aproximada P_n'(x_eval)
    deriv_approx = derivative_of_taylor(coefs, center, x_eval)
    pasos.append(f"5) Derivada aproximada P_{order}'(x) evaluada en x={x_eval} -> {deriv_approx}")

    # 6) derivada exacta (si se puede)
    deriv_exact = exact_derivative_value(sym_expr, x_eval)
    if deriv_exact is not None:
        pasos.append(f"6) Derivada exacta simbólica f'(x) evaluada en x={x_eval} -> {deriv_exact}")
    else:
        pasos.append("6) No fue posible calcular simbólicamente la derivada exacta.")

    # 7) errores
    if deriv_exact is not None:
        abs_err = abs(deriv_approx - deriv_exact)
        rel_err = abs_err / (abs(deriv_exact) + 1e-16)
        pasos.append(f"7) Errores: absoluto = {abs_err}, relativo = {rel_err}")
        errores = {"absolute": abs_err, "relative": rel_err}
    else:
        errores = {"absolute": None, "relative": None}

    # 8) preparar límites de la gráfica
    if plot_limits is None:
        span = max(1.0, abs(center) + 1.0)
        x_min, x_max = center - span, center + span
    else:
        x_min, x_max = plot_limits

    pasos.append(f"8) Generando gráfica en rango [{x_min}, {x_max}] con {num_points} puntos.")
    # 9) generar grafica
    try:
        plot_b64 = plot_function_and_taylor(sym_expr, coefs, center, x_min, x_max, num_points=num_points)
        pasos.append("9) Gráfica generada exitosamente (base64).")
    except Exception as e:
        plot_b64 = None
        pasos.append(f"9) No se pudo generar la gráfica: {e}")

    # devolver todo
    return {
        "expression": expr_str,
        "center": center,
        "x_eval": x_eval,
        "order": order,
        "coefficients": coefs,
        "polynomial_str": str(poly_sym_simpl),
        "approx_value_at_x": approx_val,
        "derivative_approx_at_x": deriv_approx,
        "derivative_exact_at_x": deriv_exact,
        "errors": errores,
        "plot_base64_png": plot_b64,
        "steps": pasos
    }
