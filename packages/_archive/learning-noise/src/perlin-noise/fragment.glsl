#version 300 es

precision highp float;

out vec4 outColor;

uniform float u_time;
uniform float u_resolution;

const float GRID_RESOLUTION = 8.0;

const vec2 GRADIENTS[32] = vec2[32](
  vec2( 1.0,                 0.0               ),
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
  vec2(-0.5555702330196020,  0.8314696123025453),
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
  vec2( 0.3826834323650900, -0.9238795325112866),
  vec2( 0.5555702330196018, -0.8314696123025455),
  vec2( 0.7071067811865474, -0.7071067811865477),
  vec2( 0.8314696123025452, -0.5555702330196022),
  vec2( 0.9238795325112865, -0.3826834323650904),
  vec2( 0.9807852804032303  -0.1950903220161287)
);

vec2 fade(vec2 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float getRandom(vec2 coordinates) {
  return fract(sin(dot(coordinates, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 getRandomGradient(vec2 coordinates) {
  float randomValue = getRandom(coordinates);
  int index = int(randomValue * 32.0) & 31;
  return GRADIENTS[index];
}

vec2 grg(vec2 coordinates) {
  float randomValue = getRandom(coordinates) + u_time * 0.001;

  float angle = randomValue * 6.28318;

  return vec2(cos(angle), sin(angle));
}

float getPerlinNoise(vec2 point) {
  vec2 gridIndex    = floor(point);
  vec2 gridFraction = fract(point);

  vec2 gradient_BL = grg(gridIndex);
  vec2 gradient_BR = grg(gridIndex + vec2(1.0, 0.0)); 
  vec2 gradient_TL = grg(gridIndex + vec2(0.0, 1.0));
  vec2 gradient_TR = grg(gridIndex + vec2(1.0, 1.0));

  vec2 to_BL = gridFraction - vec2(0.0, 0.0);
  vec2 to_BR = gridFraction - vec2(1.0, 0.0);
  vec2 to_TL = gridFraction - vec2(0.0, 1.0);
  vec2 to_TR = gridFraction - vec2(1.0, 1.0);

  float dot_BL = dot(to_BL, gradient_BL);
  float dot_BR = dot(to_BR, gradient_BR);
  float dot_TL = dot(to_TL, gradient_TL);
  float dot_TR = dot(to_TR, gradient_TR);

  gridFraction = fade(gridFraction);

  float bot = mix(dot_BL, dot_BR, gridFraction.x);
  float top = mix(dot_TL, dot_TR, gridFraction.x);

  float perlinNoise = mix(bot, top, gridFraction.y);

  return perlinNoise;
}

float getFractalNoise(vec2 point, int octaves) {
  float total = 0.0;
  float frequency = 1.0;
  float amplitude = 1.0;
  float maxValue = 0.0;

  for(int i = 0; i < octaves; i++) {
    total += getPerlinNoise(point * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }

  return total / maxValue;
}

void main() {
  vec3 color = vec3(0.0);
  vec2 point = gl_FragCoord.xy / u_resolution;

  point *= 3.0;

  float perlinNoise = getPerlinNoise(point);
  float fractalNoise = getFractalNoise(point, 7);

  float r = 1.0 - abs(fractalNoise);
  r = pow(r, 14.0);
  color = vec3(r, 0.0, 0.0);
  // color = vec3(r, r, r);

  outColor = vec4(color, 1.0);
}
