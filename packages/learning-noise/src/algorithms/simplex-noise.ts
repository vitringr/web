import { Canvas2D } from "@utilities/canvas2d";
import { Colors } from "@utilities/colors";
import { Vector2 } from "@utilities/vector";

// PERFORMANCE: Maybe reduce number fractional detail?
// const F = 0.3660254037844386; // Skew factor
// const G = 0.2113248654051871; // Unskew factor

const PERMUTATIONS = [
  // PERFORMANCE: Optimize array structure.
  51, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142,
  8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203,
  117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165,
  71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92,
  41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208,
  89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217,
  226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58,
  17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155,
  167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218,
  246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
  239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150,
  254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 18,
  // Duplicate
  51, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142,
  8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203,
  117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165,
  71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92,
  41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208,
  89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217,
  226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58,
  17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155,
  167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218,
  246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
  239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150,
  254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 18,
];

const GRADIENTS = [
  Vector2.Create.north(),
  Vector2.Create.northEast(),
  Vector2.Create.east(),
  Vector2.Create.southEast(),
  Vector2.Create.south(),
  Vector2.Create.southWest(),
  Vector2.Create.west(),
  Vector2.Create.northWest(),
];

function hash(u: number, v: number) {
  // PERFORMANCE: Use bitwise wrapping.
  const u_wrapped = u & 255;
  const v_wrapped = v & 255;

  return PERMUTATIONS[u_wrapped + PERMUTATIONS[v_wrapped]];
}

function unskew(vector: Vector2) {
  const t = (vector.x + vector.y) * G;
  return vector.clone().decrease(t, t);
}

function noise(x: number, y: number, scale: number) {
  const input = new Vector2((x * scale) % 1, (y * scale) % 1);

  // 1. Find square cell origin.
  const origin = input.clone().floor();

  // 2. Find square cell triangle.
  const fraction = input.clone().subtract(origin);
  const isBotTriangle = fraction.x > fraction.y;

  // 2. Get the three square-space corners of the triangle.
  const a_corner = origin.clone();
  const b_corner = origin.clone();
  isBotTriangle ? (b_corner.x += 1) : (b_corner.y += 1);
  const c_corner = origin.clone().increase(1, 1);

  // 3. Unskew corners into simplex space.
  const a_corner_simplex = unskew(a_corner);
  const b_corner_simplex = unskew(b_corner);
  const c_corner_simplex = unskew(c_corner);

  // 4. Compute difference vectors in simplex space.
  const a_difference = input.clone().subtract(a_corner_simplex);
  const b_difference = input.clone().subtract(b_corner_simplex);
  const c_difference = input.clone().subtract(c_corner_simplex);

  // 5. Get gradients for each corner (from permutation table)
  // Note: In practice, you'd use a permutation table here

  const a_gradient = GRADIENTS[hash(a_corner.x, a_corner.y) % 8];
  const b_gradient = GRADIENTS[hash(b_corner.x, b_corner.y) % 8];
  const c_gradient = GRADIENTS[hash(c_corner.x, c_corner.y) % 8];

  // 6. Calculate dot products and falloff
  const falloff = (r2: number) => Math.max(0, 0.5 - r2) ** 4;

  const dotA = a_gradient.x * a_difference.x + a_gradient.y * a_difference.y;
  const dotB = b_gradient.x * b_difference.x + b_gradient.y * b_difference.y;
  const dotC = c_gradient.x * c_difference.x + c_gradient.y * c_difference.y;

  const r2a = a_difference.x * a_difference.x + a_difference.y * a_difference.y;
  const r2b = b_difference.x * b_difference.x + b_difference.y * b_difference.y;
  const r2c = c_difference.x * c_difference.x + c_difference.y * c_difference.y;

  const contributionA = dotA * falloff(r2a);
  const contributionB = dotB * falloff(r2b);
  const contributionC = dotC * falloff(r2c);

  // 7. Combine contributions (scaled to ~[-1, 1])
  return (contributionA + contributionB + contributionC) * 70;
}

const SQRT3 = Math.sqrt(3.0);
const F = 0.5 * (SQRT3 - 1.0);
const G = (3.0 - SQRT3) / 6.0;

