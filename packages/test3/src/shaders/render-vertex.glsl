#version 300 es
precision highp float;

in vec2 tf_position;
in float a_random;

out float passRandom;

uniform float u_minSize;
uniform float u_maxSize;

void main() {
  float size = mix(u_minSize, u_maxSize, a_random);
  gl_PointSize = size;

  vec2 clipSpace = tf_position * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0);

  passRandom = a_random;
}
