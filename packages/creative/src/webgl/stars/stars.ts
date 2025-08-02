import { Random } from "@utilities/random";
import { WebGL } from "@utilities/webgl";

import { Config, defaultConfig } from "./config";

import computeVertex from "./shaders/compute-vertex.glsl";
import computeFragment from "./shaders/compute-fragment.glsl";
import renderVertex from "./shaders/render-vertex.glsl";
import renderFragment from "./shaders/render-fragment.glsl";

let config: Config;

function setupGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  canvas.width = config.width;
  canvas.height = config.height;

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
    const r = Math.random();
    random.push(r ** 6);
  }

  return {
    positions: new Float32Array(positions),
    random: new Float32Array(random),
  };
}

function setupState(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  const data = generateData();

  const uniforms = {
    compute: {
      u_minSpeed: gl.getUniformLocation(computeProgram, "u_minSpeed"),
      u_maxSpeed: gl.getUniformLocation(computeProgram, "u_maxSpeed"),
    },
    render: {
      u_minSize: gl.getUniformLocation(renderProgram, "u_minSize"),
      u_maxSize: gl.getUniformLocation(renderProgram, "u_maxSize"),
    },
  } as const;

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

  // --------------------------
  // -- Vertex Array Objects --
  // --------------------------

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

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.random);
  gl.enableVertexAttribArray(attributes.compute.a_random);
  gl.vertexAttribPointer(attributes.compute.a_random, 1, gl.FLOAT, false, 0, 0);

  // -----------------------
  // -- VAO Compute Tails --
  // -----------------------

  gl.bindVertexArray(vertexArrayObjects.compute.tails);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.enableVertexAttribArray(attributes.compute.a_position);
  gl.vertexAttribPointer(attributes.compute.a_position, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.random);
  gl.enableVertexAttribArray(attributes.compute.a_random);
  gl.vertexAttribPointer(attributes.compute.a_random, 1, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- VAO Render Heads --
  // ----------------------

  gl.bindVertexArray(vertexArrayObjects.render.heads);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.enableVertexAttribArray(attributes.render.tf_position);
  gl.vertexAttribPointer(attributes.render.tf_position, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.random);
  gl.enableVertexAttribArray(attributes.render.a_random);
  gl.vertexAttribPointer(attributes.render.a_random, 1, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- Vao Render Tails --
  // ----------------------

  gl.bindVertexArray(vertexArrayObjects.render.tails);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.enableVertexAttribArray(attributes.render.tf_position);
  gl.vertexAttribPointer(attributes.render.tf_position, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.random);
  gl.enableVertexAttribArray(attributes.render.a_random);
  gl.vertexAttribPointer(attributes.render.a_random, 1, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- Unbind leftovers --
  // ----------------------

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

  return { uniforms, vertexArrayObjects, transformFeedbacks };
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const gl = setupGL(canvas);

  const programs = setupPrograms(gl);

  const { uniforms, vertexArrayObjects, transformFeedbacks } = setupState(gl, programs.compute, programs.render);

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

  gl.useProgram(programs.compute);
  gl.uniform1f(uniforms.compute.u_minSpeed, config.minSpeed);
  gl.uniform1f(uniforms.compute.u_maxSpeed, config.maxSpeed);
  gl.useProgram(programs.render);
  gl.uniform1f(uniforms.render.u_minSize, config.minSize);
  gl.uniform1f(uniforms.render.u_maxSize, config.maxSize);

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

  let swap: {
    computeVAO: WebGLVertexArrayObject;
    TF: WebGLTransformFeedback;
    renderVAO: WebGLVertexArrayObject;
  };

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
