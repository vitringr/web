#version 300 es

in vec2 a_newPosition;

void main() {
  vec2 clipSpace = a_newPosition * 2.0 - 1.0;

  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_PointSize = 4.0;
}
