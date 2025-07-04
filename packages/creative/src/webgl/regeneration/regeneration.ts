import { WebGL } from "@utilities/webgl";

import updateVertex from "./update-vertex.glsl";
import updateFragment from "./update-fragment.glsl";
import renderVertex from "./render-vertex.glsl";
import renderFragment from "./render-fragment.glsl";

const config = {
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
} as const;

let xPointer = 100;
let yPointer = 100;
let isPointerDown = false;
const particleCount = config.xCount * config.yCount;

function setupPointer(canvas: HTMLCanvasElement) {
  const canvasBounds = canvas.getBoundingClientRect();
  canvas.addEventListener("pointermove", (ev: PointerEvent) => {
    xPointer = ev.clientX - canvasBounds.left;
    yPointer = ev.clientY - canvasBounds.top;

    xPointer = xPointer / canvas.width;
    yPointer = (canvas.height - yPointer) / canvas.height;
  });

  // TODO: prevent event memory garbage
  window.addEventListener("pointerdown", () => {
    isPointerDown = true;
  });

  window.addEventListener("pointerup", () => {
    isPointerDown = false;
  });

  window.addEventListener("blur", () => {
    isPointerDown = false;
  });
}

function setupPrograms(gl: WebGL2RenderingContext) {
  const updateVS = WebGL.Setup.compileShader(gl, "vertex", updateVertex);
  const updateFS = WebGL.Setup.compileShader(gl, "fragment", updateFragment);
  const renderVS = WebGL.Setup.compileShader(gl, "vertex", renderVertex);
  const renderFS = WebGL.Setup.compileShader(gl, "fragment", renderFragment);

  return {
    update: WebGL.Setup.linkTransformFeedbackProgram(gl, updateVS, updateFS, ["tf_newPosition"], "separate"),
    render: WebGL.Setup.linkProgram(gl, renderVS, renderFS),
  };
}

function generatePositions() {
  const positions: number[] = [];

  for (let x = 0; x < config.xCount; x++) {
    for (let y = 0; y < config.yCount; y++) {
      const xPosition = config.offset + ((1 - config.offset * 2) / config.xCount) * x;
      const yPosition = config.offset + ((1 - config.offset * 2) / config.yCount) * y;
      positions.push(xPosition);
      positions.push(yPosition);
    }
  }

  return positions;
}

function setupUniformBlock(gl: WebGL2RenderingContext, programs: { update: WebGLProgram; render: WebGLProgram }) {
  const blockIndexInUpdate = gl.getUniformBlockIndex(programs.update, "GlobalStaticData");
  const blockIndexInRender = gl.getUniformBlockIndex(programs.render, "GlobalStaticData");

  gl.uniformBlockBinding(programs.update, blockIndexInUpdate, 0);
  gl.uniformBlockBinding(programs.render, blockIndexInRender, 0);

  const data = [
    config.originPullScalar,
    config.toggleOriginPullScalar,
    config.repelScalar,
    config.repelNearestScalar,
    config.maxRepelDistance,
    config.minPointSize,
    config.pointSizeByOriginDistance,
  ];

  const uniformBuffer = gl.createBuffer();
  gl.bindBuffer(gl.UNIFORM_BUFFER, uniformBuffer);
  gl.bufferData(gl.UNIFORM_BUFFER, data.length * 16, gl.STATIC_DRAW);

  gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, uniformBuffer);

  const globalStaticData = new Float32Array(data);
  gl.bufferSubData(gl.UNIFORM_BUFFER, 0, globalStaticData);
}

