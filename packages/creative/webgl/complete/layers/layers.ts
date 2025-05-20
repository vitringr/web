import { Utilities } from "../../../utilities";

import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

export class Layers {
  private readonly images: HTMLImageElement[] = [];
  private pointerX: number = 0;
  private pointerY: number = 0;

  constructor(private readonly canvas: HTMLCanvasElement) {}

  init() {
    const gl = this.canvas.getContext("webgl2");
    if (!gl) throw new Error("Failed to get WebGL2 context");

    const vertexShader = Utilities.WebGL.Setup.compileShader(gl, "vertex", vertex);
    const fragmentShader = Utilities.WebGL.Setup.compileShader(gl, "fragment", fragment);
    const program = Utilities.WebGL.Setup.linkProgram(gl, vertexShader, fragmentShader);

    Utilities.WebGL.Canvas.resizeToDisplaySize(gl.canvas as HTMLCanvasElement);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const sources = ["assets/layers/0.png", "assets/layers/1.png", "assets/layers/2.png", "assets/layers/3.png"];
    this.loadImages(sources, this.images, () => this.main(gl, program));
  }

  private setupPointer(onMove: () => void) {
    const canvasBounds = this.canvas.getBoundingClientRect();
    this.canvas.addEventListener("mousemove", (ev: MouseEvent) => {
      this.pointerX = ev.clientX - canvasBounds.left;
      this.pointerY = ev.clientY - canvasBounds.top;
      onMove();
    });
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
    const uPointerLocation = gl.getUniformLocation(program, "u_pointer");
    const uImage0Location = gl.getUniformLocation(program, "u_image0");
    const uImage1Location = gl.getUniformLocation(program, "u_image1");
    const uImage2Location = gl.getUniformLocation(program, "u_image2");
    const uImage3Location = gl.getUniformLocation(program, "u_image3");

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
    for (let i = 0; i < 4; i++) {
      gl.activeTexture(gl.TEXTURE0 + i);

      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[i]);
    }

    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.uniform1i(uImage0Location, 0);
    gl.uniform1i(uImage1Location, 1);
    gl.uniform1i(uImage2Location, 2);
    gl.uniform1i(uImage3Location, 3);

    const render = () => {
      requestAnimationFrame(() => {
        gl.uniform2f(uResolutionLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(uPointerLocation, this.pointerX, this.canvas.height - this.pointerY);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      });
    };

    render();

    this.setupPointer(render);
  }
}
