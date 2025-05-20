#version 300 es

in vec2 a_canvasVertices;

out vec2 v_coordinates;

uniform sampler2D u_newTextureIndex;

uniform float u_width;
uniform float u_height;

vec2 getCoordinates(float id) {
  float xIndex = mod(id, u_width);
  float yIndex = floor(id / u_width);

  return vec2(
    (xIndex + 0.5) / u_width,
    (yIndex + 0.5) / u_height
  );
}

void main() {
  vec2 point = getCoordinates(float(gl_VertexID));

  vec3 nextData = texture(u_newTextureIndex, point).rgb;

  gl_PointSize = 4.0;

  vec2 position = nextData.xy * 2.0 - 1.0;

  gl_Position = vec4(position, 0.0, 1.0);
}
