import math
from typing import List
from tabulate import tabulate
import time

# ============================================================
#   DERIVADAS SEGÚN LA FUNCIÓN
# ============================================================

# TAMBIEN PODEMOS HACER LA DE cos(), ln(1+x), 1/(1+x), es opcional.

def derivada_seno(numero_derivada: int, punto_centro: float) -> float:
    """
    Devuelve la k-ésima derivada de sin(x), evaluada en el punto 'punto_centro'.
    """
    patron = numero_derivada % 4

    if patron == 0:
        return math.sin(punto_centro)
    elif patron == 1:
        return math.cos(punto_centro)
    elif patron == 2:
        return -math.sin(punto_centro)
    else:  # patron == 3
        return -math.cos(punto_centro)

def derivada_euler_exponencial(numero_derivada: int, punto_centro: float) -> float:
    """
    Devuelve la k-ésima derivada de e^x evaluada en 'punto_centro'.
    Todas las derivadas de e^x son e^x.
    """
    return math.exp(punto_centro)

def derivada_polinomio_cuadratico(
    numero_derivada: int,
    punto_centro: float,
    coeficiente_cuadratico: float,
    coeficiente_lineal: float,
    termino_constante: float
) -> float:
    """
    Derivadas de un polinomio cuadrático:
    p(x) = ax^2 + bx + c
    """
    if numero_derivada == 0:
        return coeficiente_cuadratico * punto_centro**2 + coeficiente_lineal * punto_centro + termino_constante
    elif numero_derivada == 1:
        return 2 * coeficiente_cuadratico * punto_centro + coeficiente_lineal
    elif numero_derivada == 2:
        return 2 * coeficiente_cuadratico
    else:
        return 0.0
    
def derivada_polinomio_cubico(
    numero_derivada: int,
    punto_centro: float,
    coeficiente_cubico: float,
    coeficiente_cuadratico: float,
    coeficiente_lineal: float,
    termino_constante: float
) -> float:
    """
    Derivadas de un polinomio cuadrático:
    p(x) = ax^3 + bx^2 + cx + d
    """
    if numero_derivada == 0:
        return coeficiente_cubico * punto_centro**3 + coeficiente_cuadratico * punto_centro**2 + coeficiente_lineal * punto_centro + termino_constante
    elif numero_derivada == 1:
        return 3 * coeficiente_cubico * punto_centro**2 + 2 * coeficiente_cuadratico * punto_centro + coeficiente_lineal
    elif numero_derivada == 2:
        return 6 * coeficiente_cubico * punto_centro + 2 * coeficiente_cuadratico
    elif numero_derivada == 3:
        return 6 * coeficiente_cubico
    else:
        return 0.0
    
def derivada_polinomio_cuartico(
    numero_derivada: int,
    punto_centro: float,
    coeficiente_cuartico: float,
    coeficiente_cubico: float,
    coeficiente_cuadratico: float,
    coeficiente_lineal: float,
    termino_constante: float
) -> float:
    """
    Derivadas de un polinomio cuadrático:
    p(x) = ax^4 + bx^3 + cx^2 + dx + e
    """

    if numero_derivada == 0:
        return (coeficiente_cuartico * punto_centro**4 + coeficiente_cubico * punto_centro**3 +
                coeficiente_cuadratico * punto_centro**2 + coeficiente_lineal * punto_centro + termino_constante)
    elif numero_derivada == 1:
        return (4 * coeficiente_cuartico * punto_centro**3 + 3 * coeficiente_cubico * punto_centro**2 +
                2 * coeficiente_cuadratico * punto_centro + coeficiente_lineal)
    elif numero_derivada == 2:
        return (12 * coeficiente_cuartico * punto_centro**2 + 6 * coeficiente_cubico * punto_centro +
                2 * coeficiente_cuadratico)
    elif numero_derivada == 3:
        return (24 * coeficiente_cuartico * punto_centro + 6 * coeficiente_cubico)
    elif numero_derivada == 4:
        return 24 * coeficiente_cuartico
    else:
        return 0.0

