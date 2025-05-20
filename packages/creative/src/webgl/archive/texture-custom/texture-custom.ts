import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

export class TextureCustom {
  constructor(private readonly canvas: HTMLCanvasElement) {}

  setup() {
    const gl = this.canvas.getContext("webgl2");
    if (!gl) throw new Error("Failed to get WebGL2 context");

    const vertexShader = Utilities.WebGL.Setup.compileShader(gl, "vertex", vertex);
    const fragmentShader = Utilities.WebGL.Setup.compileShader(gl, "fragment", fragment);
    const program = Utilities.WebGL.Setup.linkProgram(gl, vertexShader, fragmentShader);

    Utilities.WebGL.Canvas.resizeToDisplaySize(gl.canvas as HTMLCanvasElement);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.main(gl, program);
  }

  private main(gl: WebGL2RenderingContext, program: WebGLProgram) {
    const aPositionLocation = gl.getAttribLocation(program, "a_position");
    const aTextureCoordinatesLocation = gl.getAttribLocation(program, "a_textureCoordinates");
    const uResolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const uImageLocation = gl.getUniformLocation(program, "u_image");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // aPosition
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(Utilities.WebGL.Points.rectangle(0, 0, gl.canvas.width, gl.canvas.height)),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(aPositionLocation);
    gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

    // aTextureCoordinates
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Utilities.WebGL.Points.rectangle(0, 0, 1, 1)), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aTextureCoordinatesLocation);
    gl.vertexAttribPointer(aTextureCoordinatesLocation, 2, gl.FLOAT, false, 0, 0);

    // Custom texture.
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());

    // Fill texture with 3x2 pixels
    const level = 0;
    const internalFormat = gl.R8;
    const width = 3;
    const height = 2;
    const border = 0;
    const format = gl.RED;
    const type = gl.UNSIGNED_BYTE;
    const data = new Uint8Array([128, 64, 50, 0, 120, 30]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, data);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Draw.
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.uniform2f(uResolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform1i(uImageLocation, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
