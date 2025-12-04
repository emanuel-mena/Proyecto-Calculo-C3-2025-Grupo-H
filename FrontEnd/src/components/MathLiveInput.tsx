// src/components/MathLiveInput.tsx
import React, { useEffect, useRef, useState } from "react";
import "mathlive";

export interface MathLiveInputProps {
  initialLatex?: string;
  label?: string;
  onChangeLatex?: (latex: string) => void;
}

const MathLiveInput: React.FC<MathLiveInputProps> = ({
  initialLatex = "\\int_0^1 x^2 \\, dx",
  label = "Editor con MathLive",
  onChangeLatex,
}) => {
  const [latex, setLatex] = useState(initialLatex);
  const fieldRef = useRef<any>(null);

  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;

    // Set inicial
    if (el.setValue) {
      el.setValue(initialLatex);
    } else {
      el.value = initialLatex;
    }

    const handler = () => {
      const value = el.getValue ? el.getValue() : el.value;
      setLatex(value);
      onChangeLatex?.(value);
    };

    el.addEventListener("input", handler);
    return () => {
      el.removeEventListener("input", handler);
    };
  }, [initialLatex, onChangeLatex]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[rgb(var(--app-text))] flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(var(--app-accent),0.18)] text-xs text-[rgb(var(--app-accent-strong))]">
          ML
        </span>
        {label}
      </h3>

      <p className="text-xs text-[rgb(var(--app-muted))]">
        Editor de notación matemática avanzado. El contenido se guarda como LaTeX.
      </p>

      <div className="rounded-xl bg-[rgba(var(--app-bg),0.9)] border border-[rgb(var(--app-border))] px-3 py-2">
        {/* Ignora el error de JSX sólo en esta línea */}
        {/* @ts-ignore */}
        <math-field
          ref={fieldRef}
          className="w-full min-h-[2.5rem] bg-transparent outline-none"
        >
          {/* @ts-ignore */}
        </math-field>
      </div>

      <div className="text-xs text-[rgb(var(--app-muted))]">
        <span className="font-semibold text-[rgb(var(--app-text))]">LaTeX:</span>{" "}
        <code className="break-all text-[rgb(var(--app-accent-strong))]">
          {latex}
        </code>
      </div>
    </div>
  );
};

export default MathLiveInput;
