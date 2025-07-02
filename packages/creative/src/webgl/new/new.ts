import { WebGL } from "@utilities/webgl";
import { Random } from "@utilities/random";

import computeVertex from "./compute-vertex.glsl";
import computeFragment from "./compute-fragment.glsl";
import renderVertex from "./render-vertex.glsl";
import renderFragment from "./render-fragment.glsl";

const config = {
  canvasWidth: 600,
  canvasHeight: 600,

  particlesCount: 8000,
} as const;

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

function generatePositionData() {
  const positions: number[] = [];
  for (let i = 0; i < config.particlesCount; i++) {
    positions.push(Random.range(0, 1));
    positions.push(Random.range(0, 1));
  }
  return positions;
}

function generateVelocityData() {
  const velocities: number[] = [];
  for (let i = 0; i < config.particlesCount; i++) {
    const angle = Random.rangeInt(0, 360);

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    velocities.push(cos);
    velocities.push(sin);
  }
  return velocities;
}

function setupState(
  gl: WebGL2RenderingContext,
  programs: { compute: WebGLProgram; render: WebGLProgram },
) {
  const locations = {
    compute: {
      aPosition: gl.getAttribLocation(programs.compute, "a_oldPosition"),
      aVelocity: gl.getAttribLocation(programs.compute, "a_velocity"),
      uSpeed: gl.getUniformLocation(programs.compute, "u_speed"),
    },

    render: {
      aNewPosition: gl.getAttribLocation(programs.render, "a_newPosition"),
    },
  };

  const data = {
    positions: new Float32Array(generatePositionData()),
    velocities: new Float32Array(generateVelocityData()),
  };

  const buffers = {
    position: gl.createBuffer()!,
    positionSwap: gl.createBuffer()!,
    velocity: gl.createBuffer()!,
  };

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionSwap);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
  gl.bufferData(gl.ARRAY_BUFFER, data.velocities, gl.STATIC_DRAW);

  const vertexArrayObjects = {
    computeFirst: gl.createVertexArray(),
    computeNext: gl.createVertexArray(),
    renderFirst: gl.createVertexArray(),
    renderNext: gl.createVertexArray(),
  };

  // compute VAO first data
  gl.bindVertexArray(vertexArrayObjects.computeFirst);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.enableVertexAttribArray(locations.compute.aPosition);
  gl.vertexAttribPointer(locations.compute.aPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
  gl.enableVertexAttribArray(locations.compute.aVelocity);
  gl.vertexAttribPointer(locations.compute.aVelocity, 2, gl.FLOAT, false, 0, 0);

  // compute VAO next data
  gl.bindVertexArray(vertexArrayObjects.computeNext);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionSwap);
  gl.enableVertexAttribArray(locations.compute.aPosition);
  gl.vertexAttribPointer(locations.compute.aPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
  gl.enableVertexAttribArray(locations.compute.aVelocity);
  gl.vertexAttribPointer(locations.compute.aVelocity, 2, gl.FLOAT, false, 0, 0);

  // render VAO first data
  gl.bindVertexArray(vertexArrayObjects.renderFirst);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.enableVertexAttribArray(locations.render.aNewPosition);
  gl.vertexAttribPointer(
    locations.render.aNewPosition,
    2,
    gl.FLOAT,
    false,
    0,
    0,
  );

  // render VAO next data
  gl.bindVertexArray(vertexArrayObjects.renderNext);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionSwap);
  gl.enableVertexAttribArray(locations.render.aNewPosition);
  gl.vertexAttribPointer(
    locations.render.aNewPosition,
    2,
    gl.FLOAT,
    false,
    0,
    0,
  );

  const transformFeedbacks = {
    first: gl.createTransformFeedback(),
    newxt: gl.createTransformFeedback(),
  };

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.first);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.position);

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.newxt);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.positionSwap);

  // --- Unbind leftovers ---

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

  return { vertexArrayObjects, transformFeedbacks };
}

export function main(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  const programs = setupPrograms(gl);

  const { vertexArrayObjects, transformFeedbacks } = setupState(gl, programs);

  let current = {
    computeVAO: vertexArrayObjects.computeFirst,
    renderVAO: vertexArrayObjects.renderNext,
    TF: transformFeedbacks.newxt,
  };

  let swap = {
    computeVAO: vertexArrayObjects.computeNext,
    renderVAO: vertexArrayObjects.renderFirst,
    TF: transformFeedbacks.first,
  };

  WebGL.Canvas.resizeToDisplaySize(canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.08, 0.08, 0.08, 1.0);

  const updateLoop = () => {
    gl.useProgram(programs.compute);
    gl.bindVertexArray(current.computeVAO);

    gl.enable(gl.RASTERIZER_DISCARD);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, current.TF);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, config.particlesCount);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.disable(gl.RASTERIZER_DISCARD);
  };

  const renderLoop = () => {
    gl.useProgram(programs.render);
    gl.bindVertexArray(current.renderVAO);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, config.particlesCount);
  };

  const mainLoop = () => {
    updateLoop();
    renderLoop();

    // --- Swap ---
    const temp = current;
    current = swap;
    swap = temp;

    requestAnimationFrame(mainLoop);
  };

  requestAnimationFrame(mainLoop);
}
