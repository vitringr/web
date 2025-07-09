uniform float u_time;
uniform float u_resolution;

out vec4 outColor;

const vec3 WATER1 = vec3(0.1, 0.5, 0.5);
const vec3 WATER2 = vec3(0.4, 0.8, 1.0);

void main() {
  vec3 color = vec3(0.0);
  vec2 point = gl_FragCoord.xy / u_resolution;

  vec2 velocity1 = vec2(0.0, u_time * 0.001);
  float botWater = getFractalNoise((point * vec2(1.0, 3.5) + vec2(0.0, 0.0) + velocity1) * 3.0, 3);

  vec2 velocity2 = vec2(0.0, u_time * 0.0014);
  float topWater = getFractalNoise((point * vec2(1.0, 3.5) + vec2(12.34567) + velocity2) * 3.0, 3);

  float noise = getFractalNoise(vec2(botWater, topWater), 5);

  color = mix(vec3(1.0), WATER1, noise);

  color = mix(color, vec3(1.0), step(noise, 0.16));

  outColor = vec4(color, 1.0);
}
