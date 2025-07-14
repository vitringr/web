// WIP

uniform float u_time;
uniform float u_resolution;

out vec4 outColor;

const vec2 seed1 = vec2(0.0, 0.0);
const vec2 seed2 = vec2(12.34567);
const vec2 seed3 = vec2(42.46281);

const vec3 COLOR1 = vec3(0.1, 0.5, 0.5);
const vec3 COLOR2 = vec3(0.4, 0.8, 1.0);

const vec2 stretch = vec2(1.0, 3.6);

const float rippleSpeed = 0.03;
const float rippleFrequency = 8.0;

const float speed1      = 0.007;
const float frequency1  = 1.4;
const int   octaves1    = 4;

const float speed2      = 0.01;
const float frequency2  = 2.4;
const int   octaves2    = 4;

void main() {
  vec3 color = vec3(0.0);
  vec2 point = gl_FragCoord.xy / u_resolution;

  float ripple = sin(fract(u_time * rippleSpeed + point.y * rippleFrequency) * 6.28318);

  vec2 botVelocity = vec2(0.0 + ripple * 0.3, u_time + ripple * 0.5) * speed1;
  float botWater = getFractalNoise((point * stretch + seed1 + botVelocity) * frequency1, octaves1);

  vec2 topVelocity = vec2(ripple * 0.8, u_time + ripple * 0.5) * speed2;
  float topWater = getFractalNoise((point * stretch + seed2 + topVelocity) * frequency2, octaves2);

  float noise = getFractalNoise(vec2(botWater, topWater), 6);

  color = mix(vec3(1.0), COLOR1, noise);

  color = mix(color, vec3(1.0), step(noise, 0.15));

  color *= 0.8;
  outColor = vec4(color, 1.0);
}
