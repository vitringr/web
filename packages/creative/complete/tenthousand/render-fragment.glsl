#version 300 es
precision highp float;

flat in vec3 v_texelColor;

out vec4 outColor;

uniform GlobalStaticData {
  float u_brightness;
  float u_speed;
  float u_minSize;
  float u_sizeScalar;
};

void main() {
  outColor = vec4(v_texelColor * u_brightness, 1.0);
}
