// src/types/mathlive.d.ts
import React from "react";

declare namespace JSX {
  interface IntrinsicElements {
    "math-field": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      virtualKeyboardMode?: "manual" | "onfocus" | "off";
    };
  }
}
