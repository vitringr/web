export namespace Config {
  export const width = 450;
  export const height = 900;

  export const verticesPerRow = 5;
  export const vertexRadius = 4;
  export const edgeWidth = 1;

  export const targetVertexRadius = 5;
  export const targetEdgesWidth = 4;

  export const poitnerRadius = 5;
  export const pointerEdgesWidth = 3;

  export const colors = {
    backgroundTop: "#111130",
    backgroundBot: "#301111",
    pointer: "#FFFF00",
    gridTop: "#6060A0",
    gridBot: "#A06060",
    gridTopLighter: "#7070B0",
    gridBotLighter: "#C08080",
    targetVertices: "#E0E0E0",
  } as const;
}
