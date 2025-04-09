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
          cell.toRender = true;
          cell.t = 1;
          // cell.skipAnimation();
        }
      }
    }
  }

  // TODO
  export function noiseBlocks() { }
  export function noiseTerrain() { }

  export function unblockAroundCell(cell: Cell, cells: Cell[][], radius: number) {
    if (radius < 1) throw "Radius less than 1";

    const xLeft = cell.x - radius;
    const xRight = cell.x + radius;
    const yTop = cell.y - radius;
    const yBottom = cell.y + radius;

    for (const row of cells) {
      for (const cell of row) {
        if(!cell) continue;
        if (cell.x >= xLeft && cell.x <= xRight && cell.y >= yTop && cell.y <= yBottom) {
          cell.type = Cell.Type.Empty;
          cell.toRender = true;
        }
      }
    }
  }
}
