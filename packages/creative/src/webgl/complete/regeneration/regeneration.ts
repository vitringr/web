import { WebGL } from "@utilities/webgl";

import updateVertex from "./update-vertex.glsl";
import updateFragment from "./update-fragment.glsl";
import renderVertex from "./render-vertex.glsl";
import renderFragment from "./render-fragment.glsl";

export class Regeneration {
  private readonly xCount = 300;
  private readonly yCount = 300;
  private readonly offset = 0.02;

  private readonly originPullScalar = 0.2;
  private readonly toggleOriginPullScalar = 2.0;
  private readonly repelScalar = 0.2;
  private readonly repelNearestScalar = 5;
  private readonly maxRepelDistance = 0.04;
  private readonly minPointSize = 0.8;
  private readonly pointSizeByOriginDistance = 24;

  private initialized = false;
  private xPointer = 100;
  private yPointer = 100;
  private isPointerDown = false;
  private readonly particleCount = this.xCount * this.yCount;

  constructor(private readonly canvas: HTMLCanvasElement) { }

  init() {
    if (this.initialized) throw "Already initialized";
    this.initialized = true;

    const gl = this.canvas.getContext("webgl2");
    if (!gl) throw new Error("Failed to get WebGL2 context");

    this.setupPointer();

    this.main(gl);
  }

  private setupPointer() {
    const canvasBounds = this.canvas.getBoundingClientRect();
    this.canvas.addEventListener("pointermove", (ev: PointerEvent) => {
      this.xPointer = ev.clientX - canvasBounds.left;
      this.yPointer = ev.clientY - canvasBounds.top;

      this.xPointer = this.xPointer / this.canvas.width;
      this.yPointer = (this.canvas.height - this.yPointer) / this.canvas.height;
    });
    window.addEventListener("pointerdown", () => {
      this.isPointerDown = true;
    });

    window.addEventListener("pointerup", () => {
      this.isPointerDown = false;
    });

    window.addEventListener("blur", () => {
      this.isPointerDown = false;
    });
  }

  private setupPrograms(gl: WebGL2RenderingContext) {
    const updateVS = WebGL.Setup.compileShader(gl, "vertex", updateVertex);
    const updateFS = WebGL.Setup.compileShader(gl, "fragment", updateFragment);
    const renderVS = WebGL.Setup.compileShader(gl, "vertex", renderVertex);
    const renderFS = WebGL.Setup.compileShader(gl, "fragment", renderFragment);

    return {
      update: WebGL.Setup.linkTransformFeedbackProgram(
        gl,
        updateVS,
        updateFS,
        ["tf_newPosition", "tf_distanceFromOrigin"],
        "separate",
      ),
      render: WebGL.Setup.linkProgram(gl, renderVS, renderFS),
    };
  }

  private generatePositions() {
    const positions: number[] = [];

    for (let x = 0; x < this.xCount; x++) {
      for (let y = 0; y < this.yCount; y++) {
        const xPosition = this.offset + ((1 - this.offset * 2) / this.xCount) * x;
        const yPosition = this.offset + ((1 - this.offset * 2) / this.yCount) * y;
        positions.push(xPosition);
        positions.push(yPosition);
      }
    }

    return positions;
  }

  private setupUniformBlock(gl: WebGL2RenderingContext, programs: { update: WebGLProgram; render: WebGLProgram }) {
    const blockIndexInUpdate = gl.getUniformBlockIndex(programs.update, "GlobalStaticData");
    const blockIndexInRender = gl.getUniformBlockIndex(programs.render, "GlobalStaticData");

    gl.uniformBlockBinding(programs.update, blockIndexInUpdate, 0);
    gl.uniformBlockBinding(programs.render, blockIndexInRender, 0);

    const data = [
      this.originPullScalar,
      this.toggleOriginPullScalar,
      this.repelScalar,
      this.repelNearestScalar,
      this.maxRepelDistance,
      this.minPointSize,
      this.pointSizeByOriginDistance,
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
        aOriginalPosition: gl.getAttribLocation(programs.update, "a_originalPosition"),
        aVelocity: gl.getAttribLocation(programs.update, "a_velocity"),
        uPointerPosition: gl.getUniformLocation(programs.update, "u_pointerPosition"),
        uPointerDown: gl.getUniformLocation(programs.update, "u_pointerDown"),
        uDeltaTime: gl.getUniformLocation(programs.update, "u_deltaTime"),
      },
      render: {
        aNewPosition: gl.getAttribLocation(programs.render, "a_newPosition"),
        aDistanceFromOrigin: gl.getAttribLocation(programs.render, "a_distanceFromOrigin"),
        uTextureIndex: gl.getUniformLocation(programs.render, "u_textureIndex"),
      },
    };

