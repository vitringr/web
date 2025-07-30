import { StringWeaveGenerator } from "@packages/string-weave-generator";
import { Config, defaultConfig } from "./config";

import imagePNG from "./images/edit.png";

async function start(canvas: HTMLCanvasElement, image: HTMLImageElement) {
}

export async function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  const config = { ...defaultConfig, ...settings };

  StringWeaveGenerator.main(canvas, imagePNG, config);

  // const context = setupContext(canvas);
  // const pins = createPins();
  // const imageData = createImageData(context, image);
  // const links = createLinks(pins, imageData);
  //
  // context.fillStyle = config.colors.background;
  // context.fillRect(0, 0, config.width, config.height);
  //
  // context.lineWidth = config.lineWidth;
  // context.strokeStyle = config.colors.lines;
  //
  // const visitedIndices: number[] = new Array(links.length).fill(0);
  //
  // let loop = 0;
  // let frame = 0;
  // let fromIndex = 42;
  // let iterations = 0;
  // const animation = () => {
  //   if (frame >= config.stopAfter) return;
  //
  //   loop++;
  //   iterations = Math.min(1 + Math.floor(loop / config.incrementIterationsAfter), config.maxIterations);
  //
  //   const iteration = () => {
  //     frame++;
  //
  //     const shuffle = visitedIndices[fromIndex] % config.resetVisitsAfter;
  //
  //     const toIndex = links[fromIndex][shuffle];
  //     // console.log("toIndex:", toIndex);
  //
  //     // TODO: Experiment without this, instead just use the modulo from above for all
  //     visitedIndices[fromIndex]++;
  //     visitedIndices[toIndex]++;
  //
  //     Canvas2D.line(
  //       context,
  //       pins[fromIndex].x * cellWidth,
  //       pins[fromIndex].y * cellHeight,
  //       pins[toIndex].x * cellWidth,
  //       pins[toIndex].y * cellHeight,
  //     );
  //
  //     fromIndex = toIndex;
  //   };
  //
  //   for (let i = 0; i < iterations; i++) {
  //     iteration();
  //   }
  //
  //   requestAnimationFrame(animation);
  // };
  //
  // requestAnimationFrame(animation);

}
