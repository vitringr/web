import { ICell } from "./cell.interface";

export interface IDisplay {
  clear(): void;
  drawCells(cells: ICell[] | ICell[][]): void;
}
