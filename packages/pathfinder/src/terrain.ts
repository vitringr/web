import { Random } from "@utilities/random";
import { Cell } from "./cell";
import { Config } from "./config";

export namespace Terrain {
  export function randomBlocks(cells: Cell[][]) {
    for (const row of cells) {
      for (const cell of row) {
        if (Random.chance(Config.terrain.blocks)) {
          cell.type = Cell.Type.Block;
          cell.toRender = true;
        }
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
          // cell.setT(1); // TODO: turn this into a gradient
          // cell.markDisplay();
          // cell.skipAnimation();
        }
      }
    }
  }

  // TODO
  export function noiseBlocks() { }
  export function noiseTerrain() { }
}
