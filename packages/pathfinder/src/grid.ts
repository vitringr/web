import { Mathematics } from "@utilities/mathematics";
import Config from "./config";
import { Cell } from "./cell";

export namespace Grid {
  const cells: Cell[][] = [];

  export function createCells() {
    for (let x = 0; x < Config.cols; x++) {
      cells.push([]);
      for (let y = 0; y < Config.rows; y++) {
        cells[x].push(new Cell(x, y));
      }
    }
  }

  function isValidCoordinate(x: number, y: number) {
    return x >= 0 && x < Config.cols && y >= 0 && y < Config.rows;
  }

  function getCell(x: number, y: number) {
    return isValidCoordinate(x, y) ? cells[x][y] : null;
  }

  function setNeighbors() {
    //prettier-ignore
    for (let x = 0; x < Config.cols; x++) {
      for (let y = 0; y < Config.rows; y++) {
        const cell = cells[x][y];
        const neighbors: Cell.Neighbor[] = [];

        const north = getCell(x, y - 1);
        const east = getCell(x + 1, y);
        const south = getCell(x, y + 1);
        const west = getCell(x - 1, y);

        neighbors.push(
          north ? { cell: north, moveCost: 1 } : null,
          east ? { cell: east, moveCost: 1 } : null,
          south ? { cell: south, moveCost: 1 } : null,
          west ? { cell: west, moveCost: 1 } : null,
        );

        if (Config.diagonals) {
          const northEast = getCell(x + 1, y - 1);
          const southEast = getCell(x + 1, y + 1);
          const southWest = getCell(x - 1, y + 1);
          const northWest = getCell(x - 1, y + 1);

          neighbors.push(
            northEast ? { cell: northEast, moveCost: Mathematics.SQRT_2 } : null,
            southEast ? { cell: southEast, moveCost: Mathematics.SQRT_2 } : null,
            southWest ? { cell: southWest, moveCost: Mathematics.SQRT_2 } : null,
            northWest ? { cell: northWest, moveCost: Mathematics.SQRT_2 } : null,
          );
        }

        cell.neighbors.push(...neighbors);
      }
    }
  }
}
