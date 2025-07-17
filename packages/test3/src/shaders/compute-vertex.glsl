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

  vec2 differenceFromOrigin = a_origin - a_position;
  float distanceFromOrigin = distance(a_origin, a_position);
  vec2 directionToOrigin = differenceFromOrigin / distanceFromOrigin;
  float slowdown = min(distanceFromOrigin, 1.0);
  vec2 velocity = directionToOrigin * speed * slowdown;

  tf_position = warp(a_position + velocity);
}