# ============================================================
#   FACTORIAL
# ============================================================

def factorial(numero: int) -> int:
    """Calcula el factorial de forma iterativa."""
    resultado = 1
    for i in range(2, numero + 1):
        resultado *= i
    return resultado

# ============================================================
#   CÁLCULO DE COEFICIENTES DE TAYLOR
# ============================================================

def calcular_coeficientes_taylor_sin(
    punto_centro: float,
    orden_taylor: int,
) -> List[float]:
    """
    Calcula los coeficientes del polinomio de Taylor para sin(x).
    Devuelve una lista [c0, c1, ..., cn].
    """
    coeficientes_taylor: List[float] = []

    for numero_derivada in range(orden_taylor + 1):
        valor_derivada = derivada_seno(numero_derivada, punto_centro)
        coeficiente_k = valor_derivada / factorial(numero_derivada)
        coeficientes_taylor.append(coeficiente_k)

    return coeficientes_taylor

def calcular_coeficientes_taylor_exp(
    punto_centro: float,
    orden_taylor: int,
) -> List[float]:
    """
    Calcula los coeficientes del polinomio de Taylor para exp(x).
    Devuelve una lista [c0, c1, ..., cn].
    """
    coeficientes_taylor: List[float] = []

    for numero_derivada in range(orden_taylor + 1):
        valor_derivada = derivada_euler_exponencial(numero_derivada, punto_centro)
        coeficiente_k = valor_derivada / factorial(numero_derivada)
        coeficientes_taylor.append(coeficiente_k)

    return coeficientes_taylor

def calcular_coeficientes_taylor_polinomio(
    punto_centro: float,
    orden_taylor: int,
    coeficiente_cuadratico: float,
    coeficiente_lineal: float,
    termino_constante: float
) -> List[float]:
    """
    Calcula los coeficientes de Taylor del polinomio p(x) = ax^2 + bx + c.
    """
    coeficientes_taylor: List[float] = []

    for numero_derivada in range(orden_taylor + 1):
        
        valor_derivada = derivada_polinomio_cuadratico(
            numero_derivada,
            punto_centro,
            coeficiente_cuadratico,
            coeficiente_lineal,
            termino_constante
        )

        coeficiente_k = valor_derivada / factorial(numero_derivada)
        coeficientes_taylor.append(coeficiente_k)

    return coeficientes_taylor

def calcular_coeficientes_taylor_polinomio_cubico(
    punto_centro: float,
    orden_taylor: int,
    coeficiente_cubico: float,
    coeficiente_cuadratico: float,
    coeficiente_lineal: float,
    termino_constante: float
) -> List[float]:
    """
    Calcula los coeficientes de Taylor del polinomio p(x) = ax^3 + bx^2 + cx + d.
    """
    coeficientes_taylor: List[float] = []

    for numero_derivada in range(orden_taylor + 1):
        
        valor_derivada = derivada_polinomio_cubico(
            numero_derivada,
            punto_centro,
            coeficiente_cubico,
            coeficiente_cuadratico,
            coeficiente_lineal,
            termino_constante
        )

        coeficiente_k = valor_derivada / factorial(numero_derivada)
        coeficientes_taylor.append(coeficiente_k)

    return coeficientes_taylor

def calcular_coeficientes_taylor_polinomio_cuartico(
    punto_centro: float,
    orden_taylor: int,
    coeficiente_cuartico: float,
    coeficiente_cubico: float,
    coeficiente_cuadratico: float,
    coeficiente_lineal: float,
    termino_constante: float
) -> List[float]:
    """
    Calcula los coeficientes de Taylor del polinomio p(x) = ax^4 + bx^3 + cx^2 + dx + e.
    """
    coeficientes_taylor: List[float] = []

    for numero_derivada in range(orden_taylor + 1):
        
        valor_derivada = derivada_polinomio_cuartico(
            numero_derivada,
            punto_centro,
            coeficiente_cuartico,
            coeficiente_cubico,
            coeficiente_cuadratico,
            coeficiente_lineal,
            termino_constante
        )

        coeficiente_k = valor_derivada / factorial(numero_derivada)
        coeficientes_taylor.append(coeficiente_k)

    return coeficientes_taylor

