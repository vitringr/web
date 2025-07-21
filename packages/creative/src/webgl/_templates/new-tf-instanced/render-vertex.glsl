#version 300 es
precision highp float;

in vec2 a_shapeVertex;
in vec2 a_position;
in float tf_state;

out float v_state;

void main() {
  vec2 vertexPosition = a_position + a_shapeVertex;
  vec2 clipSpace = vertexPosition * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0);

  v_state = tf_state;
}
