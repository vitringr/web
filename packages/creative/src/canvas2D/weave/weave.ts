/*

Draw image.

Get image data.

Rasterize image into a pixel lattice.

Setup pins.

Save pixel lines from each pin to its possible others.

Save the pixel lines with their average black color.

*/

import { Config, defaultConfig } from "./config";

let config: Config

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const context = setupContext(canvas);
}
