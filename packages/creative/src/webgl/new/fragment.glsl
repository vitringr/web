out vec4 outColor;

const float FREQUENCY = 10.0;

void main() {
  vec2 point = gl_FragCoord.xy / 800.0;

  float noise = getFractalNoise(point * FREQUENCY, 5);

  outColor = vec4(noise);
}
