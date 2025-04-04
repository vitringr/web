import { Utilities } from "../../../utilities";

import updateVertex from "./update-vertex.glsl";
import updateFragment from "./update-fragment.glsl";
import renderVertex from "./render-vertex.glsl";
import renderFragment from "./render-fragment.glsl";

export class Godfather {
  private readonly particlesCount = 6_000;
  private readonly minColor = 0.4;
  private readonly minPointSize = 3.0;
  private readonly colorPointSizeScalar = 0.7;
  private readonly colorSlowScalar = 6.0;
  private readonly minGravity = 0.001;
  private readonly minLimitGravity = 0.1;
  private readonly maxLimitGravity = 0.6;

  private initialized = false;
  private image = new Image();

  constructor(private readonly canvas: HTMLCanvasElement) { }

  init() {
    if (this.initialized) throw "Already initialized";
    this.initialized = true;

    const gl = this.canvas.getContext("webgl2");
    if (!gl) throw new Error("Failed to get WebGL2 context");

    this.image.src = "assets/godfather.png";
    this.image.onload = () => this.main(gl);
  }

  private setupPrograms(gl: WebGL2RenderingContext) {
    const updateVS = Utilities.WebGL.Setup.compileShader(gl, "vertex", updateVertex);
    const updateFS = Utilities.WebGL.Setup.compileShader(gl, "fragment", updateFragment);
    const renderVS = Utilities.WebGL.Setup.compileShader(gl, "vertex", renderVertex);
    const renderFS = Utilities.WebGL.Setup.compileShader(gl, "fragment", renderFragment);

    return {
      update: Utilities.WebGL.Setup.linkTransformFeedbackProgram(
        gl,
        updateVS,
        updateFS,
        ["newPosition", "texelColor"],
        "separate",
      ),
      render: Utilities.WebGL.Setup.linkProgram(gl, renderVS, renderFS),
    };
  }

  private generatePositionData() {
    const positions: number[] = [];
    for (let i = 0; i < this.particlesCount; i++) {
      positions.push(Utilities.Random.range(0, 1));
      positions.push(Utilities.Random.range(1, 10));
    }
    return positions;
  }

  private generateWeightData() {
    const weights: number[] = [];
    for (let i = 0; i < this.particlesCount; i++) {
      weights.push(Utilities.Random.range(0, 1));
    }
    return weights;
  }

