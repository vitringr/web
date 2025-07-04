#version 300 es

precision highp float;

out vec4 outColor;

void main() {
  outColor = vec4(0.0, 0.3, 0.4, 1.0);

  if(gl_FragCoord.x < 2.0) outColor = vec4(1.0, 0.3, 0.4, 1.0);
}
