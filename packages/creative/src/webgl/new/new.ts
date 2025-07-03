import { WebGL } from "@utilities/webgl";
import { Random } from "@utilities/random";
import { NoiseGLSL } from "@utilities/noise-glsl";

import computeVertex from "./compute-vertex.glsl";
import computeFragment from "./compute-fragment.glsl";
import renderVertex from "./render-vertex.glsl";
import renderFragment from "./render-fragment.glsl";

const config = {
  canvasWidth: 600,
  canvasHeight: 600,

  particlesCount: 10000,
  noiseFrequency: 0.001,
  speed: 0.0002,
  size: 2.0,
} as const;

function setupPrograms(gl: WebGL2RenderingContext) {
  const fullComputeVertexShader = "#version 300 es\nprecision highp float;" + NoiseGLSL.Simplex.default + computeVertex;

  const computeVS = WebGL.Setup.compileShader(gl, "vertex", fullComputeVertexShader);
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
    velocities.push(Math.sin(angle));
    velocities.push(Math.cos(angle));
  }
  return velocities;
}

function setupState(gl: WebGL2RenderingContext, programs: { compute: WebGLProgram; render: WebGLProgram }) {
  const locations = {
    compute: {
      aPosition: gl.getAttribLocation(programs.compute, "a_position"),
      aVelocity: gl.getAttribLocation(programs.compute, "a_velocity"),
      uSpeed: gl.getUniformLocation(programs.compute, "u_speed"),
      uNoiseFrequency: gl.getUniformLocation(programs.compute, "u_noiseFrequency"),
    },

    render: {
      aNewPosition: gl.getAttribLocation(programs.render, "a_newPosition"),
      uSize: gl.getUniformLocation(programs.render, "u_size"),
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

  // -----------------------
  // -- Compute VAO First --
  // -----------------------

  gl.bindVertexArray(vertexArrayObjects.computeFirst);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.enableVertexAttribArray(locations.compute.aPosition);
  gl.vertexAttribPointer(locations.compute.aPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
  gl.enableVertexAttribArray(locations.compute.aVelocity);
  gl.vertexAttribPointer(locations.compute.aVelocity, 2, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- Compute VAO next --
  // ----------------------

  gl.bindVertexArray(vertexArrayObjects.computeNext);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionSwap);
  gl.enableVertexAttribArray(locations.compute.aPosition);
  gl.vertexAttribPointer(locations.compute.aPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
  gl.enableVertexAttribArray(locations.compute.aVelocity);
  gl.vertexAttribPointer(locations.compute.aVelocity, 2, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- Render VAO first --
  // ----------------------

  gl.bindVertexArray(vertexArrayObjects.renderFirst);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.enableVertexAttribArray(locations.render.aNewPosition);
  gl.vertexAttribPointer(locations.render.aNewPosition, 2, gl.FLOAT, false, 0, 0);

  // ---------------------
  // -- Render VAO next --
  // ---------------------

  gl.bindVertexArray(vertexArrayObjects.renderNext);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionSwap);
  gl.enableVertexAttribArray(locations.render.aNewPosition);
  gl.vertexAttribPointer(locations.render.aNewPosition, 2, gl.FLOAT, false, 0, 0);

  // -------------------------
  // -- Transform Feedbacks --
  // -------------------------

  const transformFeedbacks = {
    first: gl.createTransformFeedback(),
    next: gl.createTransformFeedback(),
  };

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.first);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.position);

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.next);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.positionSwap);

  // ----------------------
  // -- Unbind leftovers --
  // ----------------------

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

  return { vertexArrayObjects, transformFeedbacks, locations };
}

export function main(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  WebGL.Canvas.resizeToDisplaySize(canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.08, 0.08, 0.08, 1.0);

  const programs = setupPrograms(gl);

  const { vertexArrayObjects, transformFeedbacks, locations } = setupState(gl, programs);

  let auxA = {
    computeVAO: vertexArrayObjects.computeFirst,
    renderVAO: vertexArrayObjects.renderNext,
    TF: transformFeedbacks.next,
  };

  let auxB = {
    computeVAO: vertexArrayObjects.computeNext,
    renderVAO: vertexArrayObjects.renderFirst,
    TF: transformFeedbacks.first,
  };

  // ---------------------
  // -- Static Uniforms --
  // ---------------------

  gl.useProgram(programs.compute);
  gl.uniform1f(locations.compute.uSpeed, config.speed);
  gl.useProgram(programs.render);
  gl.uniform1f(locations.render.uSize, config.size);

  // -----------
  // -- Loops --
  // -----------

  const computeLoop = () => {
    gl.useProgram(programs.compute);
    gl.bindVertexArray(auxA.computeVAO);

    gl.enable(gl.RASTERIZER_DISCARD);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, auxA.TF);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, config.particlesCount);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.disable(gl.RASTERIZER_DISCARD);
  };

  const renderLoop = () => {
    gl.useProgram(programs.render);
    gl.bindVertexArray(auxA.renderVAO);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, config.particlesCount);
  };

  const mainLoop = () => {
    computeLoop();
    renderLoop();

    const swap = auxA;
    auxA = auxB;
    auxB = swap;

    requestAnimationFrame(mainLoop);
  };

  requestAnimationFrame(mainLoop);
}
