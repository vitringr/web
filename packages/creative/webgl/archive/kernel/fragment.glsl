#version 300 es

precision highp float;

#define PI radians(180.0)
#define TAU radians(360.0)

uniform float u_kernel[9];
uniform float u_kernelWeight;

uniform sampler2D u_image;

in vec2 v_textureCoordinates;

out vec4 outColor;

void main() {
  vec2 onePixel = vec2(1, 1) / vec2(textureSize(u_image, 0));

  vec4 sum =
    texture(u_image, v_textureCoordinates + onePixel * vec2(-1, -1)) * u_kernel[0] +
    texture(u_image, v_textureCoordinates + onePixel * vec2( 0, -1)) * u_kernel[1] +
    texture(u_image, v_textureCoordinates + onePixel * vec2( 1, -1)) * u_kernel[2] +
    texture(u_image, v_textureCoordinates + onePixel * vec2(-1,  0)) * u_kernel[3] +
    texture(u_image, v_textureCoordinates + onePixel * vec2( 0,  0)) * u_kernel[4] +
    texture(u_image, v_textureCoordinates + onePixel * vec2( 1,  0)) * u_kernel[5] +
    texture(u_image, v_textureCoordinates + onePixel * vec2(-1, +1)) * u_kernel[6] +
    texture(u_image, v_textureCoordinates + onePixel * vec2( 0, +1)) * u_kernel[7] +
    texture(u_image, v_textureCoordinates + onePixel * vec2( 1, +1)) * u_kernel[8];

  vec4 normalized = sum / u_kernelWeight;

  outColor = vec4(normalized.rgb, 1);
}
