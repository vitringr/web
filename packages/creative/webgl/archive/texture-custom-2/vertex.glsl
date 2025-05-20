#version 300 es

#define PI radians(180.0)
#define TAU radians(360.0)

in vec2 a_position;
in vec2 a_textureCoordinates;

out vec2 v_textureCoordinates;

uniform vec2 u_resolution;

void main() {
  vec2 clipSpace = ((a_position / u_resolution) * 2.0 - 1.0);
  clipSpace.y *= -1.0;

  gl_Position = vec4(clipSpace, 0, 1);

  v_textureCoordinates = a_textureCoordinates;
}
