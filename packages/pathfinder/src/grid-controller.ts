//import { SquareCell } from "./cells/squareCell";
//import config from "./config";
//import { Grid } from "./grid";
//
//// cache
//const rows = config.map.rows;
//const cols = config.map.columns;
//const cellWidth = config.canvas.width / rows;
//const cellHeight = config.canvas.height / cols;
//const cellHalfWidth = cellWidth / 2;
//const cellHalfHeight = cellHeight / 2;
//
//let _bcrTop: number = 0;
//let _bcrLeft: number = 0;
//let _toBlock: boolean = true;
//
//export function setup(_bcr: DOMRect) {
//  _bcrLeft = _bcr.left;
//  _bcrTop = _bcr.top;
//}
//
//export function selectAt(grid: Grid, xCoordinate: number, yCoordinate: number): SquareCell | null {
//  const x = Math.round((xCoordinate - _bcrLeft - cellHalfWidth) / cellWidth);
//  const y = Math.round((yCoordinate - _bcrTop - cellHalfHeight) / cellHeight);
//
//  return grid.getCell(x, y);
//}
//
//export function setFlip(toBlock: boolean) {
//  _toBlock = toBlock;
//}
//
//export function flipCell(cell: SquareCell) {
//  if (_toBlock) {
//    if (!cell.isBlock()) {
//      cell.setBlock();
//    }
//  } else {
//    if (cell.isBlock()) {
//      cell.setEmpty();
//    }
//  }
//}
