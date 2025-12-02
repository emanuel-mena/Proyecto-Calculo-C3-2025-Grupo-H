import React, { useEffect, useRef } from "react";
import "mathlive";

interface InlineLatexProps {
  latex: string;
  className?: string;
}

/**
 * Muestra una expresión LaTeX en línea usando MathLive, modo sólo lectura.
 * Ideal para insertar trozos LaTeX dentro de texto.
 */
const InlineLatex: React.FC<InlineLatexProps> = ({ latex, className }) => {
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
    <span className={className}>
      {/* @ts-ignore: web component de MathLive */}
      <math-field
        ref={fieldRef}
        read-only
        virtual-keyboard-mode="off"
        className="align-middle bg-transparent outline-none text-[0.8rem]"
        style={
          {
            display: "inline-block",
            minWidth: 0,
            "--keyboard-zindex": 0,
          } as React.CSSProperties
        }
      />
    </span>
  );
};

export default InlineLatex;