    this.setupUniformBlock(gl, programs);

    const data = {
      positions: new Float32Array(this.generatePositions()),
    };

    const buffers = {
      firstPosition: gl.createBuffer()!,
      nextPosition: gl.createBuffer()!,
      originalPosition: gl.createBuffer()!,
      firstDistanceFromOrigin: gl.createBuffer()!,
      nextDistanceFromOrigin: gl.createBuffer()!,
    };

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstPosition);
    gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextPosition);
    gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.originalPosition);
    gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstDistanceFromOrigin);
    gl.bufferData(gl.ARRAY_BUFFER, this.particleCount * Float32Array.BYTES_PER_ELEMENT, gl.STREAM_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextDistanceFromOrigin);
    gl.bufferData(gl.ARRAY_BUFFER, this.particleCount * Float32Array.BYTES_PER_ELEMENT, gl.STREAM_DRAW);

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

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstDistanceFromOrigin);
    gl.enableVertexAttribArray(locations.render.aDistanceFromOrigin);
    gl.vertexAttribPointer(locations.render.aDistanceFromOrigin, 1, gl.FLOAT, false, 0, 0);

    // render VAO next data
    gl.bindVertexArray(vertexArrayObjects.renderNext);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextPosition);
    gl.enableVertexAttribArray(locations.render.aNewPosition);
    gl.vertexAttribPointer(locations.render.aNewPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextDistanceFromOrigin);
    gl.enableVertexAttribArray(locations.render.aDistanceFromOrigin);
    gl.vertexAttribPointer(locations.render.aDistanceFromOrigin, 1, gl.FLOAT, false, 0, 0);

    const transformFeedbacks = {
      first: gl.createTransformFeedback(),
      next: gl.createTransformFeedback(),
    };

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.first);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.firstPosition);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, buffers.firstDistanceFromOrigin);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.next);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.nextPosition);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, buffers.nextDistanceFromOrigin);

    // --- Unbind leftovers ---

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

    return { locations, vertexArrayObjects, transformFeedbacks };
  }

  private main(gl: WebGL2RenderingContext) {
    const programs = this.setupPrograms(gl);

    const { locations, vertexArrayObjects, transformFeedbacks } = this.setupState(gl, programs);

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

    WebGL.Canvas.resizeToDisplaySize(this.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.08, 0.08, 0.08, 1.0);

    const updateLoop = (deltaTime: number) => {
      gl.useProgram(programs.update);
      gl.bindVertexArray(current.updateVAO);
      gl.uniform1f(locations.update.uDeltaTime, deltaTime);
      gl.uniform1i(locations.update.uPointerDown, this.isPointerDown ? 1 : 0);
      gl.uniform2f(locations.update.uPointerPosition, this.xPointer, this.yPointer);

      gl.enable(gl.RASTERIZER_DISCARD);
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, current.TF);
      gl.beginTransformFeedback(gl.POINTS);
      gl.drawArrays(gl.POINTS, 0, this.particleCount);
      gl.endTransformFeedback();
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
      gl.disable(gl.RASTERIZER_DISCARD);
    };

    const renderLoop = () => {
      gl.useProgram(programs.render);
      gl.bindVertexArray(current.renderVAO);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, this.particleCount);
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
}
