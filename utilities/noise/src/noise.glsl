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
