export function create() {
  const F = 0.3660254037844386;
  const G = 0.2113248654051871;

  const GRADIENTS_X = new Float32Array([
    1.0, 0.9807852804032304, 0.9238795325112867, 0.8314696123025452,
    0.7071067811865476, 0.5555702330196023, 0.38268343236508984,
    0.19509032201612833, 0.0, -0.1950903220161282, -0.3826834323650897,
    -0.555570233019602, -0.7071067811865475, -0.8314696123025453,
    -0.9238795325112867, -0.9807852804032304, -1.0, -0.9807852804032304,
    -0.9238795325112868, -0.8314696123025455, -0.7071067811865477,
    -0.5555702330196022, -0.38268343236509034, -0.19509032201612866, 0.0,
    0.1950903220161283, 0.38268343236509, 0.5555702330196018,
    0.7071067811865474, 0.8314696123025452, 0.9238795325112865,
    0.9807852804032303,
  ]) as Readonly<Float32Array>;

  const GRADIENTS_Y = new Float32Array([
    0.0, 0.19509032201612825, 0.3826834323650898, 0.5555702330196022,
    0.7071067811865475, 0.8314696123025452, 0.9238795325112867,
    0.9807852804032304, 1.0, 0.9807852804032304, 0.9238795325112867,
    0.8314696123025453, 0.7071067811865476, 0.5555702330196022,
    0.3826834323650899, 0.1950903220161286, 0.0, -0.19509032201612836,
    -0.38268343236508967, -0.555570233019602, -0.7071067811865475,
    -0.8314696123025452, -0.9238795325112865, -0.9807852804032303, -1.0,
    -0.9807852804032304, -0.9238795325112866, -0.8314696123025455,
    -0.7071067811865477, -0.5555702330196022, -0.3826834323650904,
    -0.19509032201612872,
  ]) as Readonly<Float32Array>;

  const PERMUTATIONS = new Uint8Array([
    9, 159, 97, 66, 201, 20, 105, 192, 168, 220, 72, 253, 5, 88, 190, 162, 163,
    61, 129, 217, 4, 194, 255, 204, 115, 185, 59, 33, 48, 177, 200, 117, 113,
    248, 7, 95, 133, 121, 1, 176, 144, 8, 127, 39, 62, 193, 236, 81, 244, 112,
    75, 51, 80, 11, 70, 0, 175, 60, 116, 142, 102, 135, 85, 137, 106, 32, 13,
    91, 101, 232, 47, 170, 229, 71, 131, 86, 42, 76, 100, 187, 145, 240, 182,
    19, 53, 108, 15, 87, 73, 235, 130, 136, 216, 41, 28, 74, 155, 68, 225, 183,
    38, 231, 156, 211, 64, 228, 152, 254, 46, 154, 207, 212, 17, 83, 150, 203,
    109, 50, 195, 34, 251, 55, 45, 215, 184, 96, 16, 179, 43, 208, 148, 245,
    138, 132, 37, 164, 189, 118, 181, 30, 171, 18, 226, 146, 230, 107, 63, 78,
    134, 196, 44, 198, 3, 93, 25, 123, 158, 219, 69, 124, 247, 140, 103, 94,
    188, 57, 160, 213, 98, 89, 218, 153, 90, 147, 6, 56, 92, 122, 49, 29, 214,
    243, 111, 139, 99, 238, 173, 104, 197, 202, 51, 250, 205, 141, 119, 166, 21,
    58, 234, 165, 239, 77, 172, 36, 2, 237, 167, 110, 241, 126, 210, 24, 209,
    233, 149, 14, 224, 114, 18, 227, 186, 242, 174, 67, 161, 65, 31, 222, 40,
    10, 206, 143, 27, 221, 22, 120, 178, 246, 52, 169, 249, 82, 35, 84, 79, 125,
    54, 23, 128, 199, 252, 157, 223, 26, 191, 12,
    // Duplicate
    9, 159, 97, 66, 201, 20, 105, 192, 168, 220, 72, 253, 5, 88, 190, 162, 163,
    61, 129, 217, 4, 194, 255, 204, 115, 185, 59, 33, 48, 177, 200, 117, 113,
    248, 7, 95, 133, 121, 1, 176, 144, 8, 127, 39, 62, 193, 236, 81, 244, 112,
    75, 51, 80, 11, 70, 0, 175, 60, 116, 142, 102, 135, 85, 137, 106, 32, 13,
    91, 101, 232, 47, 170, 229, 71, 131, 86, 42, 76, 100, 187, 145, 240, 182,
    19, 53, 108, 15, 87, 73, 235, 130, 136, 216, 41, 28, 74, 155, 68, 225, 183,
    38, 231, 156, 211, 64, 228, 152, 254, 46, 154, 207, 212, 17, 83, 150, 203,
    109, 50, 195, 34, 251, 55, 45, 215, 184, 96, 16, 179, 43, 208, 148, 245,
    138, 132, 37, 164, 189, 118, 181, 30, 171, 18, 226, 146, 230, 107, 63, 78,
    134, 196, 44, 198, 3, 93, 25, 123, 158, 219, 69, 124, 247, 140, 103, 94,
    188, 57, 160, 213, 98, 89, 218, 153, 90, 147, 6, 56, 92, 122, 49, 29, 214,
    243, 111, 139, 99, 238, 173, 104, 197, 202, 51, 250, 205, 141, 119, 166, 21,
    58, 234, 165, 239, 77, 172, 36, 2, 237, 167, 110, 241, 126, 210, 24, 209,
    233, 149, 14, 224, 114, 18, 227, 186, 242, 174, 67, 161, 65, 31, 222, 40,
    10, 206, 143, 27, 221, 22, 120, 178, 246, 52, 169, 249, 82, 35, 84, 79, 125,
    54, 23, 128, 199, 252, 157, 223, 26, 191, 12,
  ]) as Readonly<Uint8Array>;

  function hash(x: number, y: number): number {
    return PERMUTATIONS[(x & 0xff) + PERMUTATIONS[y & 0xff]];
  }

  return function(input_x: number, input_y: number): number {
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

    // ---------------------------------
    // -- Influence based on distance --
    // ---------------------------------

    const distance_A_squared = delta_A_x * delta_A_x + delta_A_y * delta_A_y;
    const distance_B_squared = delta_B_x * delta_B_x + delta_B_y * delta_B_y;
    const distance_C_squared = delta_C_x * delta_C_x + delta_C_y * delta_C_y;

    const influence_A = 0.5 - distance_A_squared;
    const influence_B = 0.5 - distance_B_squared;
    const influence_C = 0.5 - distance_C_squared;

    // -------------------
    // -- Contributions --
    // -------------------

    let contribution_A = 0;
    let contribution_B = 0;
    let contribution_C = 0;

    if (influence_A > 0) {
      const index = hash(square_A_x, square_A_y) & 31;
      const dot = GRADIENTS_X[index] * delta_A_x + GRADIENTS_Y[index] * delta_A_y;
      const influence_quartic = influence_A * influence_A * influence_A * influence_A;
      contribution_A = dot * influence_quartic;
    }

    if (influence_B > 0) {
      const index = hash(square_B_x, square_B_y) & 31;
      const dot = GRADIENTS_X[index] * delta_B_x + GRADIENTS_Y[index] * delta_B_y;
      const influence_quartic = influence_B * influence_B * influence_B * influence_B;
      contribution_B = dot * influence_quartic;
    }

    if (influence_C > 0) {
      const index = hash(square_C_x, square_C_y) & 31;
      const dot = GRADIENTS_X[index] * delta_C_x + GRADIENTS_Y[index] * delta_C_y;
      const influence_quartic = influence_C * influence_C * influence_C * influence_C;
      contribution_C = dot * influence_quartic;
    }

    const result = contribution_A + contribution_B + contribution_C;

    // ---------------------------------------------------------------
    // -- Arbitrary numbers that fit the output into the [0, 1] range --
    // ---------------------------------------------------------------

    return result * 35 + 0.5;
  };
}
