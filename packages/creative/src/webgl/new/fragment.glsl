out vec4 outColor;

const float FREQUENCY = 0.01234;

void main() {
  float noise = getNoise(gl_FragCoord.xy * FREQUENCY);

  outColor = vec4(vec3(noise), 1.0);
}
