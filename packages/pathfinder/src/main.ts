import { Algorithm } from "./algorithm";
import { Renderer } from "./render";
import { Terrain } from "./terrain";
import { Config } from "./config";
import { Grid } from "./grid";
import { Canvas2D } from "@utilities/canvas2d";
import { Mathematics } from "@utilities/mathematics";

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

export async function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);

  Canvas2D.fillHex(context, 70, 80, 60);

  // const renderer = new Renderer(context);
  //
  // const cells = Grid.createCells();
  // const start = cells[0][0];
  // const target = cells[Config.rows - 1][Config.cols - 1];
  // Grid.setNeighbors();
  // Grid.precalculateDistances(target);
  //
  // Terrain.randomBlocks(cells);
  // Terrain.randomRough(cells);
  // Terrain.unblockAroundCell(start, cells, 3);
  // Terrain.unblockAroundCell(target, cells, 3);
  //
  // Algorithm.initiate(start, target);
  //
  // if (Config.runtime === Config.Runtime.INSTANT) {
  //   while (!Algorithm.hasEnded) {
  //     Algorithm.iterate();
  //     renderer.drawCells(cells);
  //   }
  // } else if (Config.runtime === Config.Runtime.ANIMATED) {
  //   const loop = () => {
  //     Algorithm.iterate();
  //     renderer.drawCells(cells);
  //     Canvas2D.fillHex(context, 135, 384, 100);
  //     requestAnimationFrame(loop);
  //   };
  //   loop();
  // }
}
