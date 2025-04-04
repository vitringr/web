#version 300 es

precision highp float;

#define PI radians(180.0)
#define TAU radians(360.0)

uniform vec2 u_resolution;

uniform sampler2D u_image0;
uniform sampler2D u_image1;

in vec2 v_textureCoordinates;

out vec4 outColor;

vec4 splitHorizontal(vec4 aColor, vec4 bColor, float split) {
  if(gl_FragCoord.x <= u_resolution.x * split) return aColor;
  else return bColor;
}

vec4 splitVertical(vec4 aColor, vec4 bColor, float split) {
  if(gl_FragCoord.y <= u_resolution.y * split) return aColor;
  else return bColor;
}

void main() {
  vec4 color0 = texture(u_image0, v_textureCoordinates);
  vec4 color1 = texture(u_image1, v_textureCoordinates);

  // outColor =
  //   splitVertical(color0, color1, 0.5) *
  //   splitHorizontal(color0, color1, 0.5);

  // outColor = vec4(color0.r, color0.g, color1.b, 1.0);

  float brightness = 3.0;

  outColor = color0 * color1 * brightness;
}
