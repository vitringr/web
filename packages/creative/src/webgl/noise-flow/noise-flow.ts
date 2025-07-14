import { WebGL } from "@utilities/webgl";
import { NoiseGLSL } from "@utilities/noise-glsl";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

type Config = {
  width: number,
  height: number,

  noiseFrequency: number,
  noiseContrast: number,

  timeLoopNoise: number,

  timeFlowHorizontal: number,
  timeFlowVertical: number,
};

const defaultConfig: Config = {
  width: 600,
  height: 600,

  noiseFrequency: 0.003,
  noiseContrast: 8,

  timeLoopNoise: 0.006,

  timeFlowHorizontal: 0.0001,
  timeFlowVertical: -0.0006,
} as const;

let config: Config;

function setupGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  canvas.width = config.width;
  canvas.height = config.height;

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

  const uniforms = {
    u_time: gl.getUniformLocation(program, "u_time"),
    u_noiseFrequency: gl.getUniformLocation(program, "u_noiseFrequency"),
    u_noiseContrast: gl.getUniformLocation(program, "u_noiseContrast"),
    u_timeLoopNoise: gl.getUniformLocation(program, "u_timeLoopNoise"),
    u_timeFlowHorizontal: gl.getUniformLocation(program, "u_timeFlowHorizontal"),
    u_timeFlowVertical: gl.getUniformLocation(program, "u_timeFlowVertical"),
  };

  const attributes = {
    a_canvasVertices: gl.getAttribLocation(program, "a_canvasVertices"),
  };

  const vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const canvasVertices = WebGL.Points.rectangle(0, 0, 1, 1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(canvasVertices), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(attributes.a_canvasVertices);
  gl.vertexAttribPointer(attributes.a_canvasVertices, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);
  gl.bindVertexArray(vertexArray);

  gl.uniform1f(uniforms.u_noiseFrequency, config.noiseFrequency);
  gl.uniform1f(uniforms.u_noiseContrast, config.noiseContrast);
  gl.uniform1f(uniforms.u_timeLoopNoise, config.timeLoopNoise);
  gl.uniform1f(uniforms.u_timeFlowHorizontal, config.timeFlowHorizontal);
  gl.uniform1f(uniforms.u_timeFlowVertical, config.timeFlowVertical);

  gl.clearColor(0, 0, 0, 1);

  let time = 1337;
  const animation = () => {
    time++;

    gl.uniform1f(uniforms.u_time, time);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
