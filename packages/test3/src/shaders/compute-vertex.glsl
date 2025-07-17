#version 300 es
precision highp float;

out vec2 tf_position;

in vec2 a_position;
in vec2 a_origin;
in float a_random;

uniform vec2 u_input;
uniform vec2 u_returnSpeed;
uniform float u_repelSpeed;
uniform float u_repelRadius;

const vec2 ZERO = vec2(0.0);
const float MIN = 0.0000000001;

vec2 warp(vec2 coordinates) {
  vec2 warped = coordinates;

  if      (warped.x >= 1.0) warped.x = 0.0;
  else if (warped.x <= 0.0) warped.x = 1.0;

  if      (warped.y >= 1.0) warped.y = 0.0;
  else if (warped.y <= 0.0) warped.y = 1.0;

  return warped;
}

vec2 getReturnVelocity() {
  float speed = mix(u_returnSpeed.r, u_returnSpeed.g, a_random);

  vec2 difference = a_origin - a_position;
  float magnitudeSquared = difference.x * difference.x + difference.y * difference.y;
  if(magnitudeSquared <= MIN)
    return ZERO;

  float magnitude = sqrt(magnitudeSquared);

  vec2 direction = difference / magnitude;
  vec2 velocity = direction * magnitude * speed;

  return velocity;
}

vec2 getRepelVelocity() {
  vec2 difference = a_position - u_input;
  float magnitudeSquared = difference.x * difference.x + difference.y * difference.y;
  if(magnitudeSquared >= u_repelRadius * u_repelRadius)
    return ZERO;

  float magnitude = sqrt(magnitudeSquared);

  vec2 direction = difference / magnitude;
  vec2 velocity = direction * magnitude * u_repelSpeed;

  return velocity;
}

void main() {
  vec2 velocity = ZERO;
  velocity += getReturnVelocity();
  velocity += getRepelVelocity();

  tf_position = warp(a_position + velocity);
}

