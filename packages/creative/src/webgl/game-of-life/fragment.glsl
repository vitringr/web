#version 300 es
precision lowp float;

uniform sampler2D u_textureIndex;
uniform vec2 u_resolution;
uniform bool u_pass;

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

vec4 simulationPass() {
  vec2 cellSize = 1.0 / u_resolution;

  float state    = getState(v_coordinates).r;
  float lifetime = getState(v_coordinates).a;

  float liveNeighbors = 0.0;
  for (int i = 0; i < 8; i++) {
    vec2 offset = NEIGHBORS[i] * cellSize;
    liveNeighbors += getState(v_coordinates + offset).r;
  }

  float newState = state > 0.0 ?
    (liveNeighbors >= 2.0 && liveNeighbors <= 3.0) ? 1.0 : 0.0 :
    (liveNeighbors == 3.0) ? 1.0 : 0.0;

  float newLifetime = newState > 0.0 ? lifetime + 0.01 : lifetime - 0.01;
  newLifetime = clamp(newLifetime, 0.0, 10.0);

  return vec4(newState, 0.0, 0.0, newLifetime);
}

vec4 renderPass() {
  float state    = getState(v_coordinates).r;
  float lifetime = getState(v_coordinates).a;

  vec3 color = vec3(state, vec2(lifetime));

  return vec4(color, 1.0);
}

void main() {
  fragColor = u_pass ?  renderPass() : simulationPass();
}
