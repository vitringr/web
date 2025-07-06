out vec4 outColor;

const float FREQUENCY = 5.0;

void main() {
  vec2 point = gl_FragCoord.xy / 800.0;

  float noise = getNoise(point * FREQUENCY);
  float fractalNoise = getFractalNoise(point * FREQUENCY, 5);

  outColor = vec4(vec3(fractalNoise), 1.0);
}
