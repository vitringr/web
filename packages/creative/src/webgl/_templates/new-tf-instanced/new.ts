import { WebGL } from "@utilities/webgl";
import { Random } from "@utilities/random";
import { Config, defaultConfig } from "./config";

import renderVertexShader from "./render-vertex.glsl";
import renderFragmentShader from "./render-fragment.glsl";
import computeVertexShader from "./compute-vertex.glsl";
import computeFragmentShader from "./compute-fragment.glsl";

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
  const computeVS = WebGL.Setup.compileShader(gl, "vertex", computeVertexShader);
  const computeFS = WebGL.Setup.compileShader(gl, "fragment", computeFragmentShader);
  const computeProgram = WebGL.Setup.linkTransformFeedbackProgram(gl, computeVS, computeFS, ["tf_state"], "separate");

  const renderVS = WebGL.Setup.compileShader(gl, "vertex", renderVertexShader);
  const renderFS = WebGL.Setup.compileShader(gl, "fragment", renderFragmentShader);
  const renderProgram = WebGL.Setup.linkProgram(gl, renderVS, renderFS);

  return { compute: computeProgram, render: renderProgram } as const;
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
    compute: {
      a_state: gl.getAttribLocation(computeProgram, "a_state"),
    },
    render: {
      a_position: gl.getAttribLocation(renderProgram, "a_position"),
      a_shapeVertex: gl.getAttribLocation(renderProgram, "a_shapeVertex"),
      tf_state: gl.getAttribLocation(renderProgram, "tf_state"),
    },
  } as const;

  const buffers = {
    positions: gl.createBuffer(),
    shapeVertex: gl.createBuffer(),
    stateHeads: gl.createBuffer(),
    stateTails: gl.createBuffer(),
  } as const;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.shapeVertex);
  gl.bufferData(gl.ARRAY_BUFFER, data.shapeVertices, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.stateHeads);
  gl.bufferData(gl.ARRAY_BUFFER, data.state, gl.DYNAMIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.stateTails);
  gl.bufferData(gl.ARRAY_BUFFER, data.state, gl.DYNAMIC_DRAW);

  const transformFeedbacks = {
    heads: gl.createTransformFeedback(),
    tails: gl.createTransformFeedback(),
  } as const;

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.heads);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.stateHeads);

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.tails);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.stateTails);

  const vertexArrayObjects = {
    compute: {
      heads: gl.createVertexArray(),
      tails: gl.createVertexArray(),
    },
    render: {
      heads: gl.createVertexArray(),
      tails: gl.createVertexArray(),
    },
  } as const;

  // -- VAO Compute Heads --
  gl.bindVertexArray(vertexArrayObjects.compute.heads);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.stateHeads);
  gl.enableVertexAttribArray(attributes.compute.a_state);
  gl.vertexAttribPointer(attributes.compute.a_state, 1, gl.FLOAT, false, 0, 0); // TODO: INT

  // -- VAO Compute Tails --
  gl.bindVertexArray(vertexArrayObjects.compute.tails);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.stateTails);
  gl.enableVertexAttribArray(attributes.compute.a_state);
  gl.vertexAttribPointer(attributes.compute.a_state, 1, gl.FLOAT, false, 0, 0); // TODO: INT

  // -- VAO Render Heads --
  gl.bindVertexArray(vertexArrayObjects.render.heads);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions);
  gl.enableVertexAttribArray(attributes.render.a_position);
  gl.vertexAttribPointer(attributes.render.a_position, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(attributes.render.a_position, 1);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.shapeVertex);
  gl.enableVertexAttribArray(attributes.render.a_shapeVertex);
  gl.vertexAttribPointer(attributes.render.a_shapeVertex, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(attributes.render.a_shapeVertex, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.stateHeads);
  gl.enableVertexAttribArray(attributes.render.tf_state);
  gl.vertexAttribPointer(attributes.render.tf_state, 1, gl.FLOAT, false, 0, 0); // TODO: INT
  gl.vertexAttribDivisor(attributes.render.tf_state, 1);

  // -- VAO Render Tails --
  gl.bindVertexArray(vertexArrayObjects.render.tails);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions);
  gl.enableVertexAttribArray(attributes.render.a_position);
  gl.vertexAttribPointer(attributes.render.a_position, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(attributes.render.a_position, 1);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.shapeVertex);
  gl.enableVertexAttribArray(attributes.render.a_shapeVertex);
  gl.vertexAttribPointer(attributes.render.a_shapeVertex, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(attributes.render.a_shapeVertex, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.stateTails);
  gl.enableVertexAttribArray(attributes.render.tf_state);
  gl.vertexAttribPointer(attributes.render.tf_state, 1, gl.FLOAT, false, 0, 0); // TODO: INT

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

  return { vertexArrayObjects, transformFeedbacks } as const;
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };
  const cellsCount = config.rows * config.cols;

  const gl = setupGL(canvas);
  const programs = setupPrograms(gl);
  const { vertexArrayObjects, transformFeedbacks } = setupState(gl, programs.compute, programs.render);

  let currentState = {
    computeVAO: vertexArrayObjects.compute.heads,
    TF: transformFeedbacks.tails,
    renderVAO: vertexArrayObjects.render.tails,
  };

  let nextState = {
    computeVAO: vertexArrayObjects.compute.tails,
    TF: transformFeedbacks.heads,
    renderVAO: vertexArrayObjects.render.heads,
  };

  const computeLoop = () => {
    gl.useProgram(programs.compute);
    gl.bindVertexArray(currentState.computeVAO);

    gl.enable(gl.RASTERIZER_DISCARD);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, currentState.TF);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, cellsCount);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.disable(gl.RASTERIZER_DISCARD);
  };

  const renderLoop = () => {
    gl.useProgram(programs.render);
    gl.bindVertexArray(currentState.renderVAO);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, cellsCount);
  };

  let swap: {
    computeVAO: WebGLVertexArrayObject;
    TF: WebGLTransformFeedback;
    renderVAO: WebGLVertexArrayObject;
  };

  computeLoop();
  renderLoop();

  const animation = () => {
    computeLoop();
    renderLoop();

    swap = currentState;
    currentState = nextState;
    nextState = swap;

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
