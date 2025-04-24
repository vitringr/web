import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Colors } from "@utilities/colors";
import { Config } from "../config";

const pixelWidth = Config.width / Config.pixelsPerRow;

export class Pixel {
  static createAll() {
    const pixels: Pixel[][] = [];

    for (let x = 0; x < Config.pixelsPerRow; x++) {
      pixels.push([]);
      for (let y = 0; y < Config.pixelsPerRow; y++) {
        pixels[x].push(new Pixel(x, y));
      }
    }

    return pixels;
  }

  static renderAll(context: CanvasRenderingContext2D, pixels: Pixel[][]) {
    for (const row of pixels) {
      for (const pixel of row) {
        pixel.render(context);
      }
    }
  }

  static renderPixelBorders(context: CanvasRenderingContext2D) {
    context.strokeStyle = Config.colors.pixelBorders;
    context.lineWidth = Config.pixelBordersWidth;

    for (let x = 0; x <= Config.pixelsPerRow; x++) {
      Canvas2D.line(context, 0, x * pixelWidth, Config.width, x * pixelWidth);
    }

    for (let y = 0; y <= Config.pixelsPerRow; y++) {
      Canvas2D.line(context, y * pixelWidth, 0, y * pixelWidth, Config.width);
    }
  }

  readonly position = Vector2.Create.zero();

  color: number = 0;

  constructor(
    readonly x: number,
    readonly y: number,
  ) {
    this.position.set(x * pixelWidth, y * pixelWidth);
  }

  render(context: CanvasRenderingContext2D) {
    context.fillStyle = Colors.getRGBGrayscale(this.color);
    context.fillRect(this.position.x, this.position.y, pixelWidth, pixelWidth);
  }
}
