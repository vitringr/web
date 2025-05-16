export namespace Config {
  export const width = 600;
  export const pixelsPerRow = 40;
  export const cellsPerRow = 5;

  // ------------
  // -- Render --
  // ------------

  export const renderCells = true;
  export const renderValues = true;
  export const renderGradients = true;
  export const renderPixelBorders = true;

  export const pixelBordersWidth = 0.5;

  export const cellBordersWidth = 3;

  export const gradientArrowWidth = 2;
  export const gradientArrowLength = 30;
  export const gradientCircleRadius = 4;

  export const valueCircleRadius = 6;
  export const valueCircleThickness = 1.5;

  export const colors = {
    values: "#CCCC00",
    gradients: "#CCCC00",
    cellBorders: "#999900",
    pixelBorders: "#AAAA00",
  } as const;
}
