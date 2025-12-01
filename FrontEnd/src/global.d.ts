// src/global.d.ts
// Declaración global sin imports para que JSX acepte <math-field>

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        ref?: React.Ref<any>;
        "read-only"?: boolean;
        "default-mode"?: "math" | "text";
        virtualKeyboardMode?: "manual" | "onfocus" | "off";
      };
    }
  }
}
