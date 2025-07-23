#version 300 es
precision lowp float;

uniform sampler2D u_textureIndex;
uniform vec2 u_resolution;
uniform bool u_pass;

in vec2 v_coordinates;
out vec4 fragColor;

const vec3 COLOR_MAIN  = vec3(1.0, 0.3, 0.0);
const vec3 COLOR_SPAWN = vec3(1.0);
const float LIFETIME_UP   = 0.12;
const float LIFETIME_DOWN = 0.01;
const float PASSIVE_BRIGHTNESS = 0.16;
// const float 

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

vec4 simulationPass() {
  vec2 cellSize = 1.0 / u_resolution;

  vec4 state = getState(v_coordinates);
  float isAlive  = state.r;
  float lifetime = state.g;

  float liveNeighbors = 0.0;
  for (int i = 0; i < 8; i++) {
    vec2 offset = NEIGHBORS[i] * cellSize;
    vec4 neighborState = getState(v_coordinates + offset);
    liveNeighbors += neighborState.r;
  }

  float newIsAlive = isAlive > 0.0 ?
    (liveNeighbors >= 2.0 && liveNeighbors <= 3.0) ? 1.0 : 0.0 :
    (liveNeighbors == 3.0) ? 1.0 : 0.0;

  float newLifetime = newIsAlive > 0.0 ?
    lifetime + LIFETIME_UP :
    lifetime - LIFETIME_DOWN;

  newLifetime = clamp(newLifetime, 0.0, 1.0);

  return vec4(newIsAlive, newLifetime, 0.0, 0.0);
}

vec4 renderPass() {
  float isAlive  = getState(v_coordinates).r;
  float lifetime = getState(v_coordinates).g;

  vec3 aliveColor = mix(COLOR_SPAWN, COLOR_MAIN, pow(lifetime, 6.0));
  vec3 deadColor = (COLOR_MAIN * lifetime) * (1.0 - PASSIVE_BRIGHTNESS) + PASSIVE_BRIGHTNESS;

  vec3 color = isAlive > 0.0 ? aliveColor : deadColor;

  return vec4(color, 1.0);
}

void main() {
  fragColor = u_pass ?  renderPass() : simulationPass();
}
