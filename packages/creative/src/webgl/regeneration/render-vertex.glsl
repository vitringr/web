#version 300 es

in vec2 a_newPosition;
in vec2 a_originalPosition;

uniform GlobalStaticData {
  float u_originPullScalar;
  float u_toggleOriginPullScalar;
  float u_repelScalar;
  float u_repelNearestScalar;
  float u_maxRepelDistance;
  float u_minPointSize;
  float u_pointSizeByOriginDistance;
};

void main() {
  float distanceFromOrigin = distance(a_newPosition, a_originalPosition);
  gl_PointSize = u_minPointSize + distanceFromOrigin * u_pointSizeByOriginDistance;
  // gl_PointSize = 1.0;

  vec2 clipSpace = a_newPosition * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}
