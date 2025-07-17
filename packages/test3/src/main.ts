import { WebGL } from "@utilities/webgl";
import { Random } from "@utilities/random";
import { Config, defaultConfig } from "./config";

import computeVertex from "./shaders/compute-vertex.glsl";
import computeFragment from "./shaders/compute-fragment.glsl";
import renderVertex from "./shaders/render-vertex.glsl";
import renderFragment from "./shaders/render-fragment.glsl";

let config: Config;
const input: { x: number; y: number; clicked: boolean } = {
  x: 0,
  y: 0,
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
  console.log("lines", lines);
  context.fillText(line, x, y);
}

function createParticleOrigins() {
  const auxCanvas = document.createElement("canvas");
  auxCanvas.width = config.width;
  auxCanvas.height = config.height;

  const auxContext = auxCanvas.getContext("2d");
  if (!auxContext) throw "Cannot get aux 2d context!";

  auxContext.font = `${config.textSize}px Arial, sans-serif`;
  auxContext.textAlign = "center";
  auxContext.textBaseline = "middle";
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
  const particleOrigins = createParticleOrigins();

  const count = particleOrigins.length;

  const origins: number[] = [];
  for (let i = 0; i < count; i++) {
    const origin = particleOrigins[i];
    origins.push(origin.x / config.width);
    origins.push((config.height - origin.y) / config.height);
  }

  const positions: number[] = [];
  for (let i = 0; i < count; i++) {
    positions.push(Random.range(0, 1));
    positions.push(Random.range(0, 1));
  }

  const random: number[] = [];
  for (let i = 0; i < count; i++) {
    random.push(Math.random());
  }

  return {
    particleCount: count,
    positions: new Float32Array(positions),
    origins: new Float32Array(origins),
    random: new Float32Array(random),
  };
}

function setupState(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  const data = generateData();

  const uniforms = {
    compute: {
      u_input: gl.getUniformLocation(computeProgram, "u_input"),
      u_returnSpeed: gl.getUniformLocation(computeProgram, "u_returnSpeed"),
      u_repelSpeed: gl.getUniformLocation(computeProgram, "u_repelSpeed"),
      u_repelRadius: gl.getUniformLocation(computeProgram, "u_repelRadius"),
    },
    render: {
      u_size: gl.getUniformLocation(renderProgram, "u_size"),
    },
  } as const;

  const attributes = {
    compute: {
      a_position: gl.getAttribLocation(computeProgram, "a_position"),
      a_origin: gl.getAttribLocation(computeProgram, "a_origin"),
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
    origin: gl.createBuffer(),
    random: gl.createBuffer(),
  } as const;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.origin);
  gl.bufferData(gl.ARRAY_BUFFER, data.origins, gl.STATIC_DRAW);

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

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.origin);
  gl.enableVertexAttribArray(attributes.compute.a_origin);
  gl.vertexAttribPointer(attributes.compute.a_origin, 2, gl.FLOAT, false, 0, 0);

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

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.origin);
  gl.enableVertexAttribArray(attributes.compute.a_origin);
  gl.vertexAttribPointer(attributes.compute.a_origin, 2, gl.FLOAT, false, 0, 0);

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

  return { particleCount: data.particleCount, uniforms, vertexArrayObjects, transformFeedbacks };
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

  console.log("particleCount", particleCount);

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
  gl.uniform2f(uniforms.compute.u_repelSpeed, config.repelSpeed.min, config.repelSpeed.max);
  gl.uniform1f(uniforms.compute.u_repelRadius, config.repelRadius);
  gl.useProgram(programs.render);
  gl.uniform2f(uniforms.render.u_size, config.size.min, config.size.max);

  const computeLoop = () => {
    gl.useProgram(programs.compute);
    gl.bindVertexArray(swapOne.computeVAO);

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
