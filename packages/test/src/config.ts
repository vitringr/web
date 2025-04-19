export namespace Config {
  export const width = 400;
  export const height = 800;

  export const verticesPerRow = 10;
  export const verticesSpacing = 10;
  export const vertexRadius = 3;

  export const poitnerRadius = 5;

  export const colors = {
    backgroundTop: "#111130",
    backgroundBot: "#301111",
    pointerTop: "#FFFF00",
    pointerBot: "#FF00FF",
    verticesTop: "#6060A0",
    verticesBot: "#A06060",
  } as const;
}
