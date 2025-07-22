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

float getState(vec2 c) {
  return texture(u_textureIndex, c).r;
}

vec4 simulationPass() {
  float currentState = getState(v_coordinates);
  vec2 cellSize = 1.0 / u_resolution;

  float liveNeighbors = 0.0;
  for (int i = 0; i < 8; i++) {
    vec2 offset = NEIGHBORS[i] * cellSize;
    liveNeighbors += getState(v_coordinates + offset);
  }

  float newState = 0.0;
  if(currentState == 1.0) {
    newState = (liveNeighbors >= 2.0 && liveNeighbors <= 3.0) ? 1.0 : 0.0;
  } else {
    newState = (liveNeighbors == 3.0) ? 1.0 : 0.0;
  }

  return vec4(newState, 0.0, 0.0, 0.0);
}

vec4 renderPass() {
  float state = getState(v_coordinates);
  vec3 color = vec3(state);

  return vec4(color, 1.0);
}

void main() {
  fragColor = u_pass ?  renderPass() : simulationPass();
}
