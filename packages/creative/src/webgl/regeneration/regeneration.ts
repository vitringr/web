import { WebGL } from "@utilities/webgl";

import computeVertex from "./update-vertex.glsl";
import computeFragment from "./update-fragment.glsl";
import renderVertex from "./render-vertex.glsl";
import renderFragment from "./render-fragment.glsl";

const defaultConfig = {
  width: 600,
  height: 600,

  xCount: 300,
  yCount: 300,
  offset: 0.02,

  originPullScalar: 0.2,
  toggleOriginPullScalar: 2.0,
  repelScalar: 0.2,
  repelNearestScalar: 5,
  maxRepelDistance: 0.04,
  minPointSize: 0.8,
  pointSizeByOriginDistance: 24,
};

type Config = typeof defaultConfig;

let config: Config;

const input = { x: -99999, y: -99999, clicked: false };

function setupInput(canvas: HTMLCanvasElement) {
  canvas.addEventListener("pointermove", (ev: PointerEvent) => {
    const canvasBounds = canvas.getBoundingClientRect();
    input.x = ev.clientX - canvasBounds.left;
    input.y = ev.clientY - canvasBounds.top;

    input.x = input.x / canvas.width;
    input.y = (canvas.height - input.y) / canvas.height;
  });

  window.addEventListener("pointerdown", () => {
    input.clicked = true;
  });

  window.addEventListener("pointerup", () => {
    input.clicked = false;
  });

  window.addEventListener("blur", () => {
    input.clicked = false;
  });
}

function setupPrograms(gl: WebGL2RenderingContext) {
  const computeVS = WebGL.Setup.compileShader(gl, "vertex", computeVertex);
  const computeFS = WebGL.Setup.compileShader(gl, "fragment", computeFragment);
  const renderVS = WebGL.Setup.compileShader(gl, "vertex", renderVertex);
  const renderFS = WebGL.Setup.compileShader(gl, "fragment", renderFragment);

  return {
    compute: WebGL.Setup.linkTransformFeedbackProgram(gl, computeVS, computeFS, ["tf_newPosition"], "separate"),
    render: WebGL.Setup.linkProgram(gl, renderVS, renderFS),
  };
}

function generateData() {
  const positions: number[] = [];

  for (let x = 0; x < config.xCount; x++) {
    for (let y = 0; y < config.yCount; y++) {
      const xPosition = config.offset + ((1 - config.offset * 2) / config.xCount) * x;
      const yPosition = config.offset + ((1 - config.offset * 2) / config.yCount) * y;
      positions.push(xPosition);
      positions.push(yPosition);
    }
  }

  return { position: new Float32Array(positions) } as const;
}

function setupUniforms(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  const compute = {
    u_pointerPosition: gl.getUniformLocation(computeProgram, "u_pointerPosition"),
    u_pointerDown: gl.getUniformLocation(computeProgram, "u_pointerDown"),
    u_deltaTime: gl.getUniformLocation(computeProgram, "u_deltaTime"),

    // Static
    u_originPullScalar: gl.getUniformLocation(computeProgram, "u_originPullScalar"),
    u_toggleOriginPullScalar: gl.getUniformLocation(computeProgram, "u_toggleOriginPullScalar"),
    u_repelScalar: gl.getUniformLocation(computeProgram, "u_repelScalar"),
    u_repelNearestScalar: gl.getUniformLocation(computeProgram, "u_repelNearestScalar"),
    u_maxRepelDistance: gl.getUniformLocation(computeProgram, "u_maxRepelDistance"),
  };

  const render = {
    u_textureIndex: gl.getUniformLocation(renderProgram, "u_textureIndex"),

    // Static
    u_minPointSize: gl.getUniformLocation(renderProgram, "u_minPointSize"),
    u_pointSizeByOriginDistance: gl.getUniformLocation(renderProgram, "u_pointSizeByOriginDistance"),
  };

  return { compute, render } as const;
}

