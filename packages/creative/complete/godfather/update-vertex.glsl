#version 300 es

in vec2 a_currentPosition;
in float a_weight;

out vec2 newPosition;
out vec3 texelColor;

uniform sampler2D u_textureIndex;
uniform float u_deltaTime;
uniform GlobalStaticData {
  float u_minColor;
  float u_minPointSize;
  float u_colorPointSizeScalar;
  float u_colorSlowScalar;
  float u_minGravity;
  float u_minLimitGravity;
  float u_maxLimitGravity;
};

float random(vec2 st) {
  return fract(43758.5453 * fract(st.x * 0.2987 + st.y * 0.5652));
}

vec2 warp(vec2 coordinates) {
  vec2 warped = coordinates;
  if (warped.y <= 0.0) {
    warped.y += 1.1;
    warped.x = random(warped);
  }
  return warped;
}

void main() {
  float limitGravity = mix(u_minLimitGravity, u_maxLimitGravity, a_weight);

  texelColor = texture(u_textureIndex, a_currentPosition).rgb;
  float totalColor = u_colorSlowScalar * (texelColor.x + texelColor.y + texelColor.z);

  float normalizedColorInverse = clamp(1.0 / totalColor, 0.0, 1.0);

  float gravity = mix(u_minGravity, limitGravity, normalizedColorInverse) * u_deltaTime;

  newPosition = warp(a_currentPosition - vec2(0.0, gravity));
}
