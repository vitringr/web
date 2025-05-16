import { Cell } from "./cell";

export namespace Algorithm {
  const open = new Set<Cell>();
  const closed = new Set<Cell>();

  export let hasEnded: boolean = false;

  let start: Cell;
  let target: Cell;

  export function initiate(startCell: Cell, targetCell: Cell) {
    open.clear();
    closed.clear();

    hasEnded = false;

    start = startCell;
    target = targetCell;

    open.add(start);
    start.list = Cell.List.Open;
  }

  function getBestFromOpen() {
    let best: Cell | null = null;
    for (const cell of open) {
      if (!best || cell.totalCost < best.totalCost) best = cell;
    }
    return best;
  }

  export function iterate() {
    if (hasEnded) return;

    if (open.size <= 0) {
      hasEnded = true;
      return;
    }

    let current = getBestFromOpen()!;

    if (current.isEqual(target)) {
      hasEnded = true;
      open.clear();
      return;
    }

    open.delete(current);
    closed.add(current);
    current.list = Cell.List.Closed;
    current.setToRender();

    for (const n of current.neighbors) {
      if (!n) continue;

      const neighbor = n.cell;
      const moveCost = n.moveCost;

      // TODO: neighbor null check?
      if (neighbor.type === Cell.Type.Block || neighbor.list === Cell.List.Closed) continue;

      const gSum = current.moveCost + moveCost;

      if (neighbor.list !== Cell.List.Open) {
        neighbor.list = Cell.List.Open;
        neighbor.setToRender();
        open.add(neighbor);
        neighbor.moveCost = gSum;
        neighbor.sumTotalCost();
      } else if (gSum <= neighbor.moveCost) {
        neighbor.moveCost = gSum;
        neighbor.sumTotalCost();
      }
    }
  }
}