function setupState(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  // ----------
  // -- Data --
  // ----------

  const data = generateData();

  const attributes = {
    compute: {
      a_currentPosition: gl.getAttribLocation(computeProgram, "a_currentPosition"),
      a_originalPosition: gl.getAttribLocation(computeProgram, "a_originalPosition"),
    },

    render: {
      a_newPosition: gl.getAttribLocation(renderProgram, "a_newPosition"),
      a_originalPosition: gl.getAttribLocation(renderProgram, "a_originalPosition"),
    },
  } as const;

  const buffers = {
    positionHeads: gl.createBuffer(),
    positionTails: gl.createBuffer(),
    positionOrigin: gl.createBuffer(),
  } as const;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.bufferData(gl.ARRAY_BUFFER, data.position, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.bufferData(gl.ARRAY_BUFFER, data.position, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionOrigin);
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
  } as const;

  // -----------------------
  // -- VAO Compute Heads --
  // -----------------------

  gl.bindVertexArray(vertexArrayObjects.compute.heads);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.enableVertexAttribArray(attributes.compute.a_currentPosition);
  gl.vertexAttribPointer(attributes.compute.a_currentPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionOrigin);
  gl.enableVertexAttribArray(attributes.compute.a_originalPosition);
  gl.vertexAttribPointer(attributes.compute.a_originalPosition, 2, gl.FLOAT, false, 0, 0);

  // -----------------------
  // -- VAO Compute Tails --
  // -----------------------

  gl.bindVertexArray(vertexArrayObjects.compute.tails);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.enableVertexAttribArray(attributes.compute.a_currentPosition);
  gl.vertexAttribPointer(attributes.compute.a_currentPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionOrigin);
  gl.enableVertexAttribArray(attributes.compute.a_originalPosition);
  gl.vertexAttribPointer(attributes.compute.a_originalPosition, 2, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- VAO Render Heads --
  // ----------------------

  gl.bindVertexArray(vertexArrayObjects.render.heads);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.enableVertexAttribArray(attributes.render.a_newPosition);
  gl.vertexAttribPointer(attributes.render.a_newPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionOrigin);
  gl.enableVertexAttribArray(attributes.render.a_originalPosition);
  gl.vertexAttribPointer(attributes.render.a_originalPosition, 2, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- Vao Render Tails --
  // ----------------------

  gl.bindVertexArray(vertexArrayObjects.render.tails);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.enableVertexAttribArray(attributes.render.a_newPosition);
  gl.vertexAttribPointer(attributes.render.a_newPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionOrigin);
  gl.enableVertexAttribArray(attributes.render.a_originalPosition);
  gl.vertexAttribPointer(attributes.render.a_originalPosition, 2, gl.FLOAT, false, 0, 0);

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

  return { vertexArrayObjects, transformFeedbacks } as const;
}

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

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const gl = setupGL(canvas);

  setupInput(canvas);

  const programs = setupPrograms(gl);

  const uniforms = setupUniforms(gl, programs.compute, programs.render);

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

  const particleCount = config.xCount * config.yCount;

  // ---------------------
  // -- Static Uniforms --
  // ---------------------

  gl.useProgram(programs.compute);
  gl.uniform1f(uniforms.compute.u_originPullScalar, config.originPullScalar);
  gl.uniform1f(uniforms.compute.u_toggleOriginPullScalar, config.toggleOriginPullScalar);
  gl.uniform1f(uniforms.compute.u_repelScalar, config.repelScalar);
  gl.uniform1f(uniforms.compute.u_repelNearestScalar, config.repelNearestScalar);
  gl.uniform1f(uniforms.compute.u_maxRepelDistance, config.maxRepelDistance);
  gl.useProgram(programs.render);
  gl.uniform1f(uniforms.render.u_minPointSize, config.minPointSize);
  gl.uniform1f(uniforms.render.u_pointSizeByOriginDistance, config.pointSizeByOriginDistance);

  // -----------
  // -- Loops --
  // -----------

  const computeLoop = (deltaTime: number) => {
    gl.useProgram(programs.compute);
    gl.bindVertexArray(swapOne.computeVAO);

    gl.uniform1f(uniforms.compute.u_deltaTime, deltaTime);
    gl.uniform1i(uniforms.compute.u_pointerDown, input.clicked ? 1 : 0);
    gl.uniform2f(uniforms.compute.u_pointerPosition, input.x, input.y);

    gl.enable(gl.RASTERIZER_DISCARD);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, swapOne.TF);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, particleCount);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.disable(gl.RASTERIZER_DISCARD);
  };

  const renderLoop = () => {
    gl.useProgram(programs.render);
    gl.bindVertexArray(swapOne.renderVAO);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, particleCount);
  };

  let timeThen: number = 0;
  const mainLoop = (timeNow: number) => {
    timeNow *= 0.001;
    const deltaTime = timeNow - timeThen;
    timeThen = timeNow;

    // console.log(`fps: ${1 / deltaTime}`);

    computeLoop(deltaTime);
    renderLoop();

    const swap = swapOne;
    swapOne = swapTwo;
    swapTwo = swap;

    requestAnimationFrame(mainLoop);
  };

  requestAnimationFrame(mainLoop);
}
