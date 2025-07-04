#version 300 es

in vec2 a_positions;

uniform float u_time;

void main() {
  vec2 point = a_positions;

  point += u_time;
  point = mod(point, 1.0);

  vec2 clipSpace = point * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0);

  gl_PointSize = 3.0;
}
