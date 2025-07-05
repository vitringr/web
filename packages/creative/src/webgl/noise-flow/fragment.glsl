out vec4 outColor;

uniform float u_time;
uniform float u_noiseFrequency;
uniform float u_noiseContrast;
uniform float u_timeLoopNoise;
uniform float u_timeFlowHorizontal;
uniform float u_timeFlowVertical;

void main() {
  float x = gl_FragCoord.x * u_noiseFrequency + u_time * u_timeFlowHorizontal;
  float y = gl_FragCoord.y * u_noiseFrequency + u_time * u_timeFlowVertical;
  float noiseValue = getNoise(vec2(x, y));

  float color = sin(noiseValue * u_noiseContrast + u_time * u_timeLoopNoise) * 0.5 + 0.5;

  outColor = vec4(color, color * 0.3, 0.0, 1.0);
}
