#version 300 es

in vec2 a_position;

out vec2 tf_position;

uniform float u_speed;

vec2 warp(vec2 coordinates) {
  vec2 warped = coordinates;

  if      (warped.x >= 1.0) warped.x = 0.0;
  else if (warped.x <= 0.0) warped.x = 1.0;

  if      (warped.y >= 1.0) warped.y = 0.0;
  else if (warped.y <= 0.0) warped.y = 1.0;

  return warped;
}

void main() {
  tf_position = warp(a_position + 1.0 * u_speed);
}
