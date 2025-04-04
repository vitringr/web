import { ICell } from "./interfaces/cell.interface";
import { Mathematics } from "./libs/utils/mathematics";

export class Utils {
  static euclideanDistance(from: ICell, to: ICell) {
    const xDifference = from.x - to.x;
    const yDifference = from.y - to.y;
    return Math.sqrt(xDifference * xDifference + yDifference * yDifference);
  }

  static manhattanDistance(from: ICell, to: ICell) {
    return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
  }

  static calculateRowsCount(width: number, height: number, columns: number, hex: boolean = false) {
    const ratio = height / width;
    if (hex) return Math.floor(columns * ratio * (1 / Mathematics.COS_30));
    return Math.floor(columns * ratio);
  }
}
