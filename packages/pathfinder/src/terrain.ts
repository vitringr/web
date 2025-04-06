import { Random } from "@utilities/random";
import { Cell } from "./cell";
import Config from "./config";

export namespace Terrain {
  export function randomBlocks(cells: Cell[][]) {
    for (let x = 0; x < Config.cols; x++) {
      for (let y = 0; y < Config.rows; y++) {
        Random.chance(Config.terrain.blocks) &&
          (cells[x][y].type = Cell.Type.Block);
      }
    }
  }

  export function randomRough(cells: Cell[][]) {
    for (let x = 0; x < Config.cols; x++) {
      for (let y = 0; y < Config.rows; y++) {
        const cell = cells[x][y];
        if (cell.type === Cell.Type.Block) continue;

        if (Random.chance(Config.terrain.rough)) {
          cell.type = Cell.Type.Rough;
          cell.setT(1); // TODO: turn this into a gradient
          cell.markDisplay();
          cell.skipAnimation();
        }
      }
    }
  }

  // TODO
  export function noiseBlocks() {}
  export function noiseTerrain() {}
}
