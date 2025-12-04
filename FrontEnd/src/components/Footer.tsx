export default function Footer() {
  const contributors = [
    {
      name: "Emanuel Mena",
      url: "https://github.com/emanuel-mena",
      avatar: "https://github.com/emanuel-mena.png",
    },
    {
      name: "Melina Soto",
      url: "https://github.com/Melina2005",
      avatar: "https://github.com/Melina2005.png",
    },
    {
      name: "Oscar Vasquez",
      url: "https://github.com/Eduard20CR",
      avatar: "https://github.com/Eduard20CR.png",
    },
    {
      name: "Alexander Segura",
      url: "https://github.com/alexcenfotec",
      avatar: "https://github.com/alexcenfotec.png",
    },
  ];

  return (
    <footer className="mt-10 border-t border-[rgb(var(--app-border))] bg-[rgba(var(--app-bg),0.9)] backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Texto */}
        <p className="text-xs md:text-sm text-[rgb(var(--app-muted))] text-center md:text-left">
          Desarrollado por Grupo H · 2025
        </p>

        {/* Contribuidores */}
        <div className="flex items-center flex-wrap justify-center gap-4">
          {contributors.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-1 rounded-xl border border-[rgb(var(--app-border))]
                         bg-[rgb(var(--app-surface))] hover:bg-[rgba(var(--app-accent),0.15)]
                         transition-all text-sm"
            >
              {/* Avatar redondito */}
              <img
                src={c.avatar}
                alt={c.name}
                className="w-8 h-8 rounded-full object-cover border border-[rgb(var(--app-border))]"
              />

              {/* Nombre + iconito */}
              <span className="flex items-center gap-2 text-[rgb(var(--app-text))]">
                {c.name}
                <i className="bi bi-github text-lg text-[rgb(var(--app-accent))]"></i>
              </span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
