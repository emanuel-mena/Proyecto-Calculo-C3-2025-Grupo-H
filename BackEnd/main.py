# main.py
from typing import List, Optional
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from taylor_engine import generar_taylor_con_analisis


# ============================================================
# Pydantic models (request / response)
# ============================================================

class TaylorRequest(BaseModel):
    expression: str = Field(
        ...,
        description="Expresión de entrada. Puede ser LaTeX o texto tipo SymPy.",
        examples=[r"\\sin(x) + x^2", r"\\frac{1}{1+x}", "exp(x) + x**3"],
    )
    center: float = Field(0.0, description="Centro de la expansión de Taylor (a).")
    x_eval: float = Field(0.0, description="Punto donde se evalúan los valores.")
    order: int = Field(5, ge=0, description="Orden n del polinomio.")
    input_is_latex: bool = Field(True, description="Si es True, interpreta 'expression' como LaTeX.")
    plot_min: Optional[float] = Field(None)
    plot_max: Optional[float] = Field(None)
    num_points: int = Field(300, ge=10, le=2000)


class ErrorMetrics(BaseModel):
    absolute: Optional[float]
    relative: Optional[float]


class ConvergenceRow(BaseModel):
    order: int
    approx: float
    exact: Optional[float]
    abs_error: Optional[float]
    rel_error: Optional[float]
    rel_error_pct: Optional[float]


class TaylorAnalysisResponse(BaseModel):
    expression_input: str
    input_is_latex: bool
    expression_sympy_str: str

    center: float
    x_eval: float
    order: int

    coefficients: List[float]

    polynomial_sympy_str: str
    polynomial_latex: str

    approx_value_at_x: Optional[float]
    exact_value_at_x: Optional[float]

    derivative_approx_at_x: Optional[float]
    derivative_exact_at_x: Optional[float]

    value_errors: ErrorMetrics
    derivative_errors: ErrorMetrics

    convergence_table: List[ConvergenceRow]

    plot_base64_png: Optional[str]

    steps: List[str]


# ============================================================
# FastAPI app
# ============================================================

app = FastAPI(
    title="TaylorLab API",
    description="API académica para análisis de series de Taylor.",
    version="1.0.0",
)

# Permitir conexión desde frontend local o deploy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Taylor endpoint
# ============================================================

@app.post(
    "/taylor/analyze",
    response_model=TaylorAnalysisResponse,
    tags=["taylor"],
    summary="Analiza una función usando Taylor",
)
def analyze_taylor(req: TaylorRequest):
    plot_limits = None
    if req.plot_min is not None and req.plot_max is not None:
        plot_limits = (req.plot_min, req.plot_max)

    result = generar_taylor_con_analisis(
        expr_input=req.expression,
        center=req.center,
        x_eval=req.x_eval,
        order=req.order,
        input_is_latex=req.input_is_latex,
        plot_limits=plot_limits,
        num_points=req.num_points,
    )

    return result


# ============================================================
# FRONTEND STATIC FILE SERVING (como LaserMapper3D)
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = (BASE_DIR / "static").resolve()

def _api_overview():
    return {
        "message": "TaylorLab API + Frontend",
        "frontend_note": "Si el build existe, se sirve en /",
        "endpoints": ["/taylor/analyze"]
    }


# Si existe la carpeta `static/`, servir el SPA de Vite
if FRONTEND_DIST.exists():
    assets = FRONTEND_DIST / "assets"
    if assets.exists():
        app.mount("/assets", StaticFiles(directory=assets), name="assets")

    @app.get("/", include_in_schema=False)
    def serve_index():
        return FileResponse(FRONTEND_DIST / "index.html")

    @app.get("/{full_path:path}", include_in_schema=False)
    def spa_catch_all(full_path: str):
        """
        Hace fallback a index.html para permitir navegación
        de SPA (React Router, etc.)
        """
        candidate = (FRONTEND_DIST / full_path).resolve()
        try:
            candidate.relative_to(FRONTEND_DIST)
        except ValueError:
            return FileResponse(FRONTEND_DIST / "index.html")

        if candidate.is_file():
            return FileResponse(candidate)

        return FileResponse(FRONTEND_DIST / "index.html")

else:
    # Sin build → mostrar overview
    @app.get("/", tags=["meta"])
    def serve_overview():
        return _api_overview()
