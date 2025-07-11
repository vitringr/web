#version 300 es

in vec2 a_currentPosition;
in vec2 a_originalPosition;

out vec2 tf_newPosition;

uniform vec2 u_pointerPosition;
uniform bool u_pointerDown;
uniform float u_deltaTime;

uniform float u_originPullScalar;
uniform float u_toggleOriginPullScalar;
uniform float u_repelScalar;
uniform float u_repelNearestScalar;
uniform float u_maxRepelDistance;
uniform float u_minPointSize;
uniform float u_pointSizeByOriginDistance;

const vec2 ZERO = vec2(0.0, 0.0);

vec2 originPull(vec2 position, vec2 origin) {
  float scalar = u_pointerDown ? u_toggleOriginPullScalar : u_originPullScalar;
  return -1.0 * scalar * (position - origin);
}

vec2 repel(vec2 position, vec2 pointer) {
  float distanceToPointer = distance(position, pointer);

  if(distanceToPointer >= u_maxRepelDistance)
    return ZERO;

  vec2 direction = normalize(position - pointer);

  float inverse = 1.0 / distanceToPointer;
  float repelByDistance = clamp(inverse, 1.0, 1.0 + u_repelNearestScalar);

  return u_repelScalar * direction * repelByDistance;
}

void main() {
  vec2 velocity = ZERO;

  velocity += originPull(a_currentPosition, a_originalPosition);
  velocity += repel(a_currentPosition, u_pointerPosition);
  velocity = u_deltaTime * clamp(velocity, vec2(-1.0, -1.0), vec2(1.0, 1.0));

  tf_newPosition = a_currentPosition + velocity;
}
