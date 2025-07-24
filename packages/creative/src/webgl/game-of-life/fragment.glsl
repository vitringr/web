#version 300 es
precision lowp float;

uniform sampler2D u_textureIndex;
uniform bool u_pass;

uniform vec2 u_resolution;
uniform vec3 u_colorMain;
uniform vec3 u_colorSpawn;
uniform float u_lifetimeUp;
uniform float u_lifetimeDown;
uniform float u_passiveBrightness;
uniform float u_pointerRadius;

uniform vec2 u_pointer;
uniform float u_clicked;

in vec2 v_coordinates;
out vec4 fragColor;

const vec2 NEIGHBORS[8] = vec2[8](
  vec2( 0.0,  1.0), // NORTH
  vec2( 1.0,  1.0), // NORTHEAST
  vec2( 1.0,  0.0), // EAST
  vec2( 1.0, -1.0), // SOUTHEAST
  vec2( 0.0, -1.0), // SOUTH
  vec2(-1.0, -1.0), // SOUTHWEST
  vec2(-1.0,  0.0), // WEST
  vec2(-1.0,  1.0)  // NORTHWEST
);

vec4 getState(vec2 c) {
  return texture(u_textureIndex, c);
}

bool isPointerNear() {
  float xDifference = v_coordinates.x - u_pointer.x;
  float yDifference = v_coordinates.y - u_pointer.y;

  float distanceSquared = xDifference * xDifference + yDifference * yDifference;

  return distanceSquared <= u_pointerRadius * u_pointerRadius;
}

vec4 simulationPass() {
  vec4 state = getState(v_coordinates);

  // if(u_clicked == 1.0) return vec4(0.0);
  if(u_clicked == 1.0 && isPointerNear()) {
    return vec4(1.0, state.gba);
  }

  vec2 cellSize = 1.0 / u_resolution;

  float liveNeighbors = 0.0;
  for (int i = 0; i < 8; i++) {
    vec2 offset = NEIGHBORS[i] * cellSize;
    vec4 neighborState = getState(v_coordinates + offset);
    liveNeighbors += neighborState.r;
  }

  float isAlive  = state.r;
  float lifetime = state.g;

  float newIsAlive = isAlive > 0.0 ?
    (liveNeighbors >= 2.0 && liveNeighbors <= 3.0) ? 1.0 : 0.0 :
    (liveNeighbors == 3.0) ? 1.0 : 0.0;

  float newLifetime = newIsAlive > 0.0 ?
    lifetime + u_lifetimeUp :
    lifetime - u_lifetimeDown;

  newLifetime = clamp(newLifetime, 0.0, 1.0);

  return vec4(newIsAlive, newLifetime, 0.0, 0.0);
}

vec4 renderPass() {
  float isAlive  = getState(v_coordinates).r;
  float lifetime = getState(v_coordinates).g;

  vec3 aliveColor = mix(u_colorSpawn, u_colorMain, pow(lifetime, 6.0));
  vec3 deadColor = (u_colorMain * lifetime) * (1.0 - u_passiveBrightness) + u_passiveBrightness;

  vec3 color = isAlive > 0.0 ? aliveColor : deadColor;

  return vec4(color, 1.0);
}

void main() {
  fragColor = u_pass ?  renderPass() : simulationPass();
}
