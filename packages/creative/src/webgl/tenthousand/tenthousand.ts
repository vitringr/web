import { WebGL } from "@utilities/webgl";
import { Random } from "@utilities/random";

import updateVertex from "./update-vertex.glsl";
import updateFragment from "./update-fragment.glsl";
import renderVertex from "./render-vertex.glsl";
import renderFragment from "./render-fragment.glsl";

import img from "./tenthousand.png";

const config = {
  canvasWidth: 600,
  canvasHeight: 600,
  particlesCount: 10_000,
  brightness: 3,
  speed: 0.0002,
  minSize: 1.5,
  sizeScalar: 3.0,
} as const;

const image = new Image();

function setupPrograms(gl: WebGL2RenderingContext) {
  const updateVS = WebGL.Setup.compileShader(gl, "vertex", updateVertex);
  const updateFS = WebGL.Setup.compileShader(gl, "fragment", updateFragment);
  const updateProgram = WebGL.Setup.linkTransformFeedbackProgram(
    gl,
    updateVS,
    updateFS,
    ["newPosition"],
    "separate",
  );

  const renderVS = WebGL.Setup.compileShader(gl, "vertex", renderVertex);
  const renderFS = WebGL.Setup.compileShader(gl, "fragment", renderFragment);
  const renderProgram = WebGL.Setup.linkProgram(gl, renderVS, renderFS);

  return { update: updateProgram, render: renderProgram };
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

function setupTexture(gl: WebGL2RenderingContext) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  WebGL.Texture.applyClampAndNearest(gl);
}

function setupUniformBlock(
  gl: WebGL2RenderingContext,
  programs: { update: WebGLProgram; render: WebGLProgram },
) {
  const blockIndexInUpdate = gl.getUniformBlockIndex(
    programs.update,
    "GlobalStaticData",
  );
  const blockIndexInRender = gl.getUniformBlockIndex(
    programs.render,
    "GlobalStaticData",
  );

  gl.uniformBlockBinding(programs.update, blockIndexInUpdate, 0);
  gl.uniformBlockBinding(programs.render, blockIndexInRender, 0);

  const data = [
    config.brightness,
    config.speed,
    config.minSize,
    config.sizeScalar,
  ];

  const uniformBuffer = gl.createBuffer();
  gl.bindBuffer(gl.UNIFORM_BUFFER, uniformBuffer);
  gl.bufferData(gl.UNIFORM_BUFFER, data.length * 16, gl.STATIC_DRAW);

  gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, uniformBuffer);

  const globalStaticData = new Float32Array(data);
  gl.bufferSubData(gl.UNIFORM_BUFFER, 0, globalStaticData);
}

function setupState(
  gl: WebGL2RenderingContext,
  programs: { update: WebGLProgram; render: WebGLProgram },
) {
  setupUniformBlock(gl, programs);

  const locations = {
    update: {
      aOldPosition: gl.getAttribLocation(programs.update, "a_oldPosition"),
      aVelocity: gl.getAttribLocation(programs.update, "a_velocity"),
    },
    render: {
      aNewPosition: gl.getAttribLocation(programs.render, "a_newPosition"),
      uTextureIndex: gl.getUniformLocation(programs.render, "u_textureIndex"),
    },
  };

  const data = {
    positions: new Float32Array(generatePositionData()),
    velocities: new Float32Array(generateVelocityData()),
  };

  const buffers = {
    firstPosition: gl.createBuffer()!,
    nextPosition: gl.createBuffer()!,
    velocity: gl.createBuffer()!,
  };

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstPosition);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextPosition);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
  gl.bufferData(gl.ARRAY_BUFFER, data.velocities, gl.STATIC_DRAW);

  const vertexArrayObjects = {
    updateFirst: gl.createVertexArray(),
    updateNext: gl.createVertexArray(),
    renderFirst: gl.createVertexArray(),
    renderNext: gl.createVertexArray(),
  };

  // update VAO first data
  gl.bindVertexArray(vertexArrayObjects.updateFirst);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstPosition);
  gl.enableVertexAttribArray(locations.update.aOldPosition);
  gl.vertexAttribPointer(
    locations.update.aOldPosition,
    2,
    gl.FLOAT,
    false,
    0,
    0,
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
  gl.enableVertexAttribArray(locations.update.aVelocity);
  gl.vertexAttribPointer(locations.update.aVelocity, 2, gl.FLOAT, false, 0, 0);

  // update VAO next data
  gl.bindVertexArray(vertexArrayObjects.updateNext);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextPosition);
  gl.enableVertexAttribArray(locations.update.aOldPosition);
  gl.vertexAttribPointer(
    locations.update.aOldPosition,
    2,
    gl.FLOAT,
    false,
    0,
    0,
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
  gl.enableVertexAttribArray(locations.update.aVelocity);
  gl.vertexAttribPointer(locations.update.aVelocity, 2, gl.FLOAT, false, 0, 0);

  // render VAO first data
  gl.bindVertexArray(vertexArrayObjects.renderFirst);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstPosition);
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

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextPosition);
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
    firstPosition: gl.createTransformFeedback(),
    nextPosition: gl.createTransformFeedback(),
  };

  gl.bindTransformFeedback(
    gl.TRANSFORM_FEEDBACK,
    transformFeedbacks.firstPosition,
  );
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.firstPosition);

  gl.bindTransformFeedback(
    gl.TRANSFORM_FEEDBACK,
    transformFeedbacks.nextPosition,
  );
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.nextPosition);

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

  image.src = img;

  image.onload = () => {
    const programs = setupPrograms(gl);

    const { vertexArrayObjects, transformFeedbacks } = setupState(
      gl,
      programs,
    );

    setupTexture(gl);

    let current = {
      updateVAO: vertexArrayObjects.updateFirst,
      renderVAO: vertexArrayObjects.renderNext,
      TF: transformFeedbacks.nextPosition,
    };

    let swap = {
      updateVAO: vertexArrayObjects.updateNext,
      renderVAO: vertexArrayObjects.renderFirst,
      TF: transformFeedbacks.firstPosition,
    };

    WebGL.Canvas.resizeToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.08, 0.08, 0.08, 1.0);

    const updateLoop = () => {
      gl.useProgram(programs.update);
      gl.bindVertexArray(current.updateVAO);

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
  };
}
