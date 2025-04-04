#version 300 es

in vec2 a_newPosition;

flat out vec3 v_texelColor;

uniform sampler2D u_textureIndex;
uniform GlobalStaticData {
  float u_brightness;
  float u_speed;
  float u_minSize;
  float u_sizeScalar;
};

void main() {
  vec3 texelColor = texture(u_textureIndex, a_newPosition).rgb;

  v_texelColor = texelColor;

  float totalTexelColor = (texelColor.x + texelColor.y + texelColor.z);
  float pointSize = u_minSize + u_sizeScalar * totalTexelColor;

  gl_PointSize = pointSize;

  vec2 clipSpace = a_newPosition * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}
