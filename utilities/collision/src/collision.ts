export function point_point(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): boolean {
  return x1 == x2 && y1 == y2;
}

export function point_circle(
  px: number,
  py: number,
  cx: number,
  cy: number,
  cr: number,
): boolean {
  const xDistance = px - cx;
  const yDistance = py - cy;

  return xDistance * xDistance + yDistance * yDistance <= cr * cr;
}

export function circle_circle(
  c1x: number,
  c1y: number,
  c1r: number,
  c2x: number,
  c2y: number,
  c2r: number,
): boolean {
  const xDistance = c1x - c2x;
  const yDistance = c1y - c2y;
  const distanceSquared = xDistance * xDistance + yDistance * yDistance;

  const totalRadius = c1r + c2r;

  return distanceSquared <= totalRadius * totalRadius;
}

export function point_rectangle(
  px: number,
  py: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): boolean {
  //prettier-ignore
  return (
    px >= rx &&      // Right of the left edge
    px <= rx + rw && // Left of the right edge
    py >= ry &&      // Below the top
    py <= ry + rh    // Above the bottom
  );
}

export function rectangle_rectangle(
  r1x: number,
  r1y: number,
  r1w: number,
  r1h: number,
  r2x: number,
  r2y: number,
  r2w: number,
  r2h: number,
): boolean {
  //prettier-ignore
  return (
    r1x + r1w >= r2x && // Is the RIGHT edge of r1 to the RIGHT of the LEFT edge of r2?
    r1x <= r2x + r2w && // Is the LEFT edge of r1 to the LEFT of the RIGHT edge of r2?
    r1y + r1h >= r2y && // Is the BOTTOM edge of r1 BELOW the TOP edge of r2?
    r1y <= r2y + r2h    // Is the TOP edge of r1 ABOVE the BOTTOM edge of r2?
  );
}
