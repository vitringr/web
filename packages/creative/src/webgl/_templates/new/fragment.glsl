#version 300 es

precision highp float;

uniform float u_time;
uniform float u_resolution;

out vec4 outColor;

void main() {
  outColor = vec4(0.0, 0.3, 0.4, 1.0);
  vec2 point = gl_FragCoord.xy / u_resolution;

  if(gl_FragCoord.x < 300.0) outColor = vec4(0.6, 0.3, 0.4, 1.0);
}
