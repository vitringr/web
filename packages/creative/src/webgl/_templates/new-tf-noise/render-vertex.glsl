#version 300 es

in vec2 tf_position;

uniform float u_size;

void main() {
  gl_PointSize = u_size;

  vec2 clipSpace = tf_position * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}
