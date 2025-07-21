import { WebGL } from "@utilities/webgl";
import { Config, defaultConfig } from "./config";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

let config: Config;

function setupGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  canvas.width = config.width;
  canvas.height = config.height;

  WebGL.Canvas.resizeToDisplaySize(canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.05, 0.05, 0.05, 1);

  return gl;
}

function setupProgram(gl: WebGL2RenderingContext) {
  const vs = WebGL.Setup.compileShader(gl, "vertex", vertexShader);
  const fs = WebGL.Setup.compileShader(gl, "fragment", fragmentShader);
  const program = WebGL.Setup.linkProgram(gl, vs, fs);
  return program;
}

function generateData() {
  const rowSize = 1 / config.rows;
  const colSize = 1 / config.cols;

  const positions: number[] = [];
  for (let x = 0; x < config.cols; x++) {
    for (let y = 0; y < config.rows; y++) {
      positions.push(x * colSize);
      positions.push(y * rowSize);
    }
  }

  const rowVisualSize = rowSize - config.gap;
  const colVisualSize = colSize - config.gap;
  const shapeVertices = WebGL.Points.rectangle(0, 0, rowVisualSize, colVisualSize);

  return {
    positions: new Float32Array(positions),
    shapeVertices: new Float32Array(shapeVertices),
  } as const;
}

function setupUniforms(gl: WebGL2RenderingContext, program: WebGLProgram) {
  return {
    u_time: gl.getUniformLocation(program, "u_time"),
  } as const;
}

function setupState(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const data = generateData();

  const attributes = {
    a_position: gl.getAttribLocation(program, "a_position"),
    a_shapeVertex: gl.getAttribLocation(program, "a_shapeVertex"),
  } as const;

  const buffers = {
    positions: gl.createBuffer(),
    shapeVertex: gl.createBuffer(),
  } as const;

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // -- Mesh Instance Vertices --
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.shapeVertex);
  gl.bufferData(gl.ARRAY_BUFFER, data.shapeVertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attributes.a_shapeVertex);
  gl.vertexAttribPointer(attributes.a_shapeVertex, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(attributes.a_shapeVertex, 0); // Use same triangle for all

  // -- Particle Positions --
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attributes.a_position);
  gl.vertexAttribPointer(attributes.a_position, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(attributes.a_position, 1); // Advance once per instance

  return vao;
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const gl = setupGL(canvas);
  const program = setupProgram(gl);
  const uniforms = setupUniforms(gl, program);
  const vertexArrayObject = setupState(gl, program);

  let time = 0;
  const animation = () => {
    time += config.timeIncrement;

    gl.useProgram(program);
    gl.bindVertexArray(vertexArrayObject);
    gl.uniform1f(uniforms.u_time, time);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, config.rows * config.cols);

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
