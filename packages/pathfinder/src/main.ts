import { Algorithm } from "./algorithm";
import { Config } from "./config";
import { Grid } from "./grid";
import { Renderer } from "./render";
import { Terrain } from "./terrain";

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = Config.width;
  canvas.height = Config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

export async function main(canvas: HTMLCanvasElement) {
  const context = setupContext(canvas);
  const renderer = new Renderer(context);

  const cells = Grid.createCells();
  const start = cells[0][0];
  const target = cells[Config.rows - 1][Config.cols - 1];
  Grid.setNeighbors();
  Grid.precalculateDistances(target);

  Terrain.randomBlocks(cells);
  Terrain.randomRough(cells);
  Terrain.unblockAroundCell(start, cells, 3);
  Terrain.unblockAroundCell(target, cells, 3);

  Algorithm.initiate(start, target);

  while (!Algorithm.hasEnded) {
    Algorithm.iterate();
    renderer.drawCells(cells);
  }

  // const loop = setInterval(() => {
  //   Algorithm.iterate();
  //   renderer.drawCells(cells);
  //
  //   Algorithm.hasEnded && clearInterval(loop);
  // }, 1000 / 30);
}
