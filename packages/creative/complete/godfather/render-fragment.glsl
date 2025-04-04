#version 300 es
precision highp float;

in vec3 v_texelColor;

out vec4 outColor;

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
  vec3 color = u_minColor + (1.0 - u_minColor) * v_texelColor;

  outColor = vec4(color, 1.0);
}
