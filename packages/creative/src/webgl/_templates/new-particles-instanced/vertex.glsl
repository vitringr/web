#version 300 es

in vec2 a_shapeVertex;
in vec2 a_position;

uniform float u_time;

void main() {
  vec2 center = a_position;
  center += u_time;
  center = mod(center, 1.0);

  // Apply triangle offset relative to center
  vec2 vertexPos = center + a_shapeVertex;

  vec2 clipSpace = vertexPos * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}
