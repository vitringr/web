out vec2 tf_position;

in vec2 a_position;
in vec2 a_textOrigin;
in float a_random;
in vec2 a_messOrigin;

uniform vec2 u_input;
uniform bool u_isPressed;
uniform vec2 u_returnSpeed;
uniform float u_time;
uniform float u_repelRadius;
uniform float u_repelSpeed;
uniform float u_textNoiseEffect;
uniform float u_messNoiseEffect;
uniform float u_noiseFrequency;

const vec2 ZERO = vec2(0.0);
const float MIN = 0.00000000001;

vec2 getReturnVelocity(vec2 targetOrigin) {
  vec2 difference = targetOrigin - a_position;
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

  float noise = getNoise(a_position * u_noiseFrequency + u_time) * 2.0 - 1.0;

  if(u_isPressed) {
    velocity += getReturnVelocity(a_textOrigin);
    velocity += noise * u_textNoiseEffect;
  } else {
    velocity += getReturnVelocity(a_messOrigin);
    velocity += noise * u_messNoiseEffect;
  }

  velocity += getRepelVelocity();

  tf_position = a_position + velocity ;
}

