import { WebGL } from "@utilities/webgl";
import { Config, defaultConfig } from "./config";

import renderVertexShader from "./render-vertex.glsl";
import renderFragmentShader from "./render-fragment.glsl";
import computeVertexShader from "./compute-vertex.glsl";
import computeFragmentShader from "./compute-fragment.glsl";
import { Random } from "@utilities/random";

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

function setupPrograms(gl: WebGL2RenderingContext) {
  const renderVS = WebGL.Setup.compileShader(gl, "vertex", renderVertexShader);
  const renderFS = WebGL.Setup.compileShader(gl, "fragment", renderFragmentShader);
  const renderProgram = WebGL.Setup.linkProgram(gl, renderVS, renderFS);

  const computeVS = WebGL.Setup.compileShader(gl, "vertex", computeVertexShader);
  const computeFS = WebGL.Setup.compileShader(gl, "fragment", computeFragmentShader);
  const computeProgram = WebGL.Setup.linkProgram(gl, computeVS, computeFS);

  return { compute: computeProgram, render: renderProgram };
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

  const state: number[] = [];
  for (let i = 0; i < config.rows * config.cols; i++) {
    state.push(Random.bool() ? 0 : 1);
  }

  return {
    positions: new Float32Array(positions),
    shapeVertices: new Float32Array(shapeVertices),
    state: new Float32Array(state),
  } as const;
}

function setupState(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  const data = generateData();

  const attributes = {
    compute: {},
    render: {
      a_position: gl.getAttribLocation(renderProgram, "a_position"),
      a_shapeVertex: gl.getAttribLocation(renderProgram, "a_shapeVertex"),
      a_state: gl.getAttribLocation(renderProgram, "a_state"), // WIP
    },
  } as const;

  const buffers = {
    positions: gl.createBuffer(),
    shapeVertex: gl.createBuffer(),
    state: gl.createBuffer(),
  } as const;

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // -- Mesh Instance Vertices --
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.shapeVertex);
  gl.bufferData(gl.ARRAY_BUFFER, data.shapeVertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attributes.render.a_shapeVertex);
  gl.vertexAttribPointer(attributes.render.a_shapeVertex, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(attributes.render.a_shapeVertex, 0); // Use same triangle for all

  // -- Positions --
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attributes.render.a_position);
  gl.vertexAttribPointer(attributes.render.a_position, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(attributes.render.a_position, 1); // Advance once per instance

  // -- State --
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.state);
  gl.bufferData(gl.ARRAY_BUFFER, data.state, gl.STATIC_DRAW); // TODO NOT STATIC
  gl.enableVertexAttribArray(attributes.render.a_state);
  gl.vertexAttribPointer(attributes.render.a_state, 1, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(attributes.render.a_state, 1); // Advance once per instance

  return vao;
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const gl = setupGL(canvas);
  const programs = setupPrograms(gl);
  const vertexArrayObject = setupState(gl, programs.compute, programs.render);

  const computeLoop = () => {};

  const renderLoop = () => {
    gl.useProgram(programs.render);
    gl.bindVertexArray(vertexArrayObject);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, config.rows * config.cols);
  };

  const animation = () => {
    computeLoop();
    renderLoop();
    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
