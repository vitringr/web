import { Utilities } from "../../../utilities";

import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

export class Texture {
  private image = new Image();
  private pointerX: number = 0;
  private pointerY: number = 0;
  private time: number = 0;

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

    const canvasBounds = this.canvas.getBoundingClientRect();
    this.canvas.addEventListener("mousemove", (ev: MouseEvent) => {
      this.pointerX = ev.clientX - canvasBounds.left;
      this.pointerY = ev.clientY - canvasBounds.top;
    });

    //this.image.src = "assets/lateralus.png";
    this.image.src = "assets/tenthousand.png";
    this.image.onload = () => this.main(gl, program);
  }

  private main(gl: WebGL2RenderingContext, program: WebGLProgram) {
    const aPositionLocation = gl.getAttribLocation(program, "a_position");
    const aTextureCoordinatesLocation = gl.getAttribLocation(program, "a_textureCoordinates");

    const uResolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const uPointerLocation = gl.getUniformLocation(program, "u_pointer");
    const uTimeLocation = gl.getUniformLocation(program, "u_time");
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

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);

    // Draw.
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.uniform2f(uResolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(uPointerLocation, this.pointerX, this.pointerY);
    gl.uniform1f(uTimeLocation, this.time);
    gl.uniform1i(uImageLocation, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
