#version 300 es

precision highp float;

#define PI radians(180.0)
#define TAU radians(360.0)

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;

out vec4 outColor;

void main() {
  outColor = vec4(0, 0.3, 0, 1);
}
