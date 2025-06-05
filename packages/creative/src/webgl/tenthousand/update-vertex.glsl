#version 300 es

in vec2 a_oldPosition;
in vec2 a_velocity;

out vec2 newPosition;

uniform GlobalStaticData {
  float u_brightness;
  float u_speed;
  float u_minSize;
  float u_sizeScalar;
};

const vec2 DIMENSIONS = vec2(0.0, 1.0);

vec2 warp(vec2 coordinates) {
  vec2 warped = coordinates;

  if(warped.x >= DIMENSIONS.y) {
    warped.x = DIMENSIONS.x;
  } else if (warped.x <= DIMENSIONS.x) {
    warped.x = DIMENSIONS.y;
  }

  if(warped.y >= DIMENSIONS.y) {
    warped.y = DIMENSIONS.x;
  } else if (warped.y <= DIMENSIONS.x) {
    warped.y = DIMENSIONS.y;
  }

  return warped;
}

void main() {
  vec2 velocity = a_velocity * u_speed;

  newPosition = warp(a_oldPosition + velocity);
}
