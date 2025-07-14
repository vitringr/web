import { WebGL } from "@utilities/webgl";
import { NoiseGLSL } from "@utilities/noise-glsl";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

type Config = {
  canvasWidth: number,
  canvasHeight: number,

  timeIncrement: number,
  noiseFrequency: number,
};

const defaultConfig: Config = {
  canvasWidth: 600,
  canvasHeight: 600,

  timeIncrement: 0.5,
  noiseFrequency: 0.0046,
} as const;

let config: Config;

function setupGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  WebGL.Canvas.resizeToDisplaySize(canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  return gl;
}

function setupProgram(gl: WebGL2RenderingContext) {
  const fullFragmentShader = WebGL.GLSL.getBegin() + NoiseGLSL.Simplex.default + fragmentShader;

  const vs = WebGL.Setup.compileShader(gl, "vertex", vertexShader);
  const fs = WebGL.Setup.compileShader(gl, "fragment", fullFragmentShader);
  const program = WebGL.Setup.linkProgram(gl, vs, fs);

  return program;
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const gl = setupGL(canvas);

  const program = setupProgram(gl);

  const locations = {
    aCanvasVertices: gl.getAttribLocation(program, "a_canvasVertices"),
    uNoiseFrequency: gl.getUniformLocation(program, "u_noiseFrequency"),
    uTime: gl.getUniformLocation(program, "u_time"),
  };

  const vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const canvasVertices = WebGL.Points.rectangle(0, 0, 1, 1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(canvasVertices), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(locations.aCanvasVertices);
  gl.vertexAttribPointer(locations.aCanvasVertices, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);
  gl.bindVertexArray(vertexArray);

  gl.uniform1f(locations.uNoiseFrequency, config.noiseFrequency);

  gl.clearColor(0, 0, 0, 1);

  let time = 35100;
  const animation = () => {
    time += config.timeIncrement;

    gl.uniform1f(locations.uTime, time);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
