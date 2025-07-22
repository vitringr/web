/*

TODO:
  - Colors
  - FPS config
*/

import { WebGL } from "@utilities/webgl";
import { Random } from "@utilities/random";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

const defaultConfig = {
  width: 800,
  height: 800,

  rows: 160,
  cols: 160,

  spawnChance: 0.7,
};

type Config = typeof defaultConfig;

let config: Config;

function setupProgram(gl: WebGL2RenderingContext) {
  const vs = WebGL.Setup.compileShader(gl, "vertex", vertexShader);
  const fs = WebGL.Setup.compileShader(gl, "fragment", fragmentShader);
  const program = WebGL.Setup.linkProgram(gl, vs, fs);
  return program;
}

function setupGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  canvas.width = config.width;
  canvas.height = config.height;

  WebGL.Canvas.resizeToDisplaySize(canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  return gl;
}

function generateData() {
  const state = new Uint8Array(config.rows * config.cols * 4);
  for (let i = 0; i < state.length; i += 4) {
    state[i] = Random.chance(config.spawnChance) ? 255 : 0;
    state[i + 1] = 0;
    state[i + 2] = 0;
    state[i + 3] = 0;
  }

  const canvasVertices = new Float32Array(WebGL.Points.rectangle(0, 0, 1, 1));

  return { state, canvasVertices } as const;
}

function setupState(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const data = generateData();

  const attributes = {
    a_canvasVertices: gl.getAttribLocation(program, "a_canvasVertices"),
  } as const;

  const framebuffer = gl.createFramebuffer();

  const vertexArrayObject = gl.createVertexArray();
  gl.bindVertexArray(vertexArrayObject);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, data.canvasVertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attributes.a_canvasVertices);
  gl.vertexAttribPointer(attributes.a_canvasVertices, 2, gl.FLOAT, false, 0, 0);

  const textures = {
    heads: gl.createTexture(),
    tails: gl.createTexture(),
  };

  gl.bindTexture(gl.TEXTURE_2D, textures.heads);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, config.cols, config.rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, data.state);
  WebGL.Texture.applyClampAndNearest(gl);

  gl.bindTexture(gl.TEXTURE_2D, textures.tails);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, config.cols, config.rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, data.state);
  WebGL.Texture.applyClampAndNearest(gl);

  return { framebuffer, vertexArrayObject, textures } as const;
}

function setupUniforms(gl: WebGL2RenderingContext, program: WebGLProgram) {
  return {
    u_resolution: gl.getUniformLocation(program, "u_resolution"),
    u_textureIndex: gl.getUniformLocation(program, "u_textureIndex"),
    u_pass: gl.getUniformLocation(program, "u_pass"),
  } as const;
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const gl = setupGL(canvas);
  const program = setupProgram(gl);
  const uniforms = setupUniforms(gl, program);
  const { vertexArrayObject, textures, framebuffer } = setupState(gl, program);

  gl.useProgram(program);
  gl.bindVertexArray(vertexArrayObject);
  gl.uniform2f(uniforms.u_resolution, config.cols, config.rows);

  // Texture switch without swaps
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures.heads);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, textures.tails);
  let currentTextureUnit = 0;

  const simulationPass = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    const writeToTexture = currentTextureUnit === 0 ? textures.tails : textures.heads;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, writeToTexture, 0);
    gl.viewport(0, 0, config.cols, config.rows);

    gl.uniform1i(uniforms.u_textureIndex, currentTextureUnit);
    gl.uniform1i(uniforms.u_pass, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const renderPass = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.uniform1i(uniforms.u_textureIndex, 1 - currentTextureUnit);
    gl.uniform1i(uniforms.u_pass, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  let count = 0;
  const animation = () => {
    count++;
    if (count % 10 !== 0) {
      requestAnimationFrame(animation);
      return;
    }

    simulationPass();
    renderPass();

    currentTextureUnit = 1 - currentTextureUnit;

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
