#version 300 es

precision highp float;

uniform float u_time;
uniform float u_resolution;

out vec4 outColor;

const float TAU = 6.283185307179586;

float getRandom(vec2 coordinates) {
  return fract(sin(dot(coordinates, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 getRandomGradient(vec2 coordinates) {
  float randomValue = getRandom(coordinates) + u_time * 0.0005;
  float angle = randomValue * TAU;
  return vec2(cos(angle), sin(angle));
}

vec2 fade(vec2 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float getPerlinNoise(vec2 point) {
  vec2 gridIndex    = floor(point);
  vec2 gridFraction = fract(point);

  vec2 gradient_BL = getRandomGradient(gridIndex);
  vec2 gradient_BR = getRandomGradient(gridIndex + vec2(1.0, 0.0)); 
  vec2 gradient_TL = getRandomGradient(gridIndex + vec2(0.0, 1.0));
  vec2 gradient_TR = getRandomGradient(gridIndex + vec2(1.0, 1.0));

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

  return perlinNoise * 0.70710678 + 0.5;
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

  float n1 = getFractalNoise(point * 6.0 + vec2(0.0), 8);
  float n2 = getFractalNoise(point * 6.0 + vec2(3.6), 8);

  float all = getFractalNoise(vec2(n1, n2) * 5.0, 1);

  color = vec3(all);

  outColor = vec4(color, 1.0);
}
