#version 300 es
precision highp float;

in vec2 a_position;
in vec2 a_origin;
in float a_random;

uniform float u_minSpeed;
uniform float u_maxSpeed;

out vec2 tf_position;

vec2 warp(vec2 coordinates) {
  vec2 warped = coordinates;

  if      (warped.x >= 1.0) warped.x = 0.0;
  else if (warped.x <= 0.0) warped.x = 1.0;

  if      (warped.y >= 1.0) warped.y = 0.0;
  else if (warped.y <= 0.0) warped.y = 1.0;

  return warped;
}

void main() {
  float speed = mix(u_minSpeed, u_maxSpeed, a_random);

  vec2 velocity = vec2(1.0) * speed;

  tf_position = warp(a_origin + (0.0001 * a_position) + velocity);
}
