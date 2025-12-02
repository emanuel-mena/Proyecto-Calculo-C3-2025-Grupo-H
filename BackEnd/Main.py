# main.py
from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from taylor_engine import generar_taylor_con_analisis


# ============================================================
# Pydantic models (request / response)
# ============================================================

class TaylorRequest(BaseModel):
    expression: str = Field(
        ...,
        description="Expresión de entrada. Puede ser LaTeX o texto tipo SymPy.",
        examples=[
            r"\sin(x) + x^2",
            r"\frac{1}{1+x}",
            "exp(x) + x**3"
        ],
    )
    center: float = Field(
        0.0,
        description="Centro de la expansión de Taylor (a).",
        examples=[0.0],
    )
    x_eval: float = Field(
        0.0,
        description="Punto donde se evalúan P_n(x), f(x), P_n'(x), f'(x).",
        examples=[0.5],
    )
    order: int = Field(
        5,
        ge=0,
        description="Orden del polinomio de Taylor (n).",
        examples=[3, 5, 10],
    )
    input_is_latex: bool = Field(
        True,
        description="Si es True, 'expression' se interpreta como LaTeX.",
        examples=[True, False],
    )
    plot_min: Optional[float] = Field(
        None,
        description="Límite inferior del rango de la gráfica (opcional).",
        examples=[-2.0],
    )
    plot_max: Optional[float] = Field(
        None,
        description="Límite superior del rango de la gráfica (opcional).",
        examples=[2.0],
    )
    num_points: int = Field(
        300,
        ge=10,
        le=2000,
        description="Número de puntos para la gráfica.",
        examples=[300, 500, 1000],
    )


class ErrorMetrics(BaseModel):
    absolute: Optional[float] = Field(
        None,
        examples=[0.00123],
        description="Error absoluto |aprox - exacto|.",
    )
    relative: Optional[float] = Field(
        None,
        examples=[0.0000123],
        description="Error relativo (aprox - exact)/exact.",
    )


class ConvergenceRow(BaseModel):
    order: int = Field(..., examples=[0, 1, 2])
    approx: float = Field(..., examples=[0.75])
    exact: Optional[float] = Field(None, examples=[0.7071])
    abs_error: Optional[float] = Field(None, examples=[0.0429])
    rel_error: Optional[float] = Field(None, examples=[0.0607])
    rel_error_pct: Optional[float] = Field(None, examples=[6.07])


class TaylorAnalysisResponse(BaseModel):
    expression_input: str = Field(
        ..., examples=[r"\sin(x) + x^2"]
    )
    input_is_latex: bool = Field(
        ..., examples=[True]
    )
    expression_sympy_str: str = Field(
        ..., examples=["sin(x) + x**2"]
    )

    center: float = Field(..., examples=[0.0])
    x_eval: float = Field(..., examples=[0.5])
    order: int = Field(..., examples=[5])

    coefficients: List[float] = Field(
        ...,
        examples=[[0, 1, 1, -0.166666, 0, 0.0083333]],
    )

    polynomial_sympy_str: str = Field(
        ..., examples=["x*(0.008333*x**4 - 0.16666*x**2 + x + 1)"]
    )
    polynomial_latex: str = Field(
        ..., examples=[r"x \left(0.0083 x^{4} - 0.1667 x^{2} + x + 1 \right)"]
    )

    approx_value_at_x: Optional[float] = Field(
        None, examples=[0.729427]
    )
    exact_value_at_x: Optional[float] = Field(
        None, examples=[0.72942553]
    )

    derivative_approx_at_x: Optional[float] = Field(
        None, examples=[1.8776]
    )
    derivative_exact_at_x: Optional[float] = Field(
        None, examples=[1.87758256]
    )

    value_errors: ErrorMetrics
    derivative_errors: ErrorMetrics

    convergence_table: List[ConvergenceRow] = Field(
        ...,
        examples=[
            [
                {
                    "order": 0,
                    "approx": 0.0,
                    "exact": 0.7294,
                    "abs_error": 0.7294,
                    "rel_error": 1.0,
                    "rel_error_pct": 100.0,
                },
                {
                    "order": 1,
                    "approx": 0.5,
                    "exact": 0.7294,
                    "abs_error": 0.2294,
                    "rel_error": 0.314,
                    "rel_error_pct": 31.4,
                },
            ]
        ],
    )

    plot_base64_png: Optional[str] = Field(
        None,
        description="Gráfica en formato base64 (PNG).",
        examples=["iVBORw0KGgoAAAANSUhEUgAA..."],
    )

    steps: List[str] = Field(
        ...,
        examples=[
            [
                "1) Parseo LaTeX exitoso",
                "2) Cálculo de coeficientes...",
                "3) Polinomio simbólico...",
            ]
        ],
    )


# ============================================================
# FastAPI app
# ============================================================

app = FastAPI(
    title="TaylorLab API",
    description=(
        "API académica para análisis de series de Taylor:\n"
        "- Parseo de expresiones (LaTeX o texto)\n"
        "- Cálculo de polinomios de Taylor\n"
        "- Comparación entre derivada exacta y aproximada\n"
        "- Tabla de convergencia y gráfica en base64"
    ),
    version="1.0.0",
)


# CORS para conectar con tu frontend (Vite, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # si quieres lo restringes más tarde
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Endpoints
# ============================================================

@app.get("/", tags=["meta"])
def root():
    return {
        "message": "Bienvenido a TaylorLab API",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.post(
    "/taylor/analyze",
    response_model=TaylorAnalysisResponse,
    tags=["taylor"],
    summary="Analiza una función usando Taylor",
    description=(
        "Recibe una expresión (LaTeX o texto), un centro a, un punto x_eval y un orden n.\n"
        "Devuelve coeficientes de Taylor, polinomio simbólico y en LaTeX, valores exactos y aproximados, "
        "errores, tabla de convergencia y gráfica en base64."
    ),
)
def analyze_taylor(req: TaylorRequest):
    plot_limits = None
    if req.plot_min is not None and req.plot_max is not None:
        plot_limits = (req.plot_min, req.plot_max)

    raw_result = generar_taylor_con_analisis(
        expr_input=req.expression,
        center=req.center,
        x_eval=req.x_eval,
        order=req.order,
        input_is_latex=req.input_is_latex,
        plot_limits=plot_limits,
        num_points=req.num_points,
    )

    return raw_result
