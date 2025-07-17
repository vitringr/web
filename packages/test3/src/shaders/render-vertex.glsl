#version 300 es

in vec2 tf_position;
in float a_size;

void main() {
  gl_PointSize = a_size;

  vec2 clipSpace = tf_position * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}
