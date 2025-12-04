export default function Info() {
  return (
    <section className="bg-[rgb(var(--app-surface))] border border-[rgb(var(--app-border))] rounded-2xl p-4 md:p-5">
      <p className="text-sm md:text-base leading-relaxed">
        Este aplicativo forma parte del{" "}
        <span className="font-medium text-[rgb(var(--app-accent-strong))]">
          Proyecto de Cálculo Numérico
        </span>{" "}
        del III Cuatrimestre en la Universidad CENFOTEC. Su objetivo es
        implementar computacionalmente el método asignado al{" "}
        <span className="italic">Grupo H</span>: los{" "}
        <span className="font-medium text-[rgb(var(--app-accent))]">
          Polinomios de Taylor
        </span>, empleados para aproximar funciones, derivadas y analizar el error
        respecto al valor exacto.
      </p>

      <p className="mt-3 text-xs md:text-sm text-[rgb(var(--app-muted))] leading-relaxed">
        El sistema permite ingresar una función en formato{" "}
        <span className="text-[rgb(var(--app-accent-strong))] font-medium">
          LaTeX (MathLive)
        </span>
        , seleccionar el punto de expansión, el orden del polinomio y el valor a
        evaluar. El backend desarrollado en{" "}
        <span className="text-[rgb(var(--app-accent))] font-medium">FastAPI</span>{" "}
        calcula el polinomio de Taylor, sus derivadas sucesivas, el valor
        aproximado, el error absoluto/relativo y una gráfica de convergencia.
      </p>
    </section>
  );
}
