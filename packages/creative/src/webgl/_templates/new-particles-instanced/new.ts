import { WebGL } from "@utilities/webgl";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

const config = {
  canvasWidth: 600,
  canvasHeight: 600,

  particles: 1_000,

  timeIncrement: 0.001,
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

  gl.clearColor(0.05, 0.05, 0.05, 1);

  return gl;
}

function generateData() {
  const positions: number[] = [];
  for (let i = 0; i < config.particles; i++) {
    positions.push(Math.random());
    positions.push(Math.random());
  }

  const shapeVertices = WebGL.Points.rectangle(0, 0, 0.01, 0.02);

  return {
    positions: new Float32Array(positions),
    shapeVertices: new Float32Array(shapeVertices),
  } as const;
}

function setupUniforms(gl: WebGL2RenderingContext, program: WebGLProgram) {
  return {
    u_time: gl.getUniformLocation(program, "u_time"),
  };
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

  const vertexArrayObject = gl.createVertexArray();
  gl.bindVertexArray(vertexArrayObject);

  // ----------------------------
  // -- Mesh Instance Vertices --
  // ----------------------------

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.shapeVertex);
  gl.bufferData(gl.ARRAY_BUFFER, data.shapeVertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attributes.a_shapeVertex);
  gl.vertexAttribPointer(attributes.a_shapeVertex, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(attributes.a_shapeVertex, 0); // Use same triangle for all

  // ------------------------
  // -- Particle Positions --
  // ------------------------

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attributes.a_position);
  gl.vertexAttribPointer(attributes.a_position, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(attributes.a_position, 1); // Advance once per instance

  return vertexArrayObject;
}

export function main(canvas: HTMLCanvasElement) {
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

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, config.particles);

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