  private setupTexture(gl: WebGL2RenderingContext) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
    Utilities.WebGL.Texture.applyClampAndNearest(gl);
  }

  private setupUniformBlock(gl: WebGL2RenderingContext, programs: { update: WebGLProgram; render: WebGLProgram }) {
    const blockIndexInUpdate = gl.getUniformBlockIndex(programs.update, "GlobalStaticData");
    const blockIndexInRender = gl.getUniformBlockIndex(programs.render, "GlobalStaticData");

    gl.uniformBlockBinding(programs.update, blockIndexInUpdate, 0);
    gl.uniformBlockBinding(programs.render, blockIndexInRender, 0);

    const data = [
      this.minColor,
      this.minPointSize,
      this.colorPointSizeScalar,
      this.colorSlowScalar,
      this.minGravity,
      this.minLimitGravity,
      this.maxLimitGravity,
    ];

    const uniformBuffer = gl.createBuffer();
    gl.bindBuffer(gl.UNIFORM_BUFFER, uniformBuffer);
    gl.bufferData(gl.UNIFORM_BUFFER, data.length * 16, gl.STATIC_DRAW);

    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, uniformBuffer);

    const globalStaticData = new Float32Array(data);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, globalStaticData);
  }

  private setupState(gl: WebGL2RenderingContext, programs: { update: WebGLProgram; render: WebGLProgram }) {
    const locations = {
      update: {
        aCurrentPosition: gl.getAttribLocation(programs.update, "a_currentPosition"),
        aWeight: gl.getAttribLocation(programs.update, "a_weight"),
        uTextureIndex: gl.getUniformLocation(programs.update, "u_textureIndex"),
        uDeltaTime: gl.getUniformLocation(programs.update, "u_deltaTime"),
      },
      render: {
        aNewPosition: gl.getAttribLocation(programs.render, "a_newPosition"),
        aTexelColor: gl.getAttribLocation(programs.render, "a_texelColor"),
      },
    };

    this.setupUniformBlock(gl, programs);

    const data = {
      positions: new Float32Array(this.generatePositionData()),
      weights: new Float32Array(this.generateWeightData()),
    };

    const buffers = {
      firstPosition: gl.createBuffer()!,
      nextPosition: gl.createBuffer()!,
      firstTexelColor: gl.createBuffer()!,
      nextTexelColor: gl.createBuffer()!,
      weight: gl.createBuffer()!,
    };

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstPosition);
    gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextPosition);
    gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstTexelColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.particlesCount * 3).fill(0), gl.STREAM_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextTexelColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.particlesCount * 3).fill(0), gl.STREAM_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.weight);
    gl.bufferData(gl.ARRAY_BUFFER, data.weights, gl.STREAM_DRAW);

    const vertexArrayObjects = {
      updateFirst: gl.createVertexArray(),
      updateNext: gl.createVertexArray(),
      renderFirst: gl.createVertexArray(),
      renderNext: gl.createVertexArray(),
    };

    // update VAO first
    gl.bindVertexArray(vertexArrayObjects.updateFirst);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstPosition);
    gl.enableVertexAttribArray(locations.update.aCurrentPosition);
    gl.vertexAttribPointer(locations.update.aCurrentPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.weight);
    gl.enableVertexAttribArray(locations.update.aWeight);
    gl.vertexAttribPointer(locations.update.aWeight, 1, gl.FLOAT, false, 0, 0);

    // update VAO next
    gl.bindVertexArray(vertexArrayObjects.updateNext);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextPosition);
    gl.enableVertexAttribArray(locations.update.aCurrentPosition);
    gl.vertexAttribPointer(locations.update.aCurrentPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.weight);
    gl.enableVertexAttribArray(locations.update.aWeight);
    gl.vertexAttribPointer(locations.update.aWeight, 1, gl.FLOAT, false, 0, 0);

    // render VAO first
    gl.bindVertexArray(vertexArrayObjects.renderFirst);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstPosition);
    gl.enableVertexAttribArray(locations.render.aNewPosition);
    gl.vertexAttribPointer(locations.render.aNewPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstTexelColor);
    gl.enableVertexAttribArray(locations.render.aTexelColor);
    gl.vertexAttribPointer(locations.render.aTexelColor, 3, gl.FLOAT, false, 0, 0);

    // render VAO next
    gl.bindVertexArray(vertexArrayObjects.renderNext);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextPosition);
    gl.enableVertexAttribArray(locations.render.aNewPosition);
    gl.vertexAttribPointer(locations.render.aNewPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextTexelColor);
    gl.enableVertexAttribArray(locations.render.aTexelColor);
    gl.vertexAttribPointer(locations.render.aTexelColor, 3, gl.FLOAT, false, 0, 0);

    const transformFeedbacks = {
      first: gl.createTransformFeedback(),
      next: gl.createTransformFeedback(),
    };

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.first);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.firstPosition);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, buffers.firstTexelColor);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.next);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.nextPosition);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, buffers.nextTexelColor);

    // --- Unbind leftovers ---

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

    return { locations, vertexArrayObjects, transformFeedbacks };
  }

  private main(gl: WebGL2RenderingContext) {
    const programs = this.setupPrograms(gl);

    const { locations, vertexArrayObjects, transformFeedbacks } = this.setupState(gl, programs);

    this.setupTexture(gl);

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

    Utilities.WebGL.Canvas.resizeToDisplaySize(this.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.08, 0.08, 0.08, 1.0);

    const updateLoop = (deltaTime: number) => {
      gl.useProgram(programs.update);
      gl.bindVertexArray(current.updateVAO);
      gl.uniform1f(locations.update.uDeltaTime, deltaTime);

      gl.enable(gl.RASTERIZER_DISCARD);
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, current.TF);
      gl.beginTransformFeedback(gl.POINTS);
      gl.drawArrays(gl.POINTS, 0, this.particlesCount);
      gl.endTransformFeedback();
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
      gl.disable(gl.RASTERIZER_DISCARD);
    };

    const renderLoop = () => {
      gl.useProgram(programs.render);
      gl.bindVertexArray(current.renderVAO);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, this.particlesCount);
    };

    let timeThen: number = 0;
    const mainLoop = (timeNow: number) => {
      timeNow *= 0.001;
      const deltaTime = timeNow - timeThen;
      timeThen = timeNow;

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
}
