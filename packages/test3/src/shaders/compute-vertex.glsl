#version 300 es
precision highp float;

out vec2 tf_position;

in vec2 a_position;
in vec2 a_origin;
in float a_random;

uniform vec2 u_input;
uniform vec2 u_returnSpeed;
uniform float u_repelRadius;
uniform float u_repelSpeed;

const vec2 ZERO = vec2(0.0);
const float MIN = 0.00000000001;

vec2 getReturnVelocity() {

  vec2 difference = a_origin - a_position;
  float magnitudeSquared = difference.x * difference.x + difference.y * difference.y;
  if(magnitudeSquared <= MIN)
    return ZERO;

  float magnitude = sqrt(magnitudeSquared);

  vec2 direction = difference / magnitude;

  float randomSpeed = mix(u_returnSpeed.r, u_returnSpeed.g, a_random);
  float speed = magnitude * randomSpeed;

  vec2 velocity = direction * speed;

  return velocity;
}

vec2 getRepelVelocity() {
  vec2 difference = a_position - u_input;
  float magnitudeSquared = difference.x * difference.x + difference.y * difference.y;
  if(magnitudeSquared >= u_repelRadius * u_repelRadius)
    return ZERO;

  float magnitude = sqrt(magnitudeSquared);
  vec2 direction = difference / magnitude;

  float speed = (1.0 / magnitude) * u_repelSpeed;
  float distanceToBounds = u_repelRadius - magnitude;
  speed = min(speed, distanceToBounds);

  vec2 velocity = direction * speed;

  return velocity;
}

void main() {
  vec2 velocity = ZERO;
  velocity += getReturnVelocity();
  velocity += getRepelVelocity();

  tf_position = a_position + velocity;
}

