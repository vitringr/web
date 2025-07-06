import { WebGL } from "@utilities/webgl";
import { NoiseGLSL } from "@utilities/noise-glsl";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

const config = {
  canvasWidth: 800,
  canvasHeight: 800,
} as const;

function setupProgram(gl: WebGL2RenderingContext) {
  const fullFS = WebGL.GLSL.getBegin() + NoiseGLSL.Simplex.default + fragmentShader;

  const vs = WebGL.Setup.compileShader(gl, "vertex", vertexShader);
  const fs = WebGL.Setup.compileShader(gl, "fragment", fullFS);
  const program = WebGL.Setup.linkProgram(gl, vs, fs);
  return program;
}

function setupGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  WebGL.Canvas.resizeToDisplaySize(canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  return gl;
}

function setupState(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const attributes = {
    a_canvasVertices: gl.getAttribLocation(program, "a_canvasVertices"),
  };

  const canvasVertices = new Float32Array(WebGL.Points.rectangle(0, 0, 1, 1));

  const vertexArrayObject = gl.createVertexArray();

  const buffer = gl.createBuffer();

  gl.bindVertexArray(vertexArrayObject);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, canvasVertices, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(attributes.a_canvasVertices);
  gl.vertexAttribPointer(attributes.a_canvasVertices, 2, gl.FLOAT, false, 0, 0);

  return vertexArrayObject;
}

export function main(canvas: HTMLCanvasElement) {
  const gl = setupGL(canvas);

  const program = setupProgram(gl);

  const vertexArrayObject = setupState(gl, program);

  gl.useProgram(program);
  gl.bindVertexArray(vertexArrayObject);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
