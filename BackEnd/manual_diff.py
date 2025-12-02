# manual_diff.py
"""
Motor de derivación simbólica "a mano" usando reglas clásicas de cálculo,
sin utilizar sympy.diff ni ninguna función de derivación/integración
preexistente.

Trabaja sobre árboles de expresiones de SymPy (sp.Expr), aplicando reglas:

- d/dx (c) = 0
- d/dx (x) = 1
- d/dx (u + v) = u' + v'
- d/dx (u - v) = u' - v'
- d/dx (u * v) = u' * v + u * v'
- d/dx (u / v) = (u'v - uv') / v²   (implícito via producto + potencia negativa)
- d/dx (u^n) = n*u^(n-1)*u'   (n constante)
- d/dx (u^v) = u^v * (v' * ln(u) + v * u'/u)   (caso general)
- d/dx sin(u) = cos(u) * u'
- d/dx cos(u) = -sin(u) * u'
- d/dx tan(u) = u' / cos(u)^2
- d/dx exp(u) = exp(u) * u'
- d/dx log(u) = u' / u
- d/dx sqrt(u) = u' / (2*sqrt(u))
- d/dx asin(u) = u' / sqrt(1 - u^2)
- d/dx acos(u) = -u' / sqrt(1 - u^2)
- d/dx atan(u) = u' / (1 + u^2)
- d/dx sinh(u) = cosh(u) * u'
- d/dx cosh(u) = sinh(u) * u'
- d/dx tanh(u) = u' / cosh(u)^2
"""

from __future__ import annotations

from typing import Iterable

import sympy as sp


# ---------------------------------------------------------------------------
# Utilidades internas
# ---------------------------------------------------------------------------

def _is_constant_wrt(expr: sp.Expr, var: sp.Symbol) -> bool:
    """Devuelve True si expr no depende de var (no aparece en free_symbols)."""
    return var not in expr.free_symbols


def _product(exprs: Iterable[sp.Expr]) -> sp.Expr:
    """Producto seguro de una colección de expresiones (1 si está vacía)."""
    exprs = list(exprs)
    if not exprs:
        return sp.Integer(1)
    result = sp.Integer(1)
    for e in exprs:
        result *= e
    return result


# ---------------------------------------------------------------------------
# Derivada una vez: manual_diff_once
# ---------------------------------------------------------------------------

def manual_diff_once(expr: sp.Expr, var: sp.Symbol) -> sp.Expr:
    """
    Calcula la derivada d/d(var) de `expr` aplicando reglas de derivación
    básicas sobre el árbol de SymPy, sin usar sympy.diff.
    """
    # 1) Casos básicos: constante, variable
    if expr.is_Number:
        # Derivada de una constante: 0
        return sp.Integer(0)

    if expr.is_Symbol:
        # d/dx x = 1, d/dx a (a ≠ x) = 0
        return sp.Integer(1) if expr == var else sp.Integer(0)

    # Si no depende de var, su derivada es 0
    if _is_constant_wrt(expr, var):
        return sp.Integer(0)

    # 2) Suma / resta
    if expr.is_Add:
        return sum(manual_diff_once(arg, var) for arg in expr.args)

    # 3) Producto
    if expr.is_Mul:
        # Regla del producto generalizada:
        # d/dx (a*b*c) = a'*b*c + a*b'*c + a*b*c' + ...
        terms = []
        args = list(expr.args)
        n = len(args)
        for i in range(n):
            d_arg_i = manual_diff_once(args[i], var)
            other_factors = [args[j] if j != i else d_arg_i for j in range(n)]
            terms.append(_product(other_factors))
        return sum(terms)

    # 4) Potencia: expr = base ** exp
    if isinstance(expr, sp.Pow):
        base, exponent = expr.as_base_exp()

        # Caso base: exponente constante
        if exponent.is_Number and not exponent.free_symbols:
            # d/dx (u^n) = n*u^(n-1)*u'
            u = base
            n = exponent
            du = manual_diff_once(u, var)
            return n * (u ** (n - 1)) * du

        # Caso general: u^v
        u = base
        v = exponent
        du = manual_diff_once(u, var)
        dv = manual_diff_once(v, var)
        return expr * (dv * sp.log(u) + v * du / u)

    # 5) Funciones elementales unarias: sin, cos, tan, exp, log, sqrt, etc.
    if isinstance(expr, sp.Function):
        f = expr.func
        args = expr.args

        if len(args) != 1:
            raise NotImplementedError(
                f"No se ha implementado la derivada manual para funciones de aridad {len(args)}: {expr}"
            )

        u = args[0]
        du = manual_diff_once(u, var)

        # Trigonométricas
        if f is sp.sin:
            return sp.cos(u) * du
        if f is sp.cos:
            return -sp.sin(u) * du
        if f is sp.tan:
            # sec^2(u) = 1/cos(u)^2
            return du / (sp.cos(u) ** 2)

        # Exponenciales y logaritmos
        if f is sp.exp:
            return sp.exp(u) * du
        if f is sp.log:
            return du / u
        if f is sp.sqrt:
            return du / (2 * sp.sqrt(u))

        # Inversas trigonométricas
        if f is sp.asin:
            return du / sp.sqrt(1 - u**2)
        if f is sp.acos:
            return -du / sp.sqrt(1 - u**2)
        if f is sp.atan:
            return du / (1 + u**2)

        # Hiperbólicas
        if f is sp.sinh:
            return sp.cosh(u) * du
        if f is sp.cosh:
            return sp.sinh(u) * du
        if f is sp.tanh:
            return du / (sp.cosh(u) ** 2)

        # Si llega aquí, es una función que no hemos implementado
        raise NotImplementedError(
            f"No se ha implementado la derivada manual para la función: {expr.func}"
        )

    # 6) Caso por defecto: no sabemos derivar esta estructura
    raise NotImplementedError(
        f"No se ha implementado la derivada manual para la expresión: {repr(expr)}"
    )


# ---------------------------------------------------------------------------
# Derivada k-ésima: manual_diff_k
# ---------------------------------------------------------------------------

def manual_diff_k(expr: sp.Expr, var: sp.Symbol, k: int) -> sp.Expr:
    """
    Calcula la derivada k-ésima de `expr` respecto a `var` utilizando
    manual_diff_once de manera iterativa.

    - k = 0  -> f(x)
    - k = 1  -> f'(x)
    - k = 2  -> f''(x)
    - ...
    """
    if k < 0:
        raise ValueError("El orden de derivación k debe ser >= 0")

    result = expr
    for _ in range(k):
        result = manual_diff_once(result, var)

    return result


# ---------------------------------------------------------------------------
# (Opcional) Conjunto de funciones soportadas (para documentación / debug)
# ---------------------------------------------------------------------------

SUPPORTED_FUNCTIONS = {
    "sin": sp.sin,
    "cos": sp.cos,
    "tan": sp.tan,
    "exp": sp.exp,
    "log": sp.log,
    "sqrt": sp.sqrt,
    "asin": sp.asin,
    "acos": sp.acos,
    "atan": sp.atan,
    "sinh": sp.sinh,
    "cosh": sp.cosh,
    "tanh": sp.tanh,
}
