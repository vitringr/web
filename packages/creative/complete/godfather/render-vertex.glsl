#version 300 es

in vec2 a_newPosition;
in vec3 a_texelColor;

out vec3 v_texelColor;

uniform GlobalStaticData {
  float u_minColor;
  float u_minPointSize;
  float u_colorPointSizeScalar;
  float u_colorSlowScalar;
  float u_minGravity;
  float u_minLimitGravity;
  float u_maxLimitGravity;
};

void main() {
  float totalColor = (a_texelColor.x + a_texelColor.y + a_texelColor.z);
  gl_PointSize = u_minPointSize + totalColor * u_colorPointSizeScalar;

  vec2 clipSpace = a_newPosition * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0);

  v_texelColor = a_texelColor;
}
