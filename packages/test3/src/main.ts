import { WebGL } from "@utilities/webgl";
import { Random } from "@utilities/random";
import { Config, defaultConfig } from "./config";

import computeVertex from "./shaders/compute-vertex.glsl";
import computeFragment from "./shaders/compute-fragment.glsl";
import renderVertex from "./shaders/render-vertex.glsl";
import renderFragment from "./shaders/render-fragment.glsl";

let config: Config;

function setupGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  WebGL.Canvas.resizeToDisplaySize(canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.08, 0.08, 0.08, 1.0);

  return gl;
}

function setupPrograms(gl: WebGL2RenderingContext) {
  const computeVS = WebGL.Setup.compileShader(gl, "vertex", computeVertex);
  const computeFS = WebGL.Setup.compileShader(gl, "fragment", computeFragment);
  const computeProgram = WebGL.Setup.linkTransformFeedbackProgram(
    gl,
    computeVS,
    computeFS,
    ["tf_position"],
    "separate",
  );

  const renderVS = WebGL.Setup.compileShader(gl, "vertex", renderVertex);
  const renderFS = WebGL.Setup.compileShader(gl, "fragment", renderFragment);
  const renderProgram = WebGL.Setup.linkProgram(gl, renderVS, renderFS);

  return { compute: computeProgram, render: renderProgram };
}

function generateData() {
  const positions: number[] = [];
  for (let i = 0; i < config.particles; i++) {
    positions.push(Random.range(0, 1));
    positions.push(Random.range(0, 1));
  }

  const sizes: number[] = [];
  for (let i = 0; i < config.particles; i++) {
    sizes.push(Random.range(config.minSize, config.maxSize));
  }

  const speeds: number[] = [];
  for (let i = 0; i < config.particles; i++) {
    speeds.push(Random.range(config.minSpeed, config.maxSpeed));
  }

  return {
    positions: new Float32Array(positions),
    speeds: new Float32Array(speeds),
    sizes: new Float32Array(sizes),
  };
}

function setupState(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  const data = generateData();

  const attributes = {
    compute: {
      a_position: gl.getAttribLocation(computeProgram, "a_position"),
      // a_speed: gl.getAttribLocation(computeProgram, "a_speed"),
    },
    render: {
      tf_position: gl.getAttribLocation(renderProgram, "tf_position"),
      // a_size: gl.getAttribLocation(renderProgram, "a_size"),
    },
  } as const;

  const buffers = {
    positionHeads: gl.createBuffer(),
    positionTails: gl.createBuffer(),

    speed: gl.createBuffer(),
    size: gl.createBuffer(),
  } as const;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.speed);
  // gl.bufferData(gl.ARRAY_BUFFER, data.speeds, gl.STATIC_DRAW);
  //
  // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.size);
  // gl.bufferData(gl.ARRAY_BUFFER, data.sizes, gl.STATIC_DRAW);

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

  // -----------------------
  // -- VAO Compute Heads --
  // -----------------------

  gl.bindVertexArray(vertexArrayObjects.compute.heads);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.enableVertexAttribArray(attributes.compute.a_position);
  gl.vertexAttribPointer(attributes.compute.a_position, 2, gl.FLOAT, false, 0, 0);

  // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.speed);
  // gl.enableVertexAttribArray(attributes.compute.a_speed);
  // gl.vertexAttribPointer(attributes.compute.a_speed, 1, gl.FLOAT, false, 0, 0);

  // -----------------------
  // -- VAO Compute Tails --
  // -----------------------

  gl.bindVertexArray(vertexArrayObjects.compute.tails);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.enableVertexAttribArray(attributes.compute.a_position);
  gl.vertexAttribPointer(attributes.compute.a_position, 2, gl.FLOAT, false, 0, 0);

  // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.speed);
  // gl.enableVertexAttribArray(attributes.compute.a_speed);
  // gl.vertexAttribPointer(attributes.compute.a_speed, 1, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- VAO Render Heads --
  // ----------------------

  gl.bindVertexArray(vertexArrayObjects.render.heads);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.enableVertexAttribArray(attributes.render.tf_position);
  gl.vertexAttribPointer(attributes.render.tf_position, 2, gl.FLOAT, false, 0, 0);

  // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.size);
  // gl.enableVertexAttribArray(attributes.render.a_size);
  // gl.vertexAttribPointer(attributes.render.a_size, 1, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- Vao Render Tails --
  // ----------------------

  gl.bindVertexArray(vertexArrayObjects.render.tails);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.enableVertexAttribArray(attributes.render.tf_position);
  gl.vertexAttribPointer(attributes.render.tf_position, 2, gl.FLOAT, false, 0, 0);
  //
  // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.size);
  // gl.enableVertexAttribArray(attributes.render.a_size);
  // gl.vertexAttribPointer(attributes.render.a_size, 1, gl.FLOAT, false, 0, 0);

  // -------------------------
  // -- Transform Feedbacks --
  // -------------------------

  const transformFeedbacks = {
    heads: gl.createTransformFeedback(),
    tails: gl.createTransformFeedback(),
  } as const;

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.heads);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.positionHeads);

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.tails);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.positionTails);

  // ----------------------
  // -- Unbind leftovers --
  // ----------------------

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

  return { vertexArrayObjects, transformFeedbacks };
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const gl = setupGL(canvas);

  const programs = setupPrograms(gl);

  const { vertexArrayObjects, transformFeedbacks } = setupState(gl, programs.compute, programs.render);

  let swapOne = {
    computeVAO: vertexArrayObjects.compute.heads,
    TF: transformFeedbacks.tails,
    renderVAO: vertexArrayObjects.render.tails,
  };

  let swapTwo = {
    computeVAO: vertexArrayObjects.compute.tails,
    TF: transformFeedbacks.heads,
    renderVAO: vertexArrayObjects.render.heads,
  };

  const computeLoop = () => {
    gl.useProgram(programs.compute);
    gl.bindVertexArray(swapOne.computeVAO);

    gl.enable(gl.RASTERIZER_DISCARD);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, swapOne.TF);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, config.particles);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.disable(gl.RASTERIZER_DISCARD);
  };

  const renderLoop = () => {
    gl.useProgram(programs.render);
    gl.bindVertexArray(swapOne.renderVAO);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, config.particles);
  };

  const mainLoop = () => {
    computeLoop();
    renderLoop();

    const swap = swapOne;
    swapOne = swapTwo;
    swapTwo = swap;

    requestAnimationFrame(mainLoop);
  };

  requestAnimationFrame(mainLoop);
}
