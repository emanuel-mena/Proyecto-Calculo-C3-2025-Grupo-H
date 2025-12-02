// src/components/LatexDisplay.tsx
import React, { useEffect, useRef } from "react";
import "mathlive";

interface LatexDisplayProps {
  latex: string;
  className?: string;
}

/**
 * Muestra una expresión LaTeX usando MathLive en modo sólo lectura.
 */
const LatexDisplay: React.FC<LatexDisplayProps> = ({ latex, className }) => {
  const fieldRef = useRef<any>(null);

  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;

    if (el.setValue) {
      el.setValue(latex);
    } else {
      el.value = latex;
    }
  }, [latex]);

  return (
    <div className={className}>
      {/* @ts-ignore: web component de MathLive */}
      <math-field
        ref={fieldRef}
        read-only
        virtual-keyboard-mode="off"
        className="w-full bg-transparent outline-none text-base"
        style={{ "--keyboard-zindex": 0 } as React.CSSProperties}
      />
    </div>
  );
};

export default LatexDisplay;
