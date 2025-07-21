#version 300 es

precision highp float;

in float v_state;

out vec4 outColor;

const vec4 COLOR_BLUE  = vec4(0.0, 0.3, 0.4, 1.0);
const vec4 COLOR_RED   = vec4(0.8, 0.3, 0.4, 1.0);
const vec4 COLOR_BLACK = vec4(0.0);

void main() {
  outColor = COLOR_BLUE;
  if(gl_FragCoord.x < 300.0) outColor = COLOR_RED;

  if(v_state == 0.0) outColor = COLOR_BLACK;
}
