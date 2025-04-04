#version 300 es

in vec2 a_newPosition;
in float a_distanceFromOrigin;

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
  gl_PointSize = u_minPointSize + a_distanceFromOrigin * u_pointSizeByOriginDistance;

  vec2 clipSpace = a_newPosition * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}
