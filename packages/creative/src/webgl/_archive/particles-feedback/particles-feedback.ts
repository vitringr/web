import { Random } from "@utilities/random";
import { WebGL } from "@utilities/webgl";

import updateVertex from "./update-vertex.glsl";
import updateFragment from "./update-fragment.glsl";
import renderVertex from "./render-vertex.glsl";
import renderFragment from "./render-fragment.glsl";

export class ParticlesFeedback {
  private readonly particlesCount = 1000;

  private initialized = false;
  private image = new Image();

  constructor(private readonly canvas: HTMLCanvasElement) {}

  setup() {
    if (this.initialized) throw "Already initialized";
    this.initialized = true;

    const gl = this.canvas.getContext("webgl2");
    if (!gl) throw new Error("Failed to get WebGL2 context");

    this.image.src = "assets/tenthousand.png";
    this.image.onload = () => this.main(gl);
  }

  private createPrograms(gl: WebGL2RenderingContext) {
    const updateVS = WebGL.Setup.compileShader(gl, "vertex", updateVertex);
    const updateFS = WebGL.Setup.compileShader(gl, "fragment", updateFragment);
    const renderVS = WebGL.Setup.compileShader(gl, "vertex", renderVertex);
    const renderFS = WebGL.Setup.compileShader(gl, "fragment", renderFragment);

    return {
      update: WebGL.Setup.linkTransformFeedbackProgram(gl, updateVS, updateFS, ["newPosition"], "separate"),
      render: WebGL.Setup.linkProgram(gl, renderVS, renderFS),
    };
  }

  private generatePositionData() {
    const positions: number[] = [];
    for (let i = 0; i < this.particlesCount; i++) {
      positions.push(Random.range(0, 1));
      positions.push(Random.range(0, 1));
    }
    return positions;
  }

  private generateVelocityData() {
    const velocities: number[] = [];
    for (let i = 0; i < this.particlesCount; i++) {
      const angle = Random.rangeInt(0, 360);

      const sin = Math.sin(angle);
      const cos = Math.cos(angle);

      velocities.push(cos);
      velocities.push(sin);
    }
    return velocities;
  }

  private createState(gl: WebGL2RenderingContext, programs: { update: WebGLProgram; render: WebGLProgram }) {
    const locations = {
      update: {
        aOldPosition: gl.getAttribLocation(programs.update, "a_oldPosition"),
        aVelocity: gl.getAttribLocation(programs.update, "a_velocity"),
        uDeltaTime: gl.getUniformLocation(programs.update, "u_deltaTime"),
      },
      render: {
        aNewPosition: gl.getAttribLocation(programs.render, "a_newPosition"),
      },
    };

    const data = {
      positions: new Float32Array(this.generatePositionData()),
      velocities: new Float32Array(this.generateVelocityData()),
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
    gl.vertexAttribPointer(locations.update.aOldPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
    gl.enableVertexAttribArray(locations.update.aVelocity);
    gl.vertexAttribPointer(locations.update.aVelocity, 2, gl.FLOAT, false, 0, 0);

    // update VAO next data
    gl.bindVertexArray(vertexArrayObjects.updateNext);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextPosition);
    gl.enableVertexAttribArray(locations.update.aOldPosition);
    gl.vertexAttribPointer(locations.update.aOldPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
    gl.enableVertexAttribArray(locations.update.aVelocity);
    gl.vertexAttribPointer(locations.update.aVelocity, 2, gl.FLOAT, false, 0, 0);

    // render VAO first data
    gl.bindVertexArray(vertexArrayObjects.renderFirst);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.firstPosition);
    gl.enableVertexAttribArray(locations.render.aNewPosition);
    gl.vertexAttribPointer(locations.render.aNewPosition, 2, gl.FLOAT, false, 0, 0);

    // render VAO next data
    gl.bindVertexArray(vertexArrayObjects.renderNext);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nextPosition);
    gl.enableVertexAttribArray(locations.render.aNewPosition);
    gl.vertexAttribPointer(locations.render.aNewPosition, 2, gl.FLOAT, false, 0, 0);

    const transformFeedbacks = {
      firstPosition: gl.createTransformFeedback(),
      nextPosition: gl.createTransformFeedback(),
    };

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.firstPosition);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.firstPosition);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.nextPosition);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.nextPosition);

    // --- Unbind leftovers ---

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

    return { locations, vertexArrayObjects, transformFeedbacks };
  }

  private main(gl: WebGL2RenderingContext) {
    const programs = this.createPrograms(gl);

    const { locations, vertexArrayObjects, transformFeedbacks } = this.createState(gl, programs);

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

    WebGL.Canvas.resizeToDisplaySize(this.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

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
      gl.drawArrays(gl.POINTS, 0, this.particlesCount);
    };

    let timeThen: number = 0;
    const mainLoop = (timeNow: number) => {
      timeNow *= 0.001;
      const deltaTime = timeNow - timeThen;
      timeThen = timeNow;

      updateLoop(deltaTime);
      renderLoop();

      const temp = current;
      current = swap;
      swap = temp;

      requestAnimationFrame(mainLoop);
    };

    requestAnimationFrame(mainLoop);
  }
}
