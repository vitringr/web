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

  const random: number[] = [];
  for (let i = 0; i < config.particles; i++) {
    random.push(Math.random());
  }

  return {
    positions: new Float32Array(positions),
    random: new Float32Array(random),
  };
}

function getUniformLocations(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  return {
    compute: {
      u_minSpeed: gl.getUniformLocation(computeProgram, "u_minSpeed"),
      u_maxSpeed: gl.getUniformLocation(computeProgram, "u_maxSpeed"),
    },
    render: {
      u_minSize: gl.getUniformLocation(renderProgram, "u_minSize"),
      u_maxSize: gl.getUniformLocation(renderProgram, "u_maxSize"),
    },
  } as const;
}

function setupState(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  const data = generateData();

  const attributes = {
    compute: {
      a_position: gl.getAttribLocation(computeProgram, "a_position"),
      a_random: gl.getAttribLocation(computeProgram, "a_random"),
    },
    render: {
      tf_position: gl.getAttribLocation(renderProgram, "tf_position"),
      a_random: gl.getAttribLocation(renderProgram, "a_random"),
    },
  } as const;

  const buffers = {
    positionHeads: gl.createBuffer(),
    positionTails: gl.createBuffer(),

    random: gl.createBuffer(),
  } as const;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.random);
  gl.bufferData(gl.ARRAY_BUFFER, data.random, gl.STATIC_DRAW);

  const vertexArrayObjects = {
    compute: gl.createVertexArray(),
    render: gl.createVertexArray(),
  } as const;

  // -----------------------
  // -- VAO Compute Heads --
  // -----------------------

  gl.bindVertexArray(vertexArrayObjects.compute);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.enableVertexAttribArray(attributes.compute.a_position);
  gl.vertexAttribPointer(attributes.compute.a_position, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.random);
  gl.enableVertexAttribArray(attributes.compute.a_random);
  gl.vertexAttribPointer(attributes.compute.a_random, 1, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- VAO Render Heads --
  // ----------------------

  gl.bindVertexArray(vertexArrayObjects.render);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.enableVertexAttribArray(attributes.render.tf_position);
  gl.vertexAttribPointer(attributes.render.tf_position, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.random);
  gl.enableVertexAttribArray(attributes.render.a_random);
  gl.vertexAttribPointer(attributes.render.a_random, 1, gl.FLOAT, false, 0, 0);

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

  return { buffers, vertexArrayObjects, transformFeedbacks, attributes };
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const gl = setupGL(canvas);
  const programs = setupPrograms(gl);
  const uniformLocation = getUniformLocations(gl, programs.compute, programs.render);
  const { buffers, vertexArrayObjects, transformFeedbacks, attributes } = setupState(gl, programs.compute, programs.render);

  let swapOne = {
    TF: transformFeedbacks.tails,
    buffer: buffers.positionTails,
  };

  let swapTwo = {
    TF: transformFeedbacks.heads,
    buffer: buffers.positionHeads,
  };

  gl.useProgram(programs.compute);
  gl.uniform1f(uniformLocation.compute.u_minSpeed, config.minSpeed);
  gl.uniform1f(uniformLocation.compute.u_maxSpeed, config.maxSpeed);
  gl.useProgram(programs.render);
  gl.uniform1f(uniformLocation.render.u_minSize, config.minSize);
  gl.uniform1f(uniformLocation.render.u_maxSize, config.maxSize);

const computeLoop = () => {
  gl.useProgram(programs.compute);
  gl.bindVertexArray(vertexArrayObjects.compute);

  // Bind INPUT buffer (current positions)
  gl.bindBuffer(gl.ARRAY_BUFFER, swapTwo.buffer); // Note: using swapTwo as input
  gl.vertexAttribPointer(attributes.compute.a_position, 2, gl.FLOAT, false, 0, 0);

  gl.enable(gl.RASTERIZER_DISCARD);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, swapOne.TF);
  gl.beginTransformFeedback(gl.POINTS);
  
  // Draw using current input buffer
  gl.drawArrays(gl.POINTS, 0, config.particles);
  
  gl.endTransformFeedback();
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
  gl.disable(gl.RASTERIZER_DISCARD);
};

const renderLoop = () => {
  gl.useProgram(programs.render);
  gl.bindVertexArray(vertexArrayObjects.render);

  // Bind current position buffer before drawing
  gl.bindBuffer(gl.ARRAY_BUFFER, swapTwo.buffer); // Using swapTwo as input
  gl.vertexAttribPointer(attributes.render.tf_position, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.POINTS, 0, config.particles);
};

  let swap: any;

  const mainLoop = () => {
    computeLoop();
    renderLoop();

    swap = swapOne;
    swapOne = swapTwo;
    swapTwo = swap;

    requestAnimationFrame(mainLoop);
  };

  requestAnimationFrame(mainLoop);
}
