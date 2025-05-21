import { Random } from "@utilities/random";
import { WebGL } from "@utilities/webgl";

import simulationVertex from "./simulation-vertex.glsl";
import simulationFragment from "./simulation-fragment.glsl";
import renderVertex from "./render-vertex.glsl";
import renderFragment from "./render-fragment.glsl";

const width = 20;
const height = 20;

function createTextureData(count: number) {
  const textureData: number[] = [];

  for (let i = 0; i < count; i++) {
    const xPosition = Random.rangeInt(0, 255);
    const yPosition = Random.rangeInt(0, 255);
    const angle = Random.rangeInt(0, 255);

    textureData.push(xPosition);
    textureData.push(yPosition);
    textureData.push(angle);
  }

  return textureData;
}

export function main(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  canvas.width = canvas.height = 600;

  const simulationVS = WebGL.Setup.compileShader(
    gl,
    "vertex",
    simulationVertex,
  );
  const simulationFS = WebGL.Setup.compileShader(
    gl,
    "fragment",
    simulationFragment,
  );
  const renderVS = WebGL.Setup.compileShader(gl, "vertex", renderVertex);
  const renderFS = WebGL.Setup.compileShader(gl, "fragment", renderFragment);

  const simulationProgram = WebGL.Setup.linkProgram(
    gl,
    simulationVS,
    simulationFS,
  );
  const renderProgram = WebGL.Setup.linkProgram(gl, renderVS, renderFS);

  WebGL.Canvas.resizeToDisplaySize(canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  const locations = {
    simulation: {
      aCanvasVertices: gl.getAttribLocation(
        simulationProgram,
        "a_canvasVertices",
      ),
      uOldTextureIndex: gl.getUniformLocation(
        simulationProgram,
        "u_oldTextureIndex",
      ),
      uDeltaTime: gl.getUniformLocation(simulationProgram, "u_deltaTime"),
    },
    render: {
      uNewTextureIndex: gl.getUniformLocation(
        renderProgram,
        "u_newTextureIndex",
      ),
      uWidth: gl.getUniformLocation(renderProgram, "u_width"),
      uHeight: gl.getUniformLocation(renderProgram, "u_height"),
    },
  };

  // --- Attribute ---

  const canvasVertices = WebGL.Points.rectangle(0, 0, 1, 1);

  const simulationVAO = gl.createVertexArray();
  gl.bindVertexArray(simulationVAO);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(canvasVertices),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(locations.simulation.aCanvasVertices);
  gl.vertexAttribPointer(
    locations.simulation.aCanvasVertices,
    2,
    gl.FLOAT,
    false,
    0,
    0,
  );

  const renderVAO = gl.createVertexArray();
  gl.bindVertexArray(renderVAO);

  // --- Textures ---

  const target = gl.TEXTURE_2D;
  const level = 0;
  const internalFormat = gl.RGB8;
  const border = 0;
  const format = gl.RGB;
  const type = gl.UNSIGNED_BYTE;

  // First

  let firstTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, firstTexture);

  const data = new Uint8Array(createTextureData(width * height));
  gl.texImage2D(
    target,
    level,
    internalFormat,
    width,
    height,
    border,
    format,
    type,
    data,
  );

  WebGL.Texture.applyClampAndNearest(gl);

  // Next

  let nextTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, nextTexture);

  const emptyData = new Uint8Array(data.map(() => 0));
  gl.texImage2D(
    target,
    level,
    internalFormat,
    width,
    height,
    border,
    format,
    type,
    emptyData,
  );

  WebGL.Texture.applyClampAndNearest(gl);

  const fb = gl.createFramebuffer();

  // --- Loop ---

  let timeThen: number = 0;
  const loop = (timeNow: number) => {
    timeNow *= 0.001;
    const deltaTime: number = timeNow - timeThen;
    timeThen = timeNow;

    // --- Simulation ---

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.viewport(0, 0, width, height);

    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      nextTexture,
      0,
    );

    gl.useProgram(simulationProgram);
    gl.bindVertexArray(simulationVAO);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, firstTexture);

    gl.uniform1i(locations.simulation.uOldTextureIndex, 0);
    gl.uniform1f(locations.simulation.uDeltaTime, deltaTime);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // --- Render ---

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.useProgram(renderProgram);
    gl.bindVertexArray(renderVAO);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, nextTexture);

    gl.uniform1i(locations.render.uNewTextureIndex, 0);
    gl.uniform1f(locations.render.uWidth, width);
    gl.uniform1f(locations.render.uHeight, height);

    gl.drawArrays(gl.POINTS, 0, width * height);

    // --- Swap ---

    let temp = firstTexture;
    firstTexture = nextTexture;
    nextTexture = temp;

    requestAnimationFrame(loop);
  };

  loop(0);
}