# ============================================================
#   EVALUAR EL POLINOMIO DE TAYLOR
# ============================================================

def evaluar_polinomio_taylor(
    coeficientes_taylor: List[float],
    punto_centro: float,
    valor_x: float
) -> float:
    """
    Evalúa P_n(x) = Σ c_k * (x - punto_centro)^k
    """
    lista_aproximaciones: List[float] = []
    resultado_polinomio = 0.0
    diferencia_x = valor_x - punto_centro
    potencia_actual = 1.0  # (x - a)^0

    for coeficiente in coeficientes_taylor:
        resultado_polinomio += coeficiente * potencia_actual
        potencia_actual *= diferencia_x  # siguiente potencia

        lista_aproximaciones.append(resultado_polinomio)

    return resultado_polinomio, lista_aproximaciones

def preparar_lista_para_frontend(lista_aproximaciones: List[float], valor_real: float) -> List[List[float]]:
    """
    Prepara una lista de listas para mostrar en el frontend.
    Cada sublista contiene: [número de término, aproximación, valor real, error absoluto]
    """
    lista_formateada: List[List[float]] = []

    for i, aproximacion in enumerate(lista_aproximaciones):
        error_abs = abs(aproximacion - valor_real)
        error_relativo = error_abs / abs(valor_real) if valor_real != 0 else float('inf')
        error_relativo_percent = error_relativo * 100 if valor_real != 0 else float('inf')
        lista_formateada.append([i, aproximacion, valor_real, error_abs, error_relativo, error_relativo_percent])

    return lista_formateada

# ============================================================
#   UTILS
# ============================================================

def big_print(word: str):
    print("============================================================")
    print(word)
    print("============================================================")

def medir_tiempo_y_iteraciones(func, *args, **kwargs):
    """
    Ejecuta una función y mide:
    - Tiempo total de ejecución
    - Número de iteraciones realizadas (si la función devuelve lista de aproximaciones)

    Retorna:
    (resultado, iteraciones, tiempo_ms)
    """
    inicio = time.perf_counter()

    resultado, lista_aprox = func(*args, **kwargs)

    fin = time.perf_counter()
    tiempo_ms = (fin - inicio) * 1000
    iteraciones = len(lista_aprox)

    return resultado, lista_aprox, iteraciones, tiempo_ms


# ============================================================
#   PROGRAMA PRINCIPAL
# ============================================================

