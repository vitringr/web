#version 300 es

in vec2 a_newPosition;

void main() {
  gl_PointSize = 5.0;

  vec2 clipSpace = a_newPosition * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}
