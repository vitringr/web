/**
 *
 * Checks if two points are at the same position.
 * @param x1 First point's x coordinate
 * @param y1 First point's y coordinate
 * @param x2 Second point's x coordinate
 * @param y2 Second point's y coordinate
 * @returns True if points are identical
 */
export function point_point(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): boolean {
  return x1 == x2 && y1 == y2;
}

/**
 *
 * Checks if a point is inside or on the boundary of a circle.
 * @param px Point's x coordinate
 * @param py Point's y coordinate
 * @param cx Circle's center x coordinate
 * @param cy Circle's center y coordinate
 * @param cr Circle's radius
 * @returns True if point is inside or on the circle
 */
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

/**
 *
 * Checks if two circles intersect or touch.
 * @param c1x First circle's center x coordinate
 * @param c1y First circle's center y coordinate
 * @param c1r First circle's radius
 * @param c2x Second circle's center x coordinate
 * @param c2y Second circle's center y coordinate
 * @param c2r Second circle's radius
 * @returns True if circles intersect or touch
 */
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

/**
 *
 * Checks if a point is inside or on the boundary of a rectangle.
 * @param px Point's x coordinate
 * @param py Point's y coordinate
 * @param rx Rectangle's top-left x coordinate
 * @param ry Rectangle's top-left y coordinate
 * @param rw Rectangle's width
 * @param rh Rectangle's height
 * @returns True if point is inside or on the rectangle
 */
export function point_rectangle(
  px: number,
  py: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): boolean {
  return (
    px >= rx &&      // Right of the left edge
    px <= rx + rw && // Left of the right edge
    py >= ry &&      // Below the top
    py <= ry + rh    // Above the bottom
  );
}

/**
 *
 * Checks if two rectangles intersect or touch.
 * @param r1x First rectangle's top-left x coordinate
 * @param r1y First rectangle's top-left y coordinate
 * @param r1w First rectangle's width
 * @param r1h First rectangle's height
 * @param r2x Second rectangle's top-left x coordinate
 * @param r2y Second rectangle's top-left y coordinate
 * @param r2w Second rectangle's width
 * @param r2h Second rectangle's height
 * @returns True if rectangles intersect or touch
 */
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
  return (
    r1x + r1w >= r2x && // Is the RIGHT edge of r1 to the RIGHT of the LEFT edge of r2?
    r1x <= r2x + r2w && // Is the LEFT edge of r1 to the LEFT of the RIGHT edge of r2?
    r1y + r1h >= r2y && // Is the BOTTOM edge of r1 BELOW the TOP edge of r2?
    r1y <= r2y + r2h    // Is the TOP edge of r1 ABOVE the BOTTOM edge of r2?
  );
}
