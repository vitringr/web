#version 300 es
precision highp float;

in vec2 a_position;
in vec2 a_origin;
in float a_random;

uniform vec2 u_input;
uniform vec2 u_returnSpeed;
uniform vec2 u_repelSpeed;
uniform float u_repelRadius;

out vec2 tf_position;

const vec2 ZERO = vec2(0.0);

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
  float magnitude = sqrt(difference.x * difference.x + difference.y * difference.y);
  if(magnitude <= 0.00001) return ZERO;

  vec2 direction = difference / magnitude;

  vec2 velocity = direction * magnitude * speed;

  return velocity;
}

// vec2 getRepelVelocity(vec2 position, vec2 pointer) {
//   float speed = mix(u_repelSpeed.r, u_repelSpeed.g, a_random);
//
//   float distanceToPointer = distance(position, pointer);
//   if(distanceToPointer >= u_repelRadius)
//     return ZERO;
//
//   vec2 direction = normalize(position - pointer);
//   vec2 velocity = direction * speed;
//
//   // float inverse = 1.0 / distanceToPointer;
//   // float repelByDistance = clamp(inverse, 1.0, 1.0 + u_repelNearestScalar);
//
//   // return u_repelScalar * direction * repelByDistance;
//
//   return velocity;
// }

void main() {
  vec2 velocity = ZERO;
  velocity += getReturnVelocity();
  // velocity += getRepelVelocity(a_position, u_input) * 0.01;

  tf_position = warp(a_position + velocity);
}
