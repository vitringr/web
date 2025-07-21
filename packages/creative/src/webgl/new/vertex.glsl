#version 300 es

in vec2 a_shapeVertex;
in vec2 a_position;

uniform float u_time;

void main() {
  vec2 center = a_position;

  vec2 vertexPosition = center + a_shapeVertex;

  vec2 clipSpace = vertexPosition * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}
