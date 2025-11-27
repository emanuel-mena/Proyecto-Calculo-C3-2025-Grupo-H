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
      <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-300">
          ML
        </span>
        {label}
      </h3>

      <p className="text-xs text-slate-400">
        Editor de notación matemática avanzado. El contenido se guarda como LaTeX.
      </p>

      <div className="rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2">
        <math-field
          ref={fieldRef}
          className="w-full min-h-[2.5rem] bg-transparent outline-none"
        ></math-field>
      </div>

      <div className="text-xs text-slate-400">
        <span className="font-semibold text-slate-200">LaTeX:</span>{" "}
        <code className="break-all text-emerald-300">{latex}</code>
      </div>
    </div>
  );
};

export default MathLiveInput;
