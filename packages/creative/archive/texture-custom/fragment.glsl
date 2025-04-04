#version 300 es

precision highp float;

#define PI radians(180.0)
#define TAU radians(360.0)

uniform vec2 u_resolution;
uniform sampler2D u_image;

in vec2 v_textureCoordinates;

out vec4 outColor;

void main() {
  vec4 texturePixel = texture(u_image, v_textureCoordinates);

  outColor = vec4(texturePixel.rgb, 1);
}
