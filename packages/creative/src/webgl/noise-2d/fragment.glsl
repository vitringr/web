out vec4 outColor;

uniform float u_time;
uniform float u_noiseFrequency;

void main() {
  float x = gl_FragCoord.x + u_time;
  float y = gl_FragCoord.y - u_time;

  float color = getNoise(vec2(x, y) * u_noiseFrequency);

  outColor = vec4(color, color, color, 1.0);
}
