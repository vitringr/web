import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

export class TextureMultiple {
  private readonly images: HTMLImageElement[] = [];

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

    const sources = ["assets/tenthousand.png", "assets/lateralus.png"];
    this.loadImages(sources, this.images, () => this.main(gl, program));
  }

  private loadImage(source: string, onLoad: () => void) {
    const image = new Image();
    image.src = source;
    image.onload = onLoad;
    return image;
  }

  private loadImages(sources: string[], target: HTMLImageElement[], onAllLoaded: () => void) {
    let toLoadCount = sources.length;

    const onImageLoaded = () => {
      toLoadCount--;
      if (toLoadCount <= 0) onAllLoaded();
    };

    for (let i = 0; i < sources.length; i++) {
      const image = this.loadImage(sources[i], onImageLoaded);
      target.push(image);
    }
  }

  private main(gl: WebGL2RenderingContext, program: WebGLProgram) {
    const aPositionLocation = gl.getAttribLocation(program, "a_position");
    const aTextureCoordinatesLocation = gl.getAttribLocation(program, "a_textureCoordinates");

    const uResolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const uImage0Location = gl.getUniformLocation(program, "u_image0");
    const uImage1Location = gl.getUniformLocation(program, "u_image1");

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

    // Texture.

    for (let i = 0; i < 2; i++) {
      gl.activeTexture(gl.TEXTURE0 + i);

      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[i]);
    }

    // Draw.
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.uniform2f(uResolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform1i(uImage0Location, 0);
    gl.uniform1i(uImage1Location, 1);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
