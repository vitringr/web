export namespace Config {
  export const width = 600;

  export const pixelsPerRow = 100;

  export const cellsPerRow = 10;

  // ------------
  // -- Render --
  // ------------

  export const renderCells = false;
  export const renderGradients = false;
  export const renderPixelLines = false;

  export const gradientArrowWidth = 2;
  export const gradientArrowLength = 20;
  export const gradientCircle = 4;

  export const pixelBorderWidth = 1;

  export const colors = {
    gradient: "#CCCC00",
    cellBorder: "#909090",
    pixelBorder: "#444444",
  } as const;
}
