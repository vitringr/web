import simulationVertex from "./simulation-vertex.glsl";
import simulationFragment from "./simulation-fragment.glsl";
import renderVertex from "./render-vertex.glsl";
import renderFragment from "./render-fragment.glsl";

export class ParticlesTexture {
  private readonly width = 20;
  private readonly height = 20;
  private initialized = false;

  constructor(private readonly canvas: HTMLCanvasElement) { }

  setup() {
    if (this.initialized) throw new Error("Already initialized");
    this.initialized = true;

    const gl = this.canvas.getContext("webgl2");
    if (!gl) throw new Error("Failed to get WebGL2 context");

    const simulationVS = Utilities.WebGL.Setup.compileShader(gl, "vertex", simulationVertex);
    const simulationFS = Utilities.WebGL.Setup.compileShader(gl, "fragment", simulationFragment);
    const renderVS = Utilities.WebGL.Setup.compileShader(gl, "vertex", renderVertex);
    const renderFS = Utilities.WebGL.Setup.compileShader(gl, "fragment", renderFragment);

    const simulationProgram = Utilities.WebGL.Setup.linkProgram(gl, simulationVS, simulationFS);
    const renderProgram = Utilities.WebGL.Setup.linkProgram(gl, renderVS, renderFS);

    Utilities.WebGL.Canvas.resizeToDisplaySize(this.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    this.main(gl, simulationProgram, renderProgram);
  }

  private createTextureData(count: number) {
    const textureData: number[] = [];

    for (let i = 0; i < count; i++) {
      const xPosition = Utilities.Random.rangeInt(0, 255);
      const yPosition = Utilities.Random.rangeInt(0, 255);
      const angle = Utilities.Random.rangeInt(0, 255);

      textureData.push(xPosition);
      textureData.push(yPosition);
      textureData.push(angle);
    }

    return textureData;
  }

  private disableTextureFiltering(gl: WebGL2RenderingContext) {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  private main(gl: WebGL2RenderingContext, simulationProgram: WebGLProgram, renderProgram: WebGLProgram) {
    const locations = {
      simulation: {
        aCanvasVertices: gl.getAttribLocation(simulationProgram, "a_canvasVertices"),
        uOldTextureIndex: gl.getUniformLocation(simulationProgram, "u_oldTextureIndex"),
        uDeltaTime: gl.getUniformLocation(simulationProgram, "u_deltaTime"),
      },
      render: {
        uNewTextureIndex: gl.getUniformLocation(renderProgram, "u_newTextureIndex"),
        uWidth: gl.getUniformLocation(renderProgram, "u_width"),
        uHeight: gl.getUniformLocation(renderProgram, "u_height"),
      },
    };

    // --- Attribute ---

    const canvasVertices = Utilities.WebGL.Points.rectangle(0, 0, 1, 1);

    const simulationVAO = gl.createVertexArray();
    gl.bindVertexArray(simulationVAO);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(canvasVertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(locations.simulation.aCanvasVertices);
    gl.vertexAttribPointer(locations.simulation.aCanvasVertices, 2, gl.FLOAT, false, 0, 0);

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

    const data = new Uint8Array(this.createTextureData(this.width * this.height));
    gl.texImage2D(target, level, internalFormat, this.width, this.height, border, format, type, data);

    this.disableTextureFiltering(gl);

    // Next

    let nextTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, nextTexture);

    const emptyData = new Uint8Array(data.map(() => 0));
    gl.texImage2D(target, level, internalFormat, this.width, this.height, border, format, type, emptyData);

    this.disableTextureFiltering(gl);

    const fb = gl.createFramebuffer();

    // --- Loop ---

    let timeThen: number = 0;
    const loop = (timeNow: number) => {
      timeNow *= 0.001;
      const deltaTime: number = timeNow - timeThen;
      timeThen = timeNow;

      // --- Simulation ---

      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.viewport(0, 0, this.width, this.height);

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, nextTexture, 0);

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
      gl.uniform1f(locations.render.uWidth, this.width);
      gl.uniform1f(locations.render.uHeight, this.height);

      gl.drawArrays(gl.POINTS, 0, this.width * this.height);

      // --- Swap ---

      let temp = firstTexture;
      firstTexture = nextTexture;
      nextTexture = temp;

      requestAnimationFrame(loop);
    };

    loop(0);
  }
}
