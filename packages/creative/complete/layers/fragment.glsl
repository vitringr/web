#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform sampler2D u_image0;
uniform sampler2D u_image1;
uniform sampler2D u_image2;
uniform sampler2D u_image3;

in vec2 v_textureCoordinates;

out vec4 outColor;

bool isInsideCircle(vec2 target, vec2 circle, float circleRadius) {
  float xDistance = target.x - circle.x;
  float yDistance = target.y - circle.y;

  float distanceSquared = xDistance * xDistance + yDistance * yDistance;

  return distanceSquared <= circleRadius * circleRadius;
}

vec4 smoothVision(vec2 current, vec2 target, float rings[4], vec4 colors[4]) {
  if (isInsideCircle(current, target, rings[0])) {
    return colors[0];
  }

  if (isInsideCircle(current, target, rings[1])) {
    float currentRingRadius = (rings[1] - rings[0]);
    float distanceNormalized = (distance(current, target) - rings[0]) / currentRingRadius;
    return mix(colors[0], colors[1], distanceNormalized);
  }

  if(isInsideCircle(current, target, rings[2])) {
    float currentRingRadius = (rings[2] - rings[1]);
    float distanceNormalized = (distance(current, target) - rings[1]) / currentRingRadius;
    return mix(colors[1], colors[2], distanceNormalized);
  }

  if(isInsideCircle(current, target, rings[3])) {
    float currentRingRadius = (rings[3] - rings[2]);
    float distanceNormalized = (distance(current, target) - rings[2]) / currentRingRadius;
    return mix(colors[2], colors[3], distanceNormalized);
  }

  return colors[3];
}

vec4 sharpVision(vec2 current, vec2 target, float rings[4], vec4 colors[4]) {
  if (isInsideCircle(current, target, rings[0])) return colors[0];
  if (isInsideCircle(current, target, rings[1])) return colors[1];
  if (isInsideCircle(current, target, rings[2])) return colors[2];
                                                 return colors[3];
}

void main() {
  vec2 current = gl_FragCoord.xy;

  vec4 color0 = texture(u_image0, v_textureCoordinates);
  vec4 color1 = texture(u_image1, v_textureCoordinates);
  vec4 color2 = texture(u_image2, v_textureCoordinates);
  vec4 color3 = texture(u_image3, v_textureCoordinates);

  vec4 colors[4] = vec4[](color0, color1, color2, color3);

  float ringRadius = 50.0;
  float ring0 = ringRadius * 1.0;
  float ring1 = ringRadius * 2.0;
  float ring2 = ringRadius * 3.0;
  float ring3 = ringRadius * 4.0;

  float rings[4] = float[](ring0, ring1, ring2, ring3);

  outColor = smoothVision(current, u_pointer, rings, colors);
  // outColor = sharpVision(current, u_pointer, rings, colors);
}
