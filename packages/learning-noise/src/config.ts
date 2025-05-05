enum Mode {
  // Noise:
  VALUE,
  PERLIN,
  SIMPLEX,

  // Intuition:
  GRID_SKEWING,
  GRID_REFLECTION,
  INFLUENCE,
}

export const mode: Mode = Mode.SIMPLEX;
