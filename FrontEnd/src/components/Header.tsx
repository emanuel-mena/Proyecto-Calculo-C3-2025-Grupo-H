export default function Header() {
  return (
    <header className="h-20 border-b border-[rgb(var(--app-border))] bg-[rgba(var(--app-bg),0.9)] backdrop-blur">
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">

        {/* LOGO + TÍTULO */}
        <div className="flex items-center gap-3 h-full">
          <img
            src="taylor_Icon.webp"
            alt="TaylorMachine Logo"
            className="h-full w-auto object-contain"
          />

          <h1 className="text-xl md:text-2xl font-semibold">
            Taylor Machine
          </h1>
        </div>

        {/* NAV */}
        <nav className="flex items-center gap-6 text-sm md:text-base">
          <a
            href="https://github.com/emanuel-mena/Proyecto-Calculo-C3-2025-Grupo-H"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[rgb(var(--app-accent))] transition-colors"
          >
            Documentación
          </a>

          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[rgb(var(--app-accent))] transition-colors"
          >
            Prueba el API
          </a>
        </nav>

      </div>
    </header>
  );
}
