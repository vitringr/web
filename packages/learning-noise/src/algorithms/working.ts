import { Canvas2D } from "@utilities/canvas2d";
import { Colors } from "@utilities/colors";
import { Vector2 } from "@utilities/vector";

// PERFORMANCE: Maybe reduce number fractional detail?
const F = 0.3660254037844386; // Skew factor
const G = 0.2113248654051871; // Unskew factor

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

// SIMPLEX INPUT
function noise(x: number, y: number, scale: number) {
  const input_triangle_x = x * scale;
  const input_triangle_y = y * scale;

  // --------------------------------
  // -- Skew input to square space --
  // --------------------------------
  const S = (input_triangle_x + input_triangle_y) * F;
  const input_square_x = input_triangle_x + S;
  const input_square_y = input_triangle_y + S;

  // ------------------------
  // -- Find square origin --
  // ------------------------
  const A_square_x = Math.floor(input_square_x);
  const A_square_y = Math.floor(input_square_y);

  // -----------------------------------------------------
  // -- Find cell fraction and determine which triangle --
  // -----------------------------------------------------
  const fraction_x = input_square_x - A_square_x;
  const fraction_y = input_square_y - A_square_y;
  const isBotTriangle = fraction_x > fraction_y;

  // --------------------------------
  // -- Find other square vertices --
  // --------------------------------
  const B_square_x = A_square_x + (isBotTriangle ? 1 : 0);
  const B_square_y = A_square_y + (isBotTriangle ? 0 : 1);

  const C_square_x = A_square_x + 1;
  const C_square_y = A_square_y + 1;

  // --------------------------------------------
  // -- Unskew square origin to triangle space --
  // --------------------------------------------
  const TA = (A_square_x + A_square_y) * G;
  const A_triangle_x = A_square_x - TA;
  const A_triangle_y = A_square_y - TA;

  const TB = (B_square_x + B_square_y) * G;
  const B_triangle_x = B_square_x - TB;
  const B_triangle_y = B_square_y - TB;

  const TC = (C_square_x + C_square_y) * G;
  const C_triangle_x = C_square_x - TC;
  const C_triangle_y = C_square_y - TC;

  // -------------------------------------------
  // -- Difference between input and vertices --
  // -------------------------------------------
  const delta_A_x = input_triangle_x - A_triangle_x;
  const delta_A_y = input_triangle_y - A_triangle_y;

  const delta_B_x = input_triangle_x - B_triangle_x;
  const delta_B_y = input_triangle_y - B_triangle_y;

  const delta_C_x = input_triangle_x - C_triangle_x;
  const delta_C_y = input_triangle_y - C_triangle_y;

  // ----------------
  // -------------------------
  // ----------------------------------
  // -------------------------------------------
  // -- // -- // -- // -- ---------- -- -- -- --
  // -------------------------------------------
  // ----------------------------------
  // -------------------------
  // ----------------

  // Inside noise() function, after calculating deltas:
  const gradIndexA = hash(A_square_x, A_square_y) % GRADIENTS.length;
  const gradIndexB = hash(B_square_x, B_square_y) % GRADIENTS.length;
  const gradIndexC = hash(C_square_x, C_square_y) % GRADIENTS.length;

  const dotA = GRADIENTS[gradIndexA].x * delta_A_x + GRADIENTS[gradIndexA].y * delta_A_y;
  const dotB = GRADIENTS[gradIndexB].x * delta_B_x + GRADIENTS[gradIndexB].y * delta_B_y;
  const dotC = GRADIENTS[gradIndexC].x * delta_C_x + GRADIENTS[gradIndexC].y * delta_C_y;

  let kernelA = 0.5 - delta_A_x * delta_A_x - delta_A_y * delta_A_y;
  let kernelB = 0.5 - delta_B_x * delta_B_x - delta_B_y * delta_B_y;
  let kernelC = 0.5 - delta_C_x * delta_C_x - delta_C_y * delta_C_y;

  kernelA = kernelA > 0 ? kernelA * kernelA * kernelA * kernelA : 0;
  kernelB = kernelB > 0 ? kernelB * kernelB * kernelB * kernelB : 0;
  kernelC = kernelC > 0 ? kernelC * kernelC * kernelC * kernelC : 0;

  return 70.0 * (dotA * kernelA + dotB * kernelB + dotC * kernelC);
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

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const value = noise(x, y, 0.005) * 0.5 + 0.5;

      context.fillStyle = Colors.getRGBGrayscale(value);
      context.fillRect(x, y, 1, 1);
    }
  }
}
