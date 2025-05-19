const F = 0.3660254037844386;
const G = 0.2113248654051871;

const GRADIENTS_X = new Int8Array([
  1, 1, 1, 0, 0, 0, -1, -1, -1, -1, -1, 0, 0, 0, 1, 1,
]) as Readonly<Int8Array>;

const GRADIENTS_Y = new Int8Array([
  0, 0, 1, 1, 1, 1, 1, 0, 0, 0, -1, -1, -1, -1, -1, 0,
]) as Readonly<Int8Array>;

const PERMUTATIONS = new Uint8Array([
  51, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36,
  103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75,
  0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149,
  56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27,
  166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92,
  41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209,
  76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164,
  100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147,
  118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28,
  42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101,
  155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
  178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
  191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
  181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
  138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215,
  61, 156, 18,
  // Duplicate
  51, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36,
  103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75,
  0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149,
  56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27,
  166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92,
  41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209,
  76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164,
  100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147,
  118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28,
  42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101,
  155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
  178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
  191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
  181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
  138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215,
  61, 156, 18,
]) as Readonly<Uint8Array>;

function hash(x: number, y: number): number {
  return PERMUTATIONS[(x & 0xff) + PERMUTATIONS[y & 0xff]];
}

export function get(input_x: number, input_y: number): number {
  // --------------------------------
  // -- Skew input to square space --
  // --------------------------------

  const S = (input_x + input_y) * F;
  const input_square_x = input_x + S;
  const input_square_y = input_y + S;

  // ---------------------------------
  // -- Floor to find square origin --
  // ---------------------------------

  const square_A_x = Math.floor(input_square_x) | 0;
  const square_A_y = Math.floor(input_square_y) | 0;

  // -----------------------------------------------------
  // -- Find cell fraction and determine which triangle --
  // -----------------------------------------------------

  const fraction_x = input_square_x - square_A_x;
  const fraction_y = input_square_y - square_A_y;
  const isBotTriangle = fraction_x > fraction_y;

  // --------------------------------
  // -- Find other square vertices --
  // --------------------------------

  let offset_B_x;
  let offset_B_y;
  if (isBotTriangle) {
    offset_B_x = 1;
    offset_B_y = 0;
  } else {
    offset_B_x = 0;
    offset_B_y = 1;
  }

  const square_B_x = square_A_x + offset_B_x;
  const square_B_y = square_A_y + offset_B_y;

  const square_C_x = square_A_x + 1;
  const square_C_y = square_A_y + 1;

  // ----------------------------------------------
  // -- Unskew square vertices to triangle space --
  // ----------------------------------------------

  const TA = (square_A_x + square_A_y) * G;
  const triangle_A_x = square_A_x - TA;
  const triangle_A_y = square_A_y - TA;

  const TB = (square_B_x + square_B_y) * G;
  const triangle_B_x = square_B_x - TB;
  const triangle_B_y = square_B_y - TB;

  const TC = (square_C_x + square_C_y) * G;
  const triangle_C_x = square_C_x - TC;
  const triangle_C_y = square_C_y - TC;

  // -------------------------------------------
  // -- Difference between input and vertices --
  // -------------------------------------------

  const delta_A_x = input_x - triangle_A_x;
  const delta_A_y = input_y - triangle_A_y;

  const delta_B_x = input_x - triangle_B_x;
  const delta_B_y = input_y - triangle_B_y;

  const delta_C_x = input_x - triangle_C_x;
  const delta_C_y = input_y - triangle_C_y;

  // -----------------------
  // -- Influence kernels --
  // -----------------------

  const distance_A_squared = delta_A_x * delta_A_x + delta_A_y * delta_A_y;
  const distance_B_squared = delta_B_x * delta_B_x + delta_B_y * delta_B_y;
  const distance_C_squared = delta_C_x * delta_C_x + delta_C_y * delta_C_y;

  const kernel_A = 0.5 - distance_A_squared;
  const kernel_B = 0.5 - distance_B_squared;
  const kernel_C = 0.5 - distance_C_squared;

  // -------------------
  // -- Contributions --
  // -------------------

  let contribution_A = 0;
  let contribution_B = 0;
  let contribution_C = 0;

  if (kernel_A > 0) {
    const index = hash(square_A_x, square_A_y) & 0xf;
    const dot = GRADIENTS_X[index] * delta_A_x + GRADIENTS_Y[index] * delta_A_y;
    const kernel_quartic = kernel_A * kernel_A * kernel_A * kernel_A;
    contribution_A = dot * kernel_quartic;
  }

  if (kernel_B > 0) {
    const index = hash(square_B_x, square_B_y) & 0xf;
    const dot = GRADIENTS_X[index] * delta_B_x + GRADIENTS_Y[index] * delta_B_y;
    const kernel_quartic = kernel_B * kernel_B * kernel_B * kernel_B;
    contribution_B = dot * kernel_quartic;
  }

  if (kernel_C > 0) {
    const index = hash(square_C_x, square_C_y) & 0xf;
    const dot = GRADIENTS_X[index] * delta_C_x + GRADIENTS_Y[index] * delta_C_y;
    const kernel_quartic = kernel_C * kernel_C * kernel_C * kernel_C;
    contribution_C = dot * kernel_quartic;
  }

  const result = contribution_A + contribution_B + contribution_C;

  // ---------------------------------------------------------------
  // -- Arbitrary numbers to fit the output into the [0, 1] range --
  // ---------------------------------------------------------------

  return result * 35 + 0.5;
}
