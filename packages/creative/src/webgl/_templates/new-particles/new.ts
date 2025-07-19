import { WebGL } from "@utilities/webgl";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

const defaultConfig = {
  canvasWidth: 600,
  canvasHeight: 600,

  particles: 10_000,

  timeIncrement: 0.001,
} as const;

type Config = typeof defaultConfig;

let config: Config;

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
  const data: number[] = [];
  for (let i = 0; i < config.particles; i++) {
    data.push(Math.random());
    data.push(Math.random());
  }
  return new Float32Array(data);
}

function setupUniforms(gl: WebGL2RenderingContext, program: WebGLProgram) {
  return {
    u_time: gl.getUniformLocation(program, "u_time"),
  };
}

function setupState(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const attributes = {
    a_positions: gl.getAttribLocation(program, "a_positions"),
  };

  const data = generateData();

  const vertexArrayObject = gl.createVertexArray();

  const buffer = gl.createBuffer();

  gl.bindVertexArray(vertexArrayObject);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(attributes.a_positions);
  gl.vertexAttribPointer(attributes.a_positions, 2, gl.FLOAT, false, 0, 0);

  return vertexArrayObject;
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

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, config.particles);

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
