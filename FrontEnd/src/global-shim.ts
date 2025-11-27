// src/global-shim.ts
export {};

declare global {
  // solo para que TypeScript no se queje si usamos `global`
  // eslint-disable-next-line no-var
  var global: any;
}

if (typeof global === "undefined" && typeof window !== "undefined") {
  // @ts-ignore
  window.global = window;
}
