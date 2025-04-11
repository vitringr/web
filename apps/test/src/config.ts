export namespace Config {
  export const width = 800;

  export const pixelsPerRow = 40;

  export const cellsPerRow = 8;

  // ------------
  // -- Render --
  // ------------

  export const pixelLines = true;

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
