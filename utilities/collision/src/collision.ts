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
