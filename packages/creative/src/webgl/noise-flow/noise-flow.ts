import { WebGL } from "@utilities/webgl";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

const config = {
  width: 600,
  height: 600,

  noiseFrequency: 0.0038,
  noiseContrast: 10,

  timeLoopNoise: 0.004,

  timeFlowHorizontal: 0.0,
  timeFlowVertical: -0.0006,
} as const;

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
  const vs = WebGL.Setup.compileShader(gl, "vertex", vertexShader);
  const fs = WebGL.Setup.compileShader(gl, "fragment", fragmentShader);
  const program = WebGL.Setup.linkProgram(gl, vs, fs);

  return program;
}

export function main(canvas: HTMLCanvasElement) {
  const gl = setupGL(canvas);

  const program = setupProgram(gl);

  const locations = {
    aCanvasVertices: gl.getAttribLocation(program, "a_canvasVertices"),
    uTime: gl.getUniformLocation(program, "u_time"),
    uNoiseFrequency: gl.getUniformLocation(program, "u_noiseFrequency"),
    uNoiseContrast: gl.getUniformLocation(program, "u_noiseContrast"),
    uTimeLoopNoise: gl.getUniformLocation(program, "u_timeLoopNoise"),
    uTimeFlowHorizontal: gl.getUniformLocation(program, "u_timeFlowHorizontal"),
    uTimeFlowVertical: gl.getUniformLocation(program, "u_timeFlowVertical"),
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

  gl.uniform1f(locations.uNoiseFrequency, config.noiseFrequency);
  gl.uniform1f(locations.uNoiseContrast, config.noiseContrast);
  gl.uniform1f(locations.uTimeLoopNoise, config.timeLoopNoise);
  gl.uniform1f(locations.uTimeFlowHorizontal, config.timeFlowHorizontal);
  gl.uniform1f(locations.uTimeFlowVertical, config.timeFlowVertical);

  gl.clearColor(0, 0, 0, 1);

  let time = 15000;
  const animation = () => {
    time++;

    gl.uniform1f(locations.uTime, time);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