function setupState(gl: WebGL2RenderingContext, programs: { update: WebGLProgram; render: WebGLProgram }) {
  const locations = {
    update: {
      aCurrentPosition: gl.getAttribLocation(programs.update, "a_currentPosition"),
      aOriginalPosition: gl.getAttribLocation(programs.update, "a_originalPosition"),
      uPointerPosition: gl.getUniformLocation(programs.update, "u_pointerPosition"),
      uPointerDown: gl.getUniformLocation(programs.update, "u_pointerDown"),
      uDeltaTime: gl.getUniformLocation(programs.update, "u_deltaTime"),
    },
    render: {
      aNewPosition: gl.getAttribLocation(programs.render, "a_newPosition"),
      aOriginalPosition: gl.getAttribLocation(programs.render, "a_originalPosition"),
      uTextureIndex: gl.getUniformLocation(programs.render, "u_textureIndex"),
    },
  };

  setupUniformBlock(gl, programs);

  const data = {
    positions: new Float32Array(generatePositions()),
  };

  const buffers = {
    firstPosition: gl.createBuffer(),
    nextPosition: gl.createBuffer(),
    originalPosition: gl.createBuffer(),
  };

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstPosition);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextPosition);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.originalPosition);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  const vertexArrayObjects = {
    updateFirst: gl.createVertexArray(),
    updateNext: gl.createVertexArray(),
    renderFirst: gl.createVertexArray(),
    renderNext: gl.createVertexArray(),
  };

  // update VAO first data
  gl.bindVertexArray(vertexArrayObjects.updateFirst);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstPosition);
  gl.enableVertexAttribArray(locations.update.aCurrentPosition);
  gl.vertexAttribPointer(locations.update.aCurrentPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.originalPosition);
  gl.enableVertexAttribArray(locations.update.aOriginalPosition);
  gl.vertexAttribPointer(locations.update.aOriginalPosition, 2, gl.FLOAT, false, 0, 0);

  // update VAO next data
  gl.bindVertexArray(vertexArrayObjects.updateNext);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextPosition);
  gl.enableVertexAttribArray(locations.update.aCurrentPosition);
  gl.vertexAttribPointer(locations.update.aCurrentPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.originalPosition);
  gl.enableVertexAttribArray(locations.update.aOriginalPosition);
  gl.vertexAttribPointer(locations.update.aOriginalPosition, 2, gl.FLOAT, false, 0, 0);

  // render VAO first data
  gl.bindVertexArray(vertexArrayObjects.renderFirst);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstPosition);
  gl.enableVertexAttribArray(locations.render.aNewPosition);
  gl.vertexAttribPointer(locations.render.aNewPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.originalPosition);
  gl.enableVertexAttribArray(locations.render.aOriginalPosition);
  gl.vertexAttribPointer(locations.render.aOriginalPosition, 2, gl.FLOAT, false, 0, 0);

  // render VAO next data
  gl.bindVertexArray(vertexArrayObjects.renderNext);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextPosition);
  gl.enableVertexAttribArray(locations.render.aNewPosition);
  gl.vertexAttribPointer(locations.render.aNewPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.originalPosition);
  gl.enableVertexAttribArray(locations.render.aOriginalPosition);
  gl.vertexAttribPointer(locations.render.aOriginalPosition, 2, gl.FLOAT, false, 0, 0);

  const transformFeedbacks = {
    first: gl.createTransformFeedback(),
    next: gl.createTransformFeedback(),
  };

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.first);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.firstPosition);

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.next);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.nextPosition);

  // --- Unbind leftovers ---

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

  return { locations, vertexArrayObjects, transformFeedbacks };
}

export function main(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  setupPointer(canvas);

  const programs = setupPrograms(gl);

  const { locations, vertexArrayObjects, transformFeedbacks } = setupState(gl, programs);

  let current = {
    updateVAO: vertexArrayObjects.updateFirst,
    renderVAO: vertexArrayObjects.renderNext,
    TF: transformFeedbacks.next,
  };

  let swap = {
    updateVAO: vertexArrayObjects.updateNext,
    renderVAO: vertexArrayObjects.renderFirst,
    TF: transformFeedbacks.first,
  };

  WebGL.Canvas.resizeToDisplaySize(canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.08, 0.08, 0.08, 1.0);

  const updateLoop = (deltaTime: number) => {
    gl.useProgram(programs.update);
    gl.bindVertexArray(current.updateVAO);
    gl.uniform1f(locations.update.uDeltaTime, deltaTime);
    gl.uniform1i(locations.update.uPointerDown, isPointerDown ? 1 : 0);
    gl.uniform2f(locations.update.uPointerPosition, xPointer, yPointer);

    gl.enable(gl.RASTERIZER_DISCARD);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, current.TF);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, particleCount);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.disable(gl.RASTERIZER_DISCARD);
  };

  const renderLoop = () => {
    gl.useProgram(programs.render);
    gl.bindVertexArray(current.renderVAO);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, particleCount);
  };

  let timeThen: number = 0;
  const mainLoop = (timeNow: number) => {
    timeNow *= 0.001;
    const deltaTime = timeNow - timeThen;
    timeThen = timeNow;

    //console.log(`fps: ${1 / deltaTime}`);

    updateLoop(deltaTime);
    renderLoop();

    // --- Swap ---
    const temp = current;
    current = swap;
    swap = temp;

    requestAnimationFrame(mainLoop);
  };

  requestAnimationFrame(mainLoop);
}
