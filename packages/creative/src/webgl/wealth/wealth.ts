import { NoiseGLSL } from "@utilities/noise-glsl";
import { Random } from "@utilities/random";
import { WebGL } from "@utilities/webgl";
import { Noise } from "@utilities/noise";

import { Config, defaultConfig } from "./config";

import computeVertex from "./shaders/compute-vertex.glsl";
import computeFragment from "./shaders/compute-fragment.glsl";
import renderVertex from "./shaders/render-vertex.glsl";
import renderFragment from "./shaders/render-fragment.glsl";

let config: Config;
const input = {
  x: -99999,
  y: -99999,
  clicked: false,
};

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
  const fullComputeVS = WebGL.GLSL.getBegin() + NoiseGLSL.Simplex.default + computeVertex;
  const computeVS = WebGL.Setup.compileShader(gl, "vertex", fullComputeVS);
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

  return { compute: computeProgram, render: renderProgram } as const;
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  // TODO: Optimize
  const words = text.split(" ");
  let line = "";

  let lines = 0;
  for (const word of words) {
    const testLine = line + word + " ";
    const metrics = context.measureText(testLine);
    if (metrics.width > maxWidth && line.length > 0) {
      lines++;
      context.fillText(line, x, y);
      line = word + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

function createTextOrigins() {
  const auxCanvas = document.createElement("canvas");
  auxCanvas.width = config.width;
  auxCanvas.height = config.height;

  const auxContext = auxCanvas.getContext("2d");
  if (!auxContext) throw "Cannot get aux 2d context!";

  auxContext.font = `${config.textSize}px sans-serif`;
  auxContext.textAlign = "center";
  auxContext.textRendering = "optimizeLegibility";

  auxContext.fillStyle = "#000000";
  auxContext.fillRect(0, 0, config.width, config.height);

  auxContext.fillStyle = "#FFFFFF";
  drawWrappedText(
    auxContext,
    config.text,
    config.width * 0.5,
    config.height * config.textY,
    config.textMaxWidth,
    config.textLineHeight,
  );

  const image = new Image();
  image.src = auxCanvas.toDataURL();

  auxContext.drawImage(image, 0, 0, config.width, config.height);
  const imageData = auxContext.getImageData(0, 0, config.width, config.height).data;

  auxContext.clearRect(0, 0, config.width, config.height);

  const particleOrigins: { x: number; y: number }[] = [];

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i + 0];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    const index = i / 4;
    const x = index % config.width;
    const y = Math.floor(index / config.height);

    if (r + g + b > 100) {
      particleOrigins.push({ x, y });
    }
  }

  return particleOrigins;
}

function generateData() {
  const particleTextOrigins = createTextOrigins();

  const count = particleTextOrigins.length;

  const textOrigins: number[] = [];
  for (let i = 0; i < count; i++) {
    const origin = particleTextOrigins[i];
    textOrigins.push(origin.x / config.width);
    textOrigins.push((config.height - origin.y) / config.height);
  }

  const messOrigins: number[] = [];
  for (let i = 0; i < count; i++) {
    const xNoise = Noise.Simplex.getFractal((i + 1.2345) * 0.5, (i - 1.2345) * 0.1, 2);
    const yNoise = Noise.Simplex.getFractal((i + 9.8765) * 0.5, (i + 6.3719) * 0.1, 2);
    messOrigins.push(xNoise);
    messOrigins.push(yNoise);
  }

  const spawnPositions: number[] = [];
  for (let i = 0; i < count; i++) {
    spawnPositions.push(Random.range(0, 1));
    spawnPositions.push(Random.range(0, 1));
  }

  const random: number[] = [];
  for (let i = 0; i < count; i++) {
    random.push(Math.random());
  }

  return {
    particleCount: count,
    spawnPositions: new Float32Array(spawnPositions),
    textOrigins: new Float32Array(textOrigins),
    messOrigins: new Float32Array(messOrigins),
    random: new Float32Array(random),
  } as const;
}

