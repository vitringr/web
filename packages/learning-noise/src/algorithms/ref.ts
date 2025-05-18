const SQRT3 = Math.sqrt(3.0);
const F = 0.5 * (SQRT3 - 1.0);
const G = (3.0 - SQRT3) / 6.0;

// I'm really not sure why this | 0 (basically a coercion to int)
// is making this faster but I get ~5 million ops/sec more on the
// benchmarks across the board or a ~10% speedup.
const floor = (x: number) => Math.floor(x) | 0;

const grad2 = new Float64Array([
  1, 1,
  -1, 1,
  1, -1,
  -1, -1,
  1, 0,
  -1, 0,
  1, 0,
  -1, 0,
  0, 1,
  0, -1,
  0, 1,
  0, -1,
]);

export function createNoise2D(random: typeof Math.random) {
  const perm = buildPermutationTable(random);
  // Precompute gradient tables for X and Y components (3% performance boost)
  const permGrad2x = new Float64Array(perm).map((v) => grad2[(v % 12) * 2]);
  const permGrad2y = new Float64Array(perm).map((v) => grad2[(v % 12) * 2 + 1]);

  return function noise2D(x: number, y: number): number {
    // Noise contributions from the three corners of the simplex triangle
    let contributionA = 0;
    let contributionB = 0;
    let contributionC = 0;

    // --- Step 1: Skew input to square space to find simplex cell ---
    const S = (x + y) * F;
    const cellOriginX = floor(x + S); // Square-space X
    const cellOriginY = floor(y + S); // Square-space Y

    // --- Step 2: Unskew cell origin to simplex space ---
    const T = (cellOriginX + cellOriginY) * G;
    const simplexOriginX = cellOriginX - T; // Simplex-space X
    const simplexOriginY = cellOriginY - T; // Simplex-space Y

    // --- Step 3: Calculate displacement from origin in simplex space ---
    const differenceX = x - simplexOriginX;
    const differenceY = y - simplexOriginY;

    // --- Step 4: Determine which simplex triangle we're in (lower/upper) ---
    let middleCornerOffsetX: number;
    let middleCornerOffsetY: number;
    if (differenceX > differenceY) {
      // Lower triangle (XY order)
      middleCornerOffsetX = 1;
      middleCornerOffsetY = 0;
    } else {
      // Upper triangle (YX order)
      middleCornerOffsetX = 0;
      middleCornerOffsetY = 1;
    }

    // --- Step 5: Calculate displacements for all three corners ---
    // Corner B (middle corner)
    const deltaX1 = differenceX - middleCornerOffsetX + G;
    const deltaY1 = differenceY - middleCornerOffsetY + G;
    // Corner C (last corner)
    const deltaX2 = differenceX - 1.0 + 2.0 * G;
    const deltaY2 = differenceY - 1.0 + 2.0 * G;

    // --- Step 6: Hash gradient indices for each corner ---
    const wrappedCellX = cellOriginX & 255; // Wrap to [0,255] for permutation table
    const wrappedCellY = cellOriginY & 255;

    // --- Step 7: Calculate contributions from each corner ---
    // Corner A (origin)
    let falloffA = 0.5 - differenceX * differenceX - differenceY * differenceY;
    if (falloffA >= 0) {
      const gradientIndexA = wrappedCellX + perm[wrappedCellY];
      const gradientXA = permGrad2x[gradientIndexA];
      const gradientYA = permGrad2y[gradientIndexA];
      falloffA *= falloffA;
      contributionA =
        falloffA *
        falloffA *
        (gradientXA * differenceX + gradientYA * differenceY);
    }

    // Corner B (middle)
    let falloffB = 0.5 - deltaX1 * deltaX1 - deltaY1 * deltaY1;
    if (falloffB >= 0) {
      const gradientIndexB =
        wrappedCellX +
        middleCornerOffsetX +
        perm[wrappedCellY + middleCornerOffsetY];
      const gradientXB = permGrad2x[gradientIndexB];
      const gradientYB = permGrad2y[gradientIndexB];
      falloffB *= falloffB;
      contributionB =
        falloffB * falloffB * (gradientXB * deltaX1 + gradientYB * deltaY1);
    }

    // Corner C (last)
    let falloffC = 0.5 - deltaX2 * deltaX2 - deltaY2 * deltaY2;
    if (falloffC >= 0) {
      const gradientIndexC = wrappedCellX + 1 + perm[wrappedCellY + 1];
      const gradientXC = permGrad2x[gradientIndexC];
      const gradientYC = permGrad2y[gradientIndexC];
      falloffC *= falloffC;
      contributionC =
        falloffC * falloffC * (gradientXC * deltaX2 + gradientYC * deltaY2);
    }

    // --- Step 8: Combine contributions and scale to [-1, 1] ---
    return 70.0 * (contributionA + contributionB + contributionC);
  };
}

/**
 * Builds a random permutation table.
 * This is exported only for (internal) testing purposes.
 * Do not rely on this export.
 * @private
 */
export function buildPermutationTable(random: typeof Math.random): Uint8Array {
  const tableSize = 512;
  const p = new Uint8Array(tableSize);
  for (let i = 0; i < tableSize / 2; i++) {
    p[i] = i;
  }
  for (let i = 0; i < tableSize / 2 - 1; i++) {
    const r = i + ~~(random() * (256 - i));
    const aux = p[i];
    p[i] = p[r];
    p[r] = aux;
  }
  for (let i = 256; i < tableSize; i++) {
    p[i] = p[i - 256];
  }
  return p;
}


