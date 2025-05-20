#version 300 es
precision highp float;

#define PI radians(180.0)
#define TAU radians(360.0)

const vec2 DIMENSIONS = vec2(0.0, 1.0);

in vec2 v_coordinates;

out vec4 outData;

uniform sampler2D u_oldTextureIndex;
uniform float u_deltaTime;

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
  vec3 firstData = texture(u_oldTextureIndex, v_coordinates).rgb;

  vec2 position = firstData.xy;
  float angle = firstData.z * TAU;

  const float speed = 0.4;

  vec2 direction = vec2(cos(angle), sin(angle));

  position = warp(position);
  position += direction * speed * u_deltaTime;

  outData = vec4(
    position,
    firstData.z,
    0.0
  );
}
