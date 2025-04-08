import { Cell } from "./cell";

export namespace Algorithm {
  const open = new Set<Cell>();
  const closed = new Set<Cell>();

  let hasEnded: boolean = false;

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
      if (!best || cell.f < best.f) best = cell;
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

    for (const n of current.neighbors) {
      if (!n) continue;

      const neighbor = n.cell;
      const moveCost = n.moveCost;

      // neighbor null check?
      if (neighbor.type === Cell.Type.Block || neighbor.list === Cell.List.Closed) continue;

      const gSum = current.g + moveCost;

      // this is weird. Fix.
      if (neighbor.list !== Cell.List.Open) {
        neighbor.list = Cell.List.Open;
        open.add(neighbor);
        neighbor.g = gSum;
        neighbor.sumF();
      } else if (gSum <= neighbor.g) {
        neighbor.g = gSum;
        neighbor.sumF();
      }
    }

    return;
  }
}
