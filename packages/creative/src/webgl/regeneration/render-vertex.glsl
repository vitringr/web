#version 300 es

in vec2 a_newPosition;
in vec2 a_originalPosition;

uniform float u_minPointSize;
uniform float u_pointSizeByOriginDistance;

void main() {
  float distanceFromOrigin = distance(a_newPosition, a_originalPosition);
  gl_PointSize = u_minPointSize + distanceFromOrigin * u_pointSizeByOriginDistance;

  vec2 clipSpace = a_newPosition * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}
