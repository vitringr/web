import { Vector2 } from "@utilities/vector";
import { Random } from "@utilities/random";
import { WebGL } from "@utilities/webgl";

import updateVertex from "./update-vertex.glsl";
import updateFragment from "./update-fragment.glsl";
import renderVertex from "./render-vertex.glsl";
import renderFragment from "./render-fragment.glsl";

const config = {
  canvasWidth: 600,
  canvasHeight: 600,

  width: 200,
  height: 200,

  spawnChancePercent: 0.05,
  pointerArea: 0.01,
} as const;

const totalCells = config.width * config.height;

const pointer = {
  coordinates: Vector2.Create.zero(),
  isDown: 0,
};

function setupPointer(canvas: HTMLCanvasElement) {
  const canvasBounds = canvas.getBoundingClientRect();
  canvas.addEventListener("pointermove", (ev: PointerEvent) => {
    const x = ev.clientX - canvasBounds.left;
    const y = ev.clientY - canvasBounds.top;
    pointer.coordinates.set(
      x / canvas.width,
      (canvas.height - y) / canvas.height,
    );
  });

  // TODO: memory garbage
  window.addEventListener("pointerdown", () => {
    pointer.isDown = 1;
  });

  window.addEventListener("pointerup", () => {
    pointer.isDown = 0;
  });

  window.addEventListener("blur", () => {
    pointer.isDown = 0;
  });
}

function setupPrograms(gl: WebGL2RenderingContext) {
  const updateVS = WebGL.Setup.compileShader(gl, "vertex", updateVertex);
  const updateFS = WebGL.Setup.compileShader(gl, "fragment", updateFragment);
  const renderVS = WebGL.Setup.compileShader(gl, "vertex", renderVertex);
  const renderFS = WebGL.Setup.compileShader(gl, "fragment", renderFragment);

  return {
    update: WebGL.Setup.linkProgram(gl, updateVS, updateFS),
    render: WebGL.Setup.linkProgram(gl, renderVS, renderFS),
  };
}

function generateData() {
  const state: number[] = [];

  for (let y = 0; y < config.height; y++) {
    for (let x = 0; x < config.width; x++) {
      state.push(Random.chance(config.spawnChancePercent) ? 1 : 0);
    }
  }

  return state;
}

function setupUniformBlock(
  gl: WebGL2RenderingContext,
  programs: { update: WebGLProgram; render: WebGLProgram },
  canvas: HTMLCanvasElement,
) {
  const blockIndices = {
    update: {},
    render: {
      dimensions: gl.getUniformBlockIndex(
        programs.render,
        "DimensionsStaticData",
      ),
    },
  };

  const buffers = {
    dimensions: gl.createBuffer(),
  };

  const data = {
    dimensions: new Float32Array([
      config.width,
      config.height,
      canvas.width,
      canvas.height,
    ]),
  };

  const dimensionsIndex = 0;
  gl.uniformBlockBinding(
    programs.render,
    blockIndices.render.dimensions,
    dimensionsIndex,
  );
  gl.bindBuffer(gl.UNIFORM_BUFFER, buffers.dimensions);
  gl.bufferData(gl.UNIFORM_BUFFER, data.dimensions, gl.STATIC_DRAW);
  gl.bindBufferBase(gl.UNIFORM_BUFFER, dimensionsIndex, buffers.dimensions);
}

function setupState(
  gl: WebGL2RenderingContext,
  programs: { update: WebGLProgram; render: WebGLProgram },
  canvas: HTMLCanvasElement,
) {
  const locations = {
    update: {
      aCanvasVertices: gl.getAttribLocation(
        programs.update,
        "a_canvasVertices",
      ),
      uInputTextureIndex: gl.getUniformLocation(
        programs.update,
        "u_inputTextureIndex",
      ),
      uPointerPosition: gl.getUniformLocation(
        programs.update,
        "u_pointerPosition",
      ),
      uIsPointerDown: gl.getUniformLocation(programs.update, "u_isPointerDown"),
      uPointerArea: gl.getUniformLocation(programs.update, "u_pointerArea"),
      uPartition: gl.getUniformLocation(programs.update, "u_partition"),
    },
    render: {
      uOutputTextureIndex: gl.getUniformLocation(
        programs.render,
        "u_outputTextureIndex",
      ),
    },
  };

  setupUniformBlock(gl, programs, canvas);

  const data = {
    state: new Int8Array(generateData()),
    canvasVertices: new Float32Array(WebGL.Points.rectangle(0, 0, 1, 1)),
  };

  const vertexArrayObjects = {
    update: gl.createVertexArray(),
    render: gl.createVertexArray(),
  };

  const textures = {
    input: gl.createTexture(),
    output: gl.createTexture(),
  };

  const framebuffers = {
    update: gl.createFramebuffer(),
  };

  gl.bindVertexArray(vertexArrayObjects.update);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, data.canvasVertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(locations.update.aCanvasVertices);
  gl.vertexAttribPointer(
    locations.update.aCanvasVertices,
    2,
    gl.FLOAT,
    false,
    0,
    0,
  );

  gl.bindTexture(gl.TEXTURE_2D, textures.input);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.R8I,
    config.width,
    config.height,
    0,
    gl.RED_INTEGER,
    gl.BYTE,
    data.state,
  );
  WebGL.Texture.applyClampAndNearest(gl);

  gl.bindTexture(gl.TEXTURE_2D, textures.output);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.R8I,
    config.width,
    config.height,
    0,
    gl.RED_INTEGER,
    gl.BYTE,
    data.state,
  );
  WebGL.Texture.applyClampAndNearest(gl);

  return { locations, vertexArrayObjects, textures, framebuffers };
}

export function main(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  setupPointer(canvas);

  WebGL.Canvas.resizeToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.08, 0.08, 0.08, 1.0);

  const programs = setupPrograms(gl);

  const { locations, vertexArrayObjects, textures, framebuffers } = setupState(
    gl,
    programs,
    canvas,
  );

  let partition: boolean = false;

  const updateLoop = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers.update);
    gl.viewport(0, 0, config.width, config.height);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      textures.output,
      0,
    );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures.input);

    gl.useProgram(programs.update);
    gl.bindVertexArray(vertexArrayObjects.update);

    gl.uniform1i(locations.update.uInputTextureIndex, 0);
    gl.uniform1i(locations.update.uPartition, partition ? 1 : 0);
    gl.uniform2f(
      locations.update.uPointerPosition,
      pointer.coordinates.x,
      pointer.coordinates.y,
    );
    gl.uniform1i(locations.update.uIsPointerDown, pointer.isDown);
    gl.uniform1f(locations.update.uPointerArea, config.pointerArea);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const renderLoop = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures.output);

    gl.useProgram(programs.render);
    gl.bindVertexArray(vertexArrayObjects.render);

    gl.uniform1i(locations.render.uOutputTextureIndex, 0);

    gl.drawArrays(gl.POINTS, 0, totalCells);
  };

  const mainLoop = () => {
    updateLoop();
    renderLoop();

    partition = !partition;

    const swap = textures.input;
    textures.input = textures.output;
    textures.output = swap;

    requestAnimationFrame(mainLoop);
  };

  mainLoop();
}
