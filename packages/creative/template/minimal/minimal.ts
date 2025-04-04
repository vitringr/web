import { Utilities } from "../../../utilities";

import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

export class Minimal {
  private initialized = false;

  constructor(private readonly canvas: HTMLCanvasElement) {}

  setup() {
    if (this.initialized) throw new Error("Already initialized");
    this.initialized = true;

    const gl = this.canvas.getContext("webgl2");
    if (!gl) throw new Error("Failed to get WebGL2 context");

    const vertexShader = Utilities.WebGL.Setup.compileShader(gl, "vertex", vertex);
    const fragmentShader = Utilities.WebGL.Setup.compileShader(gl, "fragment", fragment);

    const program = Utilities.WebGL.Setup.linkProgram(gl, vertexShader, fragmentShader);

    Utilities.WebGL.Canvas.resizeToDisplaySize(this.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    this.main(gl, program);
  }

  private main(gl: WebGL2RenderingContext, program: WebGLProgram) {
    const locations = {
      aCanvasVertices: gl.getAttribLocation(program, "a_canvasVertices"),
    };

    const vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const canvasVertices = Utilities.WebGL.Points.rectangle(0, 0, 1, 1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(canvasVertices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(locations.aCanvasVertices);
    gl.vertexAttribPointer(locations.aCanvasVertices, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);
    gl.bindVertexArray(vertexArray);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
