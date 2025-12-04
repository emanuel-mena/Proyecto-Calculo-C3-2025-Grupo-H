# TaylorMachine — Proyecto de Cálculo Numérico (Grupo H)
[![Frontend React](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-61dafb)](./FrontEnd)
[![Backend FastAPI](https://img.shields.io/badge/backend-FastAPI%20%2B%20SymPy-009688)](./BackEnd)
[![Licencia](https://img.shields.io/badge/licencia-CC0_1.0-blue)](./LICENSE)
[![Docker Ready](https://img.shields.io/badge/docker-ready-0db7ed)](./Dockerfile)

TaylorMachine es una aplicación web académica desarrollada por el Grupo H del curso Cálculo Diferencial e Integral (MAT-03/FUN-05) de la Universidad CENFOTEC. El proyecto implementa y analiza computacionalmente los polinomios de Taylor para aproximar funciones y derivadas, cumpliendo con las consignas de investigación teórica e implementación numérica del proyecto de cálculo.

## Objetivo

Proveer una herramienta interactiva que muestre cómo el método de Taylor aproxima funciones alrededor de un punto de expansión, mida errores absoluto y relativo, y permita estudiar la convergencia conforme aumenta el orden del polinomio. El sistema facilita tanto la exploración visual como el análisis numérico exigido en la evaluación académica.

## ¿Qué hace la aplicación?

- Convierte expresiones en notación LaTeX o SymPy y genera el polinomio de Taylor de orden n.
- Calcula derivadas sucesivas, valor aproximado y valor exacto en el punto de evaluación.
- Reporta errores absoluto y relativo, y construye tablas de convergencia por orden.
- Genera datos para gráficas de convergencia y tiempos de ejecución.
- Expone un endpoint REST (`/taylor/analyze`) en FastAPI y una interfaz React con MathLive para ingresar y visualizar funciones.

## Arquitectura

- **Frontend:** React + TypeScript con Vite y TailwindCSS. Incluye componentes para entrada de funciones en LaTeX, configuración del punto y orden, y visualización de resultados.
- **Backend:** FastAPI en Python con SymPy y NumPy para el motor simbólico y numérico. El frontend compilado puede servirse desde el backend (salida de build en `BackEnd/static`).
- **Integración:** El flujo principal consume el endpoint `/taylor/analyze`, que devuelve el polinomio, derivadas, métricas de error y datos para gráficas.

## Requisitos previos

- Python 3.11 o superior.
- Node.js 18 o superior y npm.

## Ejecución local

### 1) Backend (FastAPI)

1. Crear un entorno virtual y activar:
   ```bash
   cd BackEnd
   python -m venv .venv
   source .venv/bin/activate
   ```
2. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   uvicorn main:app --reload
   ```
   El endpoint principal quedará disponible en `http://127.0.0.1:8000/taylor/analyze`.

### 2) Frontend (Vite + React)

1. Instalar dependencias:
   ```bash
   cd FrontEnd
   npm install
   ```
2. Correr el modo desarrollo:
   ```bash
   npm run dev
   ```
   La interfaz estará en `http://localhost:5173` y consumirá el backend configurado.

### 3) Build integrado (opcional)

Para servir el frontend desde FastAPI, generar el build y colocarlo en `BackEnd/static`:
```bash
cd FrontEnd
npm install
npm run build
```
Luego iniciar el backend con `uvicorn` como en el paso 1. Si la carpeta `BackEnd/static` existe, FastAPI servirá el SPA en la raíz y el API permanecerá en `/taylor/analyze`.

## Estructura del repositorio

- `FrontEnd/`: aplicación React + TypeScript (Vite, TailwindCSS). El script `npm run build` deposita los artefactos en `BackBack/static`.
- `BackEnd/`: API en FastAPI y motor numérico basado en SymPy y NumPy. Incluye lógica de derivación manual, construcción del polinomio y generación de gráficas.
- `Dockerfile`: punto de partida para contenerización del proyecto completo.

## Recursos clave

- Endpoint de análisis: `POST /taylor/analyze` (cuerpo: expresión, centro, punto de evaluación, orden, opción LaTeX y parámetros de graficado).
- Scripts de apoyo en `BackEnd/` para derivación manual, graficado y normalización de entrada.

## Contribuyentes

<table>
<tr>
<td align="center"><a href="https://github.com/emanuel-mena"><img src="https://github.com/emanuel-mena.png" width="80"/><br/>Emanuel Mena</a></td>
<td align="center"><a href="https://github.com/Melina2005"><img src="https://github.com/Melina2005.png" width="80"/><br/>Melina Soto</a></td>
<td align="center"><a href="https://github.com/Eduard20CR"><img src="https://github.com/Eduard20CR.png" width="80"/><br/>Oscar Vasquez</a></td>
<td align="center"><a href="https://github.com/alexcenfotec"><img src="https://github.com/alexcenfotec.png" width="80"/><br/>Alexander Segura</a></td>
</tr>
</table>

## Créditos

Proyecto académico del Grupo H — III Cuatrimestre 2025, profesor Steven Gabriel Sánchez Ramírez (Universidad CENFOTEC). Aplicación y documentación orientadas al estudio de polinomios de Taylor y análisis de error en cálculo numérico.
