import MathLiveInput from "./components/MathLiveInput";

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">
            Calculus Solver <span className="text-sky-400">/ Prototipo</span>
          </h1>
          <span className="text-xs md:text-sm text-slate-400">
            Zona de entrada con MathLive
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
        {/* Descripción corta */}
        <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 md:p-5">
          <p className="text-sm md:text-base text-slate-300">
            Esta maqueta usa{" "}
            <span className="text-emerald-400 font-medium">MathLive</span> en la{" "}
            <span className="text-sky-400 font-medium">zona de entrada</span> para
            escribir problemas de cálculo en notación matemática. Más adelante
            conectaremos este LaTeX al motor de resolución y a las zonas de proceso
            y resultado.
          </p>
        </section>

        {/* Tres zonas: entrada / proceso / resultado */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* Zona de entrada */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 md:p-5 shadow-lg shadow-slate-900/40 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Zona de entrada</h2>
            <p className="text-xs md:text-sm text-slate-400">
              Aquí el usuario escribe el problema en notación matemática. El valor se
              guarda como LaTeX para usarlo luego.
            </p>

            <MathLiveInput label="Editor principal de problemas" />
          </div>

          {/* Zona de proceso (placeholder) */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 md:p-5 shadow-lg shadow-slate-900/40 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Zona de proceso</h2>
            <p className="text-xs md:text-sm text-slate-400 mb-3">
              Placeholder: aquí se mostrará el desarrollo paso a paso, usando el
              LaTeX de la zona de entrada.
            </p>
            <div className="flex-1 rounded-xl border border-dashed border-slate-600 bg-slate-900/40 flex items-center justify-center text-center px-3">
              <span className="text-xs md:text-sm text-slate-500">
                En el futuro: lista de pasos, derivaciones, integraciones, etc.
              </span>
            </div>
          </div>

          {/* Zona de resultado (placeholder) */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 md:p-5 shadow-lg shadow-slate-900/40 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Zona de resultado</h2>
            <p className="text-xs md:text-sm text-slate-400 mb-3">
              Placeholder: aquí se mostrará el resultado final (numérico, forma
              cerrada, gráfico, etc.).
            </p>
            <div className="flex-1 rounded-xl border border-dashed border-slate-600 bg-slate-900/40 flex items-center justify-center text-center px-3">
              <span className="text-xs md:text-sm text-slate-500">
                En el futuro: valor final simplificado, errores de dominio,
                gráficos, etc.
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
