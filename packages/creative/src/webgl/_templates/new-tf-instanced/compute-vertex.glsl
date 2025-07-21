#version 300 es
precision highp float;

in float a_state;

out float tf_state;

void main() {
  tf_state = a_state;
}
