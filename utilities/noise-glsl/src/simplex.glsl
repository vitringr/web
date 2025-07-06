const float F = 0.3660254037844386;
const float G = 0.2113248654051871;

const vec2 GRADIENTS[32] = vec2[32](
  vec2( 1.0,                 0.0),
  vec2( 0.9807852804032304,  0.1950903220161282),
  vec2( 0.9238795325112867,  0.3826834323650898),
  vec2( 0.8314696123025452,  0.5555702330196022),
  vec2( 0.7071067811865476,  0.7071067811865475),
  vec2( 0.5555702330196023,  0.8314696123025452),
  vec2( 0.3826834323650898,  0.9238795325112867),
  vec2( 0.1950903220161283,  0.9807852804032304),
  vec2( 0.0,                 1.0               ),
  vec2(-0.1950903220161282,  0.9807852804032304),
  vec2(-0.3826834323650897,  0.9238795325112867),
  vec2(-0.5555702330196022,  0.8314696123025453),
  vec2(-0.7071067811865475,  0.7071067811865476),
  vec2(-0.8314696123025453,  0.5555702330196022),
  vec2(-0.9238795325112867,  0.3826834323650899),
  vec2(-0.9807852804032304,  0.1950903220161286),
  vec2(-1.0,                 0.0               ),
  vec2(-0.9807852804032304, -0.1950903220161283),
  vec2(-0.9238795325112868, -0.3826834323650896),
  vec2(-0.8314696123025455, -0.5555702330196020),
  vec2(-0.7071067811865477, -0.7071067811865475),
  vec2(-0.5555702330196022, -0.8314696123025452),
  vec2(-0.3826834323650903, -0.9238795325112865),
  vec2(-0.1950903220161286, -0.9807852804032303),
  vec2( 0.0,                -1.0               ),
  vec2( 0.1950903220161283, -0.9807852804032304),
  vec2( 0.3826834323650897, -0.9238795325112866),
  vec2( 0.5555702330196018, -0.8314696123025455),
  vec2( 0.7071067811865474, -0.7071067811865477),
  vec2( 0.8314696123025452, -0.5555702330196022),
  vec2( 0.9238795325112865, -0.3826834323650904),
  vec2( 0.9807852804032303, -0.1950903220161287)
);

const int PERMUTATIONS[512] = int[512](
  9, 159, 97, 66, 201, 20, 105, 192, 168, 220, 72, 253, 5, 88, 190, 162,
  163, 61, 129, 217, 4, 194, 255, 204, 115, 185, 59, 33, 48, 177, 200, 117,
  113, 248, 7, 95, 133, 121, 1, 176, 144, 8, 127, 39, 62, 193, 236, 81,
  244, 112, 75, 51, 80, 11, 70, 0, 175, 60, 116, 142, 102, 135, 85, 137,
  106, 32, 13, 91, 101, 232, 47, 170, 229, 71, 131, 86, 42, 76, 100, 187,
  145, 240, 182, 19, 53, 108, 15, 87, 73, 235, 130, 136, 216, 41, 28, 74,
  155, 68, 225, 183, 38, 231, 156, 211, 64, 228, 152, 254, 46, 154, 207, 212,
  17, 83, 150, 203, 109, 50, 195, 34, 251, 55, 45, 215, 184, 96, 16, 179,
  43, 208, 148, 245, 138, 132, 37, 164, 189, 118, 181, 30, 171, 18, 226, 146,
  230, 107, 63, 78, 134, 196, 44, 198, 3, 93, 25, 123, 158, 219, 69, 124,
  247, 140, 103, 94, 188, 57, 160, 213, 98, 89, 218, 153, 90, 147, 6, 56,
  92, 122, 49, 29, 214, 243, 111, 139, 99, 238, 173, 104, 197, 202, 51, 250,
  205, 141, 119, 166, 21, 58, 234, 165, 239, 77, 172, 36, 2, 237, 167, 110,
  241, 126, 210, 24, 209, 233, 149, 14, 224, 114, 18, 227, 186, 242, 174, 67,
  161, 65, 31, 222, 40, 10, 206, 143, 27, 221, 22, 120, 178, 246, 52, 169,
  249, 82, 35, 84, 79, 125, 54, 23, 128, 199, 252, 157, 223, 26, 191, 12,
  // Duplicate
  9, 159, 97, 66, 201, 20, 105, 192, 168, 220, 72, 253, 5, 88, 190, 162,
  163, 61, 129, 217, 4, 194, 255, 204, 115, 185, 59, 33, 48, 177, 200, 117,
  113, 248, 7, 95, 133, 121, 1, 176, 144, 8, 127, 39, 62, 193, 236, 81,
  244, 112, 75, 51, 80, 11, 70, 0, 175, 60, 116, 142, 102, 135, 85, 137,
  106, 32, 13, 91, 101, 232, 47, 170, 229, 71, 131, 86, 42, 76, 100, 187,
  145, 240, 182, 19, 53, 108, 15, 87, 73, 235, 130, 136, 216, 41, 28, 74,
  155, 68, 225, 183, 38, 231, 156, 211, 64, 228, 152, 254, 46, 154, 207, 212,
  17, 83, 150, 203, 109, 50, 195, 34, 251, 55, 45, 215, 184, 96, 16, 179,
  43, 208, 148, 245, 138, 132, 37, 164, 189, 118, 181, 30, 171, 18, 226, 146,
  230, 107, 63, 78, 134, 196, 44, 198, 3, 93, 25, 123, 158, 219, 69, 124,
  247, 140, 103, 94, 188, 57, 160, 213, 98, 89, 218, 153, 90, 147, 6, 56,
  92, 122, 49, 29, 214, 243, 111, 139, 99, 238, 173, 104, 197, 202, 51, 250,
  205, 141, 119, 166, 21, 58, 234, 165, 239, 77, 172, 36, 2, 237, 167, 110,
  241, 126, 210, 24, 209, 233, 149, 14, 224, 114, 18, 227, 186, 242, 174, 67,
  161, 65, 31, 222, 40, 10, 206, 143, 27, 221, 22, 120, 178, 246, 52, 169,
  249, 82, 35, 84, 79, 125, 54, 23, 128, 199, 252, 157, 223, 26, 191, 12
);

int hash(ivec2 v) {
  return PERMUTATIONS[(v.x & 0xff) + PERMUTATIONS[v.y & 0xff]];
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

  vec3 contributions = vec3(0.0);

  if (influences.r > 0.0) {
    int index = hash(ivec2(square_A)) & 31;
    float dot = dot(GRADIENTS[index], delta_A);
    float influence_quartic = influences.r * influences.r * influences.r * influences.r;
    contributions.r = dot * influence_quartic;
  }

  if (influences.g > 0.0) {
    int index = hash(ivec2(square_B)) & 31;
    float dot = dot(GRADIENTS[index], delta_B);
    float influence_quartic = influences.g * influences.g * influences.g * influences.g;
    contributions.g = dot * influence_quartic;
  }

  if (influences.b > 0.0) {
    int index = hash(ivec2(square_C)) & 31;
    float dot = dot(GRADIENTS[index], delta_C);
    float influence_quartic = influences.b * influences.b * influences.b * influences.b;
    contributions.b = dot * influence_quartic;
  }

  float result = contributions.r + contributions.g + contributions.b;

  return result * 49.0 + 0.5;
}

float getFractalNoise(vec2 point, int octaves) {
  float total = 0.0;
  float frequency = 1.0;
  float amplitude = 1.0;
  float maxValue = 0.0;

  for(int i = 0; i < octaves; i++) {
    total += getNoise(point * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }

  return total / maxValue;
}
