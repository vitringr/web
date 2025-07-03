const float F = 0.3660254037844386;
const float G = 0.2113248654051871;

const float GRADIENTS_X[16] = float[16](
  1.0, 1.0, 1.0, 0.0, 0.0, 0.0, -1.0, -1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 1.0
);

const float GRADIENTS_Y[16] = float[16](
  0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, -1.0, -1.0, -1.0, -1.0, -1.0, 0.0
);

const int PERMUTATIONS[512] = int[512](
  51, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
  36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120,
  234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
  88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
  134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133,
  230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
  1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
  116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250,
  124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227,
  47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
  154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98,
  108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
  242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
  239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121,
  50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
  141, 128, 195, 78, 66, 215, 61, 156, 18,
  // Duplicate
  51, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
  36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120,
  234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
  88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
  134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133,
  230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
  1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
  116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250,
  124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227,
  47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
  154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98,
  108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
  242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
  239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121,
  50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
  141, 128, 195, 78, 66, 215, 61, 156, 18
);

int hash(int x, int y) {
  return PERMUTATIONS[(x & 0xff) + PERMUTATIONS[y & 0xff]];
}

float getNoise(vec2 inputs) {
  float S = (inputs.x + inputs.y) * F;
  vec2 input_square = inputs + S; 

  vec2 square_A = floor(input_square);

  vec2 fraction = input_square - square_A;
  bool isBotTriangle = fraction.x > fraction.y;

  vec2 offset_B;
  if (isBotTriangle) {
    offset_B.x = 1.0;
    offset_B.y = 0.0;
  } else {
    offset_B.x = 0.0;
    offset_B.y = 1.0;
  }

  vec2 square_B = square_A + offset_B;

  vec2 square_C = square_A + 1.0;

  float TA = (square_A.x + square_A.y) * G;
  vec2 triangle_A = square_A - TA;

  float TB = (square_B.x + square_B.y) * G;
  vec2 triangle_B = square_B - TB;

  float TC = (square_C.x + square_C.y) * G;
  vec2 triangle_C = square_C - TC;

  vec2 delta_A = inputs - triangle_A;
  vec2 delta_B = inputs - triangle_B;
  vec2 delta_C = inputs - triangle_C;

  vec3 distances_squared = vec3(
    delta_A.x * delta_A.x + delta_A.y * delta_A.y,
    delta_B.x * delta_B.x + delta_B.y * delta_B.y,
    delta_C.x * delta_C.x + delta_C.y * delta_C.y
  );

  vec3 influences = 0.5 - distances_squared;

  vec3 contributions = vec3(0.0, 0.0, 0.0);

  if (influences.r > 0.0) {
    int index = hash(int(square_A.x), int(square_A.y)) & 0xf;
    float dot = GRADIENTS_X[index] * delta_A.x + GRADIENTS_Y[index] * delta_A.y;
    float influence_quartic = influences.r * influences.r * influences.r * influences.r;
    contributions.r = dot * influence_quartic;
  }

  if (influences.g > 0.0) {
    int index = hash(int(square_B.x), int(square_B.y)) & 0xf;
    float dot = GRADIENTS_X[index] * delta_B.x + GRADIENTS_Y[index] * delta_B.y;
    float influence_quartic = influences.g * influences.g * influences.g * influences.g;
    contributions.g = dot * influence_quartic;
  }

  if (influences.b > 0.0) {
    int index = hash(int(square_C.x), int(square_C.y)) & 0xf;
    float dot = GRADIENTS_X[index] * delta_C.x + GRADIENTS_Y[index] * delta_C.y;
    float influence_quartic = influences.b * influences.b * influences.b * influences.b;
    contributions.b = dot * influence_quartic;
  }

  float result = contributions.r + contributions.g + contributions.b;

  return result * 35.0 + 0.5;
}
