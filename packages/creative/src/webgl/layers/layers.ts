import { WebGL } from "@utilities/webgl";

import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

import img0 from "./layer0.png";
import img1 from "./layer1.png";
import img2 from "./layer2.png";
import img3 from "./layer3.png";

const defaultConfig = {
  canvasWidth: 600,
  canvasHeight: 600,
};

type Config = typeof defaultConfig;

let config: Config;

const images: HTMLImageElement[] = [];
let pointerX: number = 0;
let pointerY: number = 0;

function setupPointer(onMove: () => void, canvas: HTMLCanvasElement) {
  canvas.addEventListener("mousemove", (ev: MouseEvent) => {
    const canvasBounds = canvas.getBoundingClientRect();
    pointerX = ev.clientX - canvasBounds.left;
    pointerY = ev.clientY - canvasBounds.top;
    onMove();
  });
}

function loadImage(source: string, onLoad: () => void) {
  const image = new Image();
  image.src = source;
  image.onload = onLoad;
  return image;
}

function loadImages(sources: string[], target: HTMLImageElement[], onAllLoaded: () => void) {
  let toLoadCount = sources.length;

  const onImageLoaded = () => {
    toLoadCount--;
    if (toLoadCount <= 0) onAllLoaded();
  };

  for (let i = 0; i < sources.length; i++) {
    const image = loadImage(sources[i], onImageLoaded);
    target.push(image);
  }
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  const vertexShader = WebGL.Setup.compileShader(gl, "vertex", vertex);
  const fragmentShader = WebGL.Setup.compileShader(gl, "fragment", fragment);
  const program = WebGL.Setup.linkProgram(gl, vertexShader, fragmentShader);

  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;
  WebGL.Canvas.resizeToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const sources = [img0, img1, img2, img3];

  loadImages(sources, images, () => {
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
      new Float32Array(WebGL.Points.rectangle(0, 0, gl.canvas.width, gl.canvas.height)),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(aPositionLocation);
    gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

    // aTextureCoordinates
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(WebGL.Points.rectangle(0, 0, 1, 1)), gl.STATIC_DRAW);
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

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
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
        gl.uniform2f(uPointerLocation, pointerX, canvas.height - pointerY);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      });
    };

    render();

    setupPointer(render, canvas);
  });
}
