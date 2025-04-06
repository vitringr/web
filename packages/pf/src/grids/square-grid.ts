import config from "../config";
import { ICell, Neighbor } from "../interfaces/cell.interface";
import { Mathematics } from "../libs/utils/mathematics";
import { Grid } from "./grid";

const diagonals: boolean = config.map.squareDiagonals;

export class SquareGrid extends Grid {
  private readonly cellWidth: number = config.canvas.width / this._cols;
  private readonly cellHeight: number = config.canvas.height / this._rows;

  getCellAt(xCoordinate: number, yCoordinate: number): ICell | null {
    const x = Math.floor(xCoordinate / this.cellWidth);
    const y = Math.floor(yCoordinate / this.cellHeight);
    return this._getCell(x, y);
  }

  setupNeighbors() {
    for (let x = 0; x < this._cols; x++) {
      for (let y = 0; y < this._rows; y++) {
        const cell = this._cells[x][y];

        const neighbors: Neighbor[] = [];

        const north = this._getCell(x, y - 1);
        const east = this._getCell(x + 1, y);
        const south = this._getCell(x, y + 1);
        const west = this._getCell(x - 1, y);

        neighbors.push(
          this._createNeighbor(north, 1),
          this._createNeighbor(east, 1),
          this._createNeighbor(south, 1),
          this._createNeighbor(west, 1),
        );

        if (diagonals) {
          const northEast = this._getCell(x + 1, y - 1);
          const southEast = this._getCell(x + 1, y + 1);
          const southWest = this._getCell(x - 1, y + 1);
          const northWest = this._getCell(x - 1, y + 1);

          neighbors.push(
            this._createNeighbor(northEast, Mathematics.SQRT_2),
            this._createNeighbor(southEast, Mathematics.SQRT_2),
            this._createNeighbor(southWest, Mathematics.SQRT_2),
            this._createNeighbor(northWest, Mathematics.SQRT_2),
          );
        }

        cell.setNeighbors(neighbors);
      }
    }
  }
}
