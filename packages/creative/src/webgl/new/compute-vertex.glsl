in vec2 a_position;
in vec2 a_velocity;

out vec2 newPosition;

uniform float u_speed;
uniform float u_noiseFrequency;

const vec2 DIMENSIONS = vec2(0.0, 1.0);

vec2 warp(vec2 coordinates) {
  vec2 warped = coordinates;

  if(warped.r >= DIMENSIONS.g) {
    warped.r = DIMENSIONS.r;
  } else if (warped.r <= DIMENSIONS.r) {
    warped.r = DIMENSIONS.g;
  }

  if(warped.g >= DIMENSIONS.g) {
    warped.g = DIMENSIONS.r;
  } else if (warped.g <= DIMENSIONS.r) {
    warped.g = DIMENSIONS.g;
  }

  return warped;
}

void main() {
  vec2 velocity = a_velocity * u_speed;

  float noise = getNoise(a_position);

  newPosition = warp(a_position + velocity * u_noiseFrequency + noise * u_noiseFrequency);
}
