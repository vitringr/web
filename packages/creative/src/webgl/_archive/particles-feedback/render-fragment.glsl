#version 300 es
precision highp float;

out vec4 outColor;

void main() {
  const float brightness = 0.7;

  const vec3 color = vec3(1.0, 0.0, 0.0) * brightness;

  outColor = vec4(color, 1.0);
}
