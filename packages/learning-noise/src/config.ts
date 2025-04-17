enum Main {
  SKEW_VISUALIZATION,
  VALUE,
  PERLIN,
  SIMPLEX,
}

export namespace Config {
  export const main: Main = Main.SIMPLEX;

  export const width = 600;
  export const pixelsPerRow = 50;
  export const cellsPerRow = 5;

  // ------------
  // -- Render --
  // ------------

  export const renderCells = true;
  export const renderValues = true;
  export const renderGradients = true;
  export const renderPixelBorders = true;

  export const pixelBordersWidth = 0.2;

  export const gradientArrowWidth = 2;
  export const gradientArrowLength = 25;
  export const gradientCircleRadius = 4;

  export const valueCircleRadius = 6;
  export const valueCircleThickness = 1.5;

  export const colors = {
    values: "#CCCC00",
    gradients: "#CCCC00",
    cellBorders: "#999900",
    pixelBorders: "#CCCC00",
  } as const;
}
