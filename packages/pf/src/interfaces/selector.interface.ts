import { ICell } from "./cell.interface";

export interface ISelector {
  getCellAt(xCoordinate: number, yCoordinate: number): ICell | null;
}
