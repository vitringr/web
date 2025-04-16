export function line(
  context: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  context.beginPath();
  context.lineTo(ax, ay);
  context.lineTo(bx, by);
  context.stroke();
}

export function circle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2);
  context.stroke();
}

export function fillCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2);
  context.fill();
}

const SIN_60 = 0.8660254037844386;
const hexCosines: number[] = [1, 0.5, -0.5, -1, -0.5, 0.5];
const hexSines: number[] = [0, SIN_60, SIN_60, 0, -SIN_60, -SIN_60];

export function fillHex(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius * hexCosines[0], y + radius * hexSines[0]);
  for (let i = 1; i < 6; i++) {
    context.lineTo(x + radius * hexCosines[i], y + radius * hexSines[i]);
  }
  context.fill();
}

export function hex(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius * hexCosines[0], y + radius * hexSines[0]);
  for (let i = 1; i < 6; i++) {
    context.lineTo(x + radius * hexCosines[i], y + radius * hexSines[i]);
  }
  context.lineTo(x + radius * hexCosines[0], y + radius * hexSines[0]);
  context.stroke();
}
