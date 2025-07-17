#version 300 es
precision highp float;

in float passRandom;

out vec4 outColor;

const vec4 COLOR1 = vec4(1.0, 0.5, 0.0, 1.0);
const vec4 COLOR2 = vec4(0.8, 0.6, 0.0, 1.0);
const vec4 COLOR3 = vec4(1.0, 0.3, 0.0, 1.0);
const vec4 COLOR4 = vec4(1.0, 0.8, 0.0, 1.0);
const vec4 COLOR5 = vec4(0.9, 0.1, 0.3, 1.0);

void main() {
  if      (passRandom < 0.2) outColor = COLOR1;
  else if (passRandom < 0.4) outColor = COLOR2;
  else if (passRandom < 0.6) outColor = COLOR3;
  else if (passRandom < 0.8) outColor = COLOR4;
  else                       outColor = COLOR5;
}
