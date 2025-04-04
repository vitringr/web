import "./styles/reset.css";
import "./styles/style.css";
import config from "./config";
import { IDisplay } from "./interfaces/display.interface";
import { SquareGrid } from "./grids/square-grid";
import { SquareDisplay } from "./displays/square-display";
//import { HexGrid } from "./grids/hex-grid";
import { HexDisplay } from "./displays/hex-display";
import { BidirectionalAStar } from "./algorithms/bidirectional-a-star";
import { Utils } from "./utils";
import { IPathfinder } from "./interfaces/pathfinder.interface";
import { AStar } from "./algorithms/a-star";
import { Input } from "./input";
import { Grid } from "./grids/grid";

// Grid:

const rows = Utils.calculateRowsCount(
  config.canvas.width,
  config.canvas.height,
  config.map.columns,
  config.map.grid === "hex",
);

let grid: Grid;
//if (config.map.grid === "hex") grid = new HexGrid(config.map.columns, rows);
//else
grid = new SquareGrid(config.map.columns, rows);

grid.createCells();
grid.generateBlocks(config.map.blocks.type);
grid.generateTerrain(config.map.terrain.type);
grid.setupNeighbors();

// Cells:

const cells = grid.getCells();
const startCell = cells[0][0];
const targetCell = cells[config.map.columns - 1][rows - 1];
grid.unblockCellRecursive(startCell, config.map.unblockSpawnLayers);
grid.unblockCellRecursive(targetCell, config.map.unblockSpawnLayers);

// Canvas:

const canvas = document.createElement("canvas");
canvas.width = config.canvas.width;
canvas.height = config.canvas.height;
document.body.appendChild(canvas);
const context = canvas.getContext("2d");

// Controls:

new Input(canvas);

// Display:

let display: IDisplay;
if (config.map.grid === "hex") display = new HexDisplay(context!);
else display = new SquareDisplay(context!);
display.clear();

// Pathfinder:

let aStar: IPathfinder;
if (config.pathfinding.bidirectional) {
  aStar = new BidirectionalAStar(startCell, targetCell);
} else {
  aStar = new AStar(startCell, targetCell);
  grid.precalculateAllDistancesTo(targetCell);
}

// Loop:

const displayInterval = 1000 / config.display.FPS;
setInterval(() => {
  display.drawCells(cells);

  if (Input.isClicked) {
    const cell = grid.getCellAt(Input.x, Input.y);
    if (cell) console.log(cell)
  }

  aStar.iterate();
}, displayInterval);
