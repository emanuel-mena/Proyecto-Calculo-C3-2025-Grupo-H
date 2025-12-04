export default function Footer() {
  const contributors = [
    {
      name: "Emanuel Mena",
      url: "https://github.com/emanuel-mena",
    },
    {
      name: "Contribuidor 2",
      url: "https://github.com/user2",
    },
    {
      name: "Contribuidor 3",
      url: "https://github.com/user3",
    },
    {
      name: "Contribuidor 4",
      url: "https://github.com/user4",
    },
  ];

  return (
    <footer className="mt-10 border-t border-[rgb(var(--app-border))] bg-[rgba(var(--app-bg),0.9)] backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Texto */}
        <p className="text-xs md:text-sm text-[rgb(var(--app-muted))] text-center md:text-left">
          Desarrollado por el equipo · Proyecto académico 2025
        </p>

        {/* Contribuidores */}
        <div className="flex items-center flex-wrap justify-center gap-4">
          {contributors.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              className="flex items-center gap-2 px-3 py-1 rounded-lg border border-[rgb(var(--app-border))]
                         bg-[rgb(var(--app-surface))] hover:bg-[rgba(var(--app-accent),0.15)]
                         transition-colors text-sm"
            >
              <i className="bi bi-github text-lg text-[rgb(var(--app-accent))]"></i>
              <span className="text-[rgb(var(--app-text))]">{c.name}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