function setupState(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  const data = generateData();

  const uniforms = {
    compute: {
      u_time: gl.getUniformLocation(computeProgram, "u_time"),
      u_input: gl.getUniformLocation(computeProgram, "u_input"),
      u_isPressed: gl.getUniformLocation(computeProgram, "u_isPressed"),
      u_returnSpeed: gl.getUniformLocation(computeProgram, "u_returnSpeed"),
      u_repelRadius: gl.getUniformLocation(computeProgram, "u_repelRadius"),
      u_repelSpeed: gl.getUniformLocation(computeProgram, "u_repelSpeed"),
      u_textNoiseEffect: gl.getUniformLocation(computeProgram, "u_textNoiseEffect"),
      u_messNoiseEffect: gl.getUniformLocation(computeProgram, "u_messNoiseEffect"),
      u_noiseFrequency: gl.getUniformLocation(computeProgram, "u_noiseFrequency"),
    },
    render: {
      u_size: gl.getUniformLocation(renderProgram, "u_size"),
    },
  } as const;

  const attributes = {
    compute: {
      a_position: gl.getAttribLocation(computeProgram, "a_position"),
      a_textOrigin: gl.getAttribLocation(computeProgram, "a_textOrigin"),
      a_messOrigin: gl.getAttribLocation(computeProgram, "a_messOrigin"),
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
    textOrigin: gl.createBuffer(),
    noiseOrigin: gl.createBuffer(),
    random: gl.createBuffer(),
  } as const;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.bufferData(gl.ARRAY_BUFFER, data.spawnPositions, gl.DYNAMIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.bufferData(gl.ARRAY_BUFFER, data.spawnPositions, gl.DYNAMIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textOrigin);
  gl.bufferData(gl.ARRAY_BUFFER, data.textOrigins, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.noiseOrigin);
  gl.bufferData(gl.ARRAY_BUFFER, data.messOrigins, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.random);
  gl.bufferData(gl.ARRAY_BUFFER, data.random, gl.STATIC_DRAW);

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

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textOrigin);
  gl.enableVertexAttribArray(attributes.compute.a_textOrigin);
  gl.vertexAttribPointer(attributes.compute.a_textOrigin, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.noiseOrigin);
  gl.enableVertexAttribArray(attributes.compute.a_messOrigin);
  gl.vertexAttribPointer(attributes.compute.a_messOrigin, 2, gl.FLOAT, false, 0, 0);

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

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textOrigin);
  gl.enableVertexAttribArray(attributes.compute.a_textOrigin);
  gl.vertexAttribPointer(attributes.compute.a_textOrigin, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.noiseOrigin);
  gl.enableVertexAttribArray(attributes.compute.a_messOrigin);
  gl.vertexAttribPointer(attributes.compute.a_messOrigin, 2, gl.FLOAT, false, 0, 0);

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

  return { particleCount: data.particleCount, uniforms, vertexArrayObjects, transformFeedbacks } as const;
}

function setupInput(canvas: HTMLCanvasElement) {
  canvas.addEventListener("pointermove", (event: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect();
    input.x = event.clientX - bounds.left;
    input.y = event.clientY - bounds.top;

    input.x /= config.width;
    input.y /= config.height;

    input.y = 1 - input.y;
  });

  canvas.addEventListener("pointerdown", () => {
    input.clicked = true;
  });

  window.addEventListener("pointerup", () => {
    input.clicked = false;
  });

  window.addEventListener("blur", () => {
    input.clicked = false;
  });
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  setupInput(canvas);

  const gl = setupGL(canvas);

  const programs = setupPrograms(gl);

  const { particleCount, uniforms, vertexArrayObjects, transformFeedbacks } = setupState(
    gl,
    programs.compute,
    programs.render,
  );

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
  gl.uniform2f(uniforms.compute.u_returnSpeed, config.returnSpeed.min, config.returnSpeed.max);
  gl.uniform1f(uniforms.compute.u_repelRadius, config.repelRadius);
  gl.uniform1f(uniforms.compute.u_repelSpeed, config.repelSpeed);
  gl.useProgram(programs.render);
  gl.uniform2f(uniforms.render.u_size, config.size.min, config.size.max);

  let time = 0;

  const computeLoop = () => {
    time += config.timeIncrement;

    gl.useProgram(programs.compute);
    gl.bindVertexArray(swapOne.computeVAO);

    gl.uniform1f(uniforms.compute.u_time, time);
    gl.uniform1f(uniforms.compute.u_noiseFrequency, config.noiseFrequency);
    gl.uniform1f(uniforms.compute.u_textNoiseEffect, config.textNoiseEffect);
    gl.uniform1f(uniforms.compute.u_messNoiseEffect, config.messNoiseEffect);
    gl.uniform1f(uniforms.compute.u_isPressed, input.clicked ? 1 : 0);
    gl.uniform2f(uniforms.compute.u_input, input.x, input.y);

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

    gl.drawArrays(gl.POINTS, 0, particleCount);
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
