# backend/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

from taylor import generar_taylor_con_pasos

app = FastAPI(title="Taylor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en producción restringir al dominio de tu front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TaylorRequest(BaseModel):
    funcion: str
    center: float
    x_eval: float
    order: int = 5
    x_min: Optional[float] = None
    x_max: Optional[float] = None
    num_points: Optional[int] = 300



@app.post("/api/taylor")
def calcular_taylor(req: TaylorRequest):
    plot_limits = None
    if req.x_min is not None and req.x_max is not None:
        plot_limits = (req.x_min, req.x_max)

    num_points = req.num_points if req.num_points is not None else 300    


    if num_points < 50 or num_points > 5000:
        raise HTTPException(
            status_code=400,
            detail="num_points debe estar entre 50 y 5000"
        )

    try:
        resultado = generar_taylor_con_pasos(
            expr_str=req.funcion,
            center=req.center,
            x_eval=req.x_eval,
            order=req.order,
            plot_limits=plot_limits,
            num_points=num_points
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return resultado
