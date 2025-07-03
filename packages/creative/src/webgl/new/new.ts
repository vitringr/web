import { WebGL } from "@utilities/webgl";


import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

const config = {
  canvasWidth: 600,
  canvasHeight: 600,
} as const;

function setupProgram(gl: WebGL2RenderingContext) {
  const vs = WebGL.Setup.compileShader(gl, "vertex", vertexShader);
  const fs = WebGL.Setup.compileShader(gl, "fragment", fragmentShader);
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

export function main(canvas: HTMLCanvasElement) {
  const gl = setupGL(canvas);

  const program = setupProgram(gl);

  const locations = {
    aCanvasVertices: gl.getAttribLocation(program, "a_canvasVertices"),
  };

  const vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const canvasVertices = WebGL.Points.rectangle(0, 0, 1, 1);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(canvasVertices),
    gl.STATIC_DRAW,
  );

  gl.enableVertexAttribArray(locations.aCanvasVertices);
  gl.vertexAttribPointer(locations.aCanvasVertices, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);
  gl.bindVertexArray(vertexArray);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
