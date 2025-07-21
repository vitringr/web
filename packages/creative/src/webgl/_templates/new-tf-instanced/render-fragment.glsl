#version 300 es
precision highp float;

in float v_state;

out vec4 outColor;

const vec3 COLOR_BLUE  = vec3(0.0, 0.3, 0.4);
const vec3 COLOR_RED   = vec3(0.8, 0.3, 0.4);
const vec3 COLOR_BLACK = vec3(0.0);

void main() {
  vec3 color;
  float brightness = 1.0;

  color = COLOR_BLUE;
  if(gl_FragCoord.x < 300.0) color = COLOR_RED;
  if(v_state == 0.0) brightness = 0.5;

  color *= brightness;
  outColor = vec4(color, 1.0);
}
