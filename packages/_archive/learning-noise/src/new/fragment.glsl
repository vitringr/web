#version 300 es

precision highp float;

out vec4 outColor;

const vec2 CIRCLE_CENTER = vec2(0.5, 0.5);
const float CIRCLE_RADIUS = 0.2;

const vec4 RED = vec4(1.0, 0.3, 0.4, 1.0);
const vec4 BLUE = vec4(0.0, 0.3, 0.4, 1.0);

void main() {
  vec2 point = gl_FragCoord.xy / 600.0;

  outColor = BLUE;

  float distance = distance(point, CIRCLE_CENTER);

  if(distance < CIRCLE_RADIUS) {
    outColor = RED;
  }
}
