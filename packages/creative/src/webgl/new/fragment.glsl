out vec4 outColor;

const float FREQUENCY = 3.0;

void main() {
  vec2 point = gl_FragCoord.xy / 600.0;

  float noise = getNoise(point * FREQUENCY);

  outColor = vec4(vec3(noise), 1.0);
}