if __name__ == "__main__":

    punto_centro = 0.0
    orden_taylor = min(165, 10) - 1 # Asegurarse de que el orden no exceda el número de derivadas definidas 
    valor_x = .5

    # =================
    # Taylor de sin(x)
    # =================
    coef_sin = calcular_coeficientes_taylor_sin(punto_centro, orden_taylor)
    aproximacion_sin, lista_aproximaciones_sin, iter_sin, tiempo_sin = medir_tiempo_y_iteraciones(evaluar_polinomio_taylor, coef_sin, punto_centro, valor_x)
    valor_real_sin = math.sin(valor_x)

    big_print("Taylor de sin(x)")
    lista_formateada_sin = preparar_lista_para_frontend(lista_aproximaciones_sin, valor_real_sin)
    print(tabulate(lista_formateada_sin, headers=["número de término", "aproximación", "valor real", "error absoluto", "error relativo", "error relativo %"], tablefmt="pretty"))
    print(f"Iteraciones: {iter_sin}")
    print(f"Tiempo: {tiempo_sin:.5f} ms")

    
    # =================
    # # Taylor de exp(x)
    # =================
    coef_exp = calcular_coeficientes_taylor_exp(punto_centro, orden_taylor)
    aproximacion_exp, lista_aproximaciones_exp, iter_exp, tiempo_exp = medir_tiempo_y_iteraciones(evaluar_polinomio_taylor, coef_exp, punto_centro, valor_x)
    valor_real_exp = math.exp(valor_x)

    big_print("Taylor de exp(x)")
    lista_formateada_exp = preparar_lista_para_frontend(lista_aproximaciones_exp, valor_real_exp)
    print(tabulate(lista_formateada_exp, headers=["número de término", "aproximación", "valor real", "error absoluto", "error relativo", "error relativo %"], tablefmt="pretty"))
    print(f"Iteraciones: {iter_exp}")
    print(f"Tiempo: {tiempo_exp:.5f} ms")
    
    # =================
    # # Taylor del polinomio ax^2 + bx + c
    # =================
    a2 = 1
    b2 = 2
    c2 = 10

    coef_poly = calcular_coeficientes_taylor_polinomio(punto_centro, orden_taylor, a2, b2, c2)
    aproximacion_poly, lista_aproximaciones_poly, iter_poly, tiempo_poly = medir_tiempo_y_iteraciones(evaluar_polinomio_taylor, coef_poly, punto_centro, valor_x)
    valor_real_poly = a2 * valor_x**2 + b2 * valor_x + c2

    big_print("Taylor del polinomio ax^2 + bx + c")
    lista_formateada_poly = preparar_lista_para_frontend(lista_aproximaciones_poly, valor_real_poly)
    print(tabulate(lista_formateada_poly, headers=["número de término", "aproximación", "valor real", "error absoluto", "error relativo", "error relativo %"], tablefmt="pretty"))
    print(f"Iteraciones: {iter_poly}")
    print(f"Tiempo: {tiempo_poly:.5f} ms")

    # =================
    # # Taylor del polinomio ax^3 + bx^2 + cx + d
    # =================
    a3 = 1
    b3 = 2
    c3 = 3
    d3 = 10

    coef_poly_cubico = calcular_coeficientes_taylor_polinomio_cubico(punto_centro, orden_taylor, a3, b3, c3, d3)
    aproximacion_poly_cubico, lista_aproximaciones_cubico, iter_cubico, tiempo_cubico = medir_tiempo_y_iteraciones(evaluar_polinomio_taylor, coef_poly_cubico, punto_centro, valor_x)
    valor_real_poly_cubico = a3 * valor_x**3 + b3 * valor_x**2 + c3 * valor_x + d3

    big_print("Taylor del polinomio ax^3 + bx^2 + cx + d")
    lista_formateada_poly_cubico = preparar_lista_para_frontend(lista_aproximaciones_cubico, valor_real_poly_cubico)
    print(tabulate(lista_formateada_poly_cubico, headers=["número de término", "aproximación", "valor real", "error absoluto", "error relativo", "error relativo %"], tablefmt="pretty"))
    print(f"Iteraciones: {iter_cubico}")
    print(f"Tiempo: {tiempo_cubico:.5f} ms")

    # =================
    # # Taylor del polinomio ax^4 + bx^3 + cx^2 + dx + e
    # =================
    a4 = 1
    b4 = 2
    c4 = 3
    d4 = 4
    e4 = 10
    
    coef_poly_cuartico = calcular_coeficientes_taylor_polinomio_cuartico(punto_centro, orden_taylor, a4, b4, c4, d4, e4)
    aproximacion_poly_cuartico, lista_aproximaciones_cuartico, iter_cuartico, tiempo_cuartico = medir_tiempo_y_iteraciones(evaluar_polinomio_taylor, coef_poly_cuartico, punto_centro, valor_x)
    valor_real_poly_cuartico = a4 * valor_x**4 + b4 * valor_x**3 + c4 * valor_x**2 + d4 * valor_x + e4

    big_print("Taylor del polinomio ax^4 + bx^3 + cx^2 + dx + e")
    lista_formateada_poly_cuartico = preparar_lista_para_frontend(lista_aproximaciones_cuartico, valor_real_poly_cuartico)
    print(tabulate(lista_formateada_poly_cuartico, headers=["número de término", "aproximación", "valor real", "error absoluto", "error relativo", "error relativo %"], tablefmt="pretty"))
    print(f"Iteraciones: {iter_cuartico}")
    print(f"Tiempo: {tiempo_cuartico:.5f} ms")