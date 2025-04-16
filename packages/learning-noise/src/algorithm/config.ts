enum Algorithm {
  VALUE,
  GRADIENT,
}

enum EasingFunction {
  LINEAR,
  SMOOTHSTEP,
}

export namespace Config {
  export const algorithm: Algorithm = Algorithm.GRADIENT;
  export const easingFunction: EasingFunction = EasingFunction.SMOOTHSTEP;

  export const width = 600;
  export const pixelsPerRow = 100;
  export const cellsPerRow = 10;

  // ------------
  // -- Render --
  // ------------

  export const renderCells = false;
  export const renderValues = false;
  export const renderGradients = false;
  export const renderPixelBorders = false;

  export const pixelBordersWidth = 0.5;

  export const gradientArrowWidth = 2;
  export const gradientArrowLength = 20;
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
