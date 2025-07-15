#version 300 es

precision highp float;

uniform float u_time;
uniform float u_resolution;

out vec4 outColor;

void main() {
  outColor = vec4(0.0, 0.3, 0.4, 1.0);
  vec2 point = gl_FragCoord.xy / u_resolution;

  if(point.x > sin(u_time) * 0.5 + 0.5) {
    outColor = vec4(0.3, 0.3, 0.4, 1.0);
  }
}
