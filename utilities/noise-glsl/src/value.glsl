float getRandom(vec2 coordinates) {
    return fract(sin(dot(coordinates, vec2(12.9898, 78.233))) * 43758.5453);
}

float getNoise(vec2 point) {
  vec2 gridIndex    = floor(point);
  vec2 gridFraction = fract(point);

  // Optional smoothing
  gridFraction = smoothstep(0.0, 1.0, gridFraction);

  float botLeft  = getRandom(gridIndex);
  float botRight = getRandom(gridIndex + vec2(1.0, 0.0));
  float topLeft  = getRandom(gridIndex + vec2(0.0, 1.0));
  float topRight = getRandom(gridIndex + vec2(1.0, 1.0));

  float bot = mix(botLeft, botRight, gridFraction.x);
  float top = mix(topLeft, topRight, gridFraction.x);

  float valueNoise = mix(bot, top, gridFraction.y);

  return valueNoise;
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
