import { WebGL } from "@utilities/webgl";
import { Random } from "@utilities/random";

import computeVertex from "./compute-vertex.glsl";
import computeFragment from "./compute-fragment.glsl";
import renderVertex from "./render-vertex.glsl";
import renderFragment from "./render-fragment.glsl";

const config = {
  canvasWidth: 600,
  canvasHeight: 600,

  particles: 10_000,
} as const;

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
    ["newPosition"],
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

  const velocities: number[] = [];
  for (let i = 0; i < config.particles; i++) {
    const angle = Random.rangeInt(0, 360);
    velocities.push(Math.sin(angle));
    velocities.push(Math.cos(angle));
  }

  return {
    position: new Float32Array(positions),
    velocities: new Float32Array(velocities),
  };
}

function setupUniforms(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  const compute = {
    uSpeed: gl.getUniformLocation(computeProgram, "u_speed"),
  };

  const render = {
    uSize: gl.getUniformLocation(renderProgram, "u_size"),
  };

  return { compute, render };
}

function setupState(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  // ----------
  // -- Data --
  // ----------

  const data = generateData();

  const attributes = {
    compute: {
      aPosition: gl.getAttribLocation(computeProgram, "a_position"),
    },
    render: {
      aNewPosition: gl.getAttribLocation(renderProgram, "a_newPosition"),
    },
  };

  const buffers = {
    positionHeads: gl.createBuffer()!,
    positionTails: gl.createBuffer()!,
  };

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.bufferData(gl.ARRAY_BUFFER, data.position, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.bufferData(gl.ARRAY_BUFFER, data.position, gl.STREAM_DRAW);

  const vertexArrayObjects = {
    compute: {
      heads: gl.createVertexArray(),
      tails: gl.createVertexArray(),
    },
    render: {
      heads: gl.createVertexArray(),
      tails: gl.createVertexArray(),
    },
  };

  // -----------------------
  // -- VAO Compute Heads --
  // -----------------------

  gl.bindVertexArray(vertexArrayObjects.compute.heads);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.enableVertexAttribArray(attributes.compute.aPosition);
  gl.vertexAttribPointer(attributes.compute.aPosition, 2, gl.FLOAT, false, 0, 0);

  // -----------------------
  // -- VAO Compute Tails --
  // -----------------------

  gl.bindVertexArray(vertexArrayObjects.compute.tails);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.enableVertexAttribArray(attributes.compute.aPosition);
  gl.vertexAttribPointer(attributes.compute.aPosition, 2, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- VAO Render Heads --
  // ----------------------

  gl.bindVertexArray(vertexArrayObjects.render.heads);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.enableVertexAttribArray(attributes.render.aNewPosition);
  gl.vertexAttribPointer(attributes.render.aNewPosition, 2, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- Vao Render Tails --
  // ----------------------

  gl.bindVertexArray(vertexArrayObjects.render.tails);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.enableVertexAttribArray(attributes.render.aNewPosition);
  gl.vertexAttribPointer(attributes.render.aNewPosition, 2, gl.FLOAT, false, 0, 0);

  // -------------------------
  // -- Transform Feedbacks --
  // -------------------------

  const transformFeedbacks = {
    heads: gl.createTransformFeedback(),
    tails: gl.createTransformFeedback(),
  };

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

export function main(canvas: HTMLCanvasElement) {
  const gl = setupGL(canvas);

  const programs = setupPrograms(gl);

  const uniforms = setupUniforms(gl, programs.compute, programs.render);

  const { vertexArrayObjects, transformFeedbacks } = setupState(gl, programs.compute, programs.render);

  let swapOne = {
    computeVAO: vertexArrayObjects.compute.heads,
    renderVAO: vertexArrayObjects.render.tails,
    TF: transformFeedbacks.tails,
  };

  let swapTwo = {
    computeVAO: vertexArrayObjects.compute.tails,
    renderVAO: vertexArrayObjects.render.heads,
    TF: transformFeedbacks.heads,
  };

  // -----------
  // -- Loops --
  // -----------

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