// I'm really not sure why this | 0 (basically a coercion to int)
// is making this faster but I get ~5 million ops/sec more on the
// benchmarks across the board or a ~10% speedup.
const floor = (x: number) => Math.floor(x) | 0;

const grad2 = new Float64Array([
  1, 1, -1, 1, 1, -1, -1, -1, 1, 0, -1, 0, 1, 0, -1, 0, 0, 1, 0, -1, 0, 1, 0, -1,
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
    const skewFactor = (x + y) * F;
    const cellOriginX = floor(x + skewFactor); // Square-space X
    const cellOriginY = floor(y + skewFactor); // Square-space Y

    // --- Step 2: Unskew cell origin to simplex space ---
    const unskewFactor = (cellOriginX + cellOriginY) * G;
    const simplexOriginX = cellOriginX - unskewFactor; // Simplex-space X
    const simplexOriginY = cellOriginY - unskewFactor; // Simplex-space Y

    // --- Step 3: Calculate displacement from origin in simplex space ---
    const differenceX0 = x - simplexOriginX;
    const differenceY0 = y - simplexOriginY;

    // --- Step 4: Determine which simplex triangle we're in (lower/upper) ---
    let middleCornerOffsetX: number, middleCornerOffsetY: number;
    if (differenceX0 > differenceY0) {
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
    const deltaX1 = differenceX0 - middleCornerOffsetX + G;
    const deltaY1 = differenceY0 - middleCornerOffsetY + G;
    // Corner C (last corner)
    const deltaX2 = differenceX0 - 1.0 + 2.0 * G;
    const deltaY2 = differenceY0 - 1.0 + 2.0 * G;

    // --- Step 6: Hash gradient indices for each corner ---
    const wrappedCellX = cellOriginX & 255; // Wrap to [0,255] for permutation table
    const wrappedCellY = cellOriginY & 255;

    // --- Step 7: Calculate contributions from each corner ---
    // Corner A (origin)
    let falloffA = 0.5 - differenceX0 * differenceX0 - differenceY0 * differenceY0;
    if (falloffA >= 0) {
      const gradientIndexA = wrappedCellX + perm[wrappedCellY];
      const gradientXA = permGrad2x[gradientIndexA];
      const gradientYA = permGrad2y[gradientIndexA];
      falloffA *= falloffA;
      contributionA = falloffA * falloffA * (gradientXA * differenceX0 + gradientYA * differenceY0);
    }

    // Corner B (middle)
    let falloffB = 0.5 - deltaX1 * deltaX1 - deltaY1 * deltaY1;
    if (falloffB >= 0) {
      const gradientIndexB =
        wrappedCellX + middleCornerOffsetX + perm[wrappedCellY + middleCornerOffsetY];
      const gradientXB = permGrad2x[gradientIndexB];
      const gradientYB = permGrad2y[gradientIndexB];
      falloffB *= falloffB;
      contributionB = falloffB * falloffB * (gradientXB * deltaX1 + gradientYB * deltaY1);
    }

    // Corner C (last)
    let falloffC = 0.5 - deltaX2 * deltaX2 - deltaY2 * deltaY2;
    if (falloffC >= 0) {
      const gradientIndexC = wrappedCellX + 1 + perm[wrappedCellY + 1];
      const gradientXC = permGrad2x[gradientIndexC];
      const gradientYC = permGrad2y[gradientIndexC];
      falloffC *= falloffC;
      contributionC = falloffC * falloffC * (gradientXC * deltaX2 + gradientYC * deltaY2);
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

const size = 600;

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.fillStyle = "#111111";
  context.fillRect(0, 0, size, size);

  Canvas2D.flipY(context, size);

  return context;
}

export function simplexNoise(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  const cool = createNoise2D(Math.random);

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const nx = x / size;
      const ny = y / size;
      // const value = noise(nx, ny, 7) * 0.5 + 0.5;
      const scale = 5;
      const value = cool(nx * scale, ny * scale) * 0.5 + 0.5;

      context.fillStyle = Colors.getRGBGrayscale(value);
      context.fillRect(x, y, 1, 1);
    }
  }
}
