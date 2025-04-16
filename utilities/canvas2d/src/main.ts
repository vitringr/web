export function line(
  context: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  context.beginPath();
  context.moveTo(ax, ay);
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
const hexCosinesFlat: number[] = [1, 0.5, -0.5, -1, -0.5, 0.5];
const hexSinesFlat: number[] = [0, SIN_60, SIN_60, 0, -SIN_60, -SIN_60];
const hexCosinesPointy: number[] = [SIN_60, SIN_60, 0, -SIN_60, -SIN_60, 0];
const hexSinesPointy: number[] = [-0.5, 0.5, 1, 0.5, -0.5, -1];

export function fillHex(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  flat: boolean = false,
) {
  context.beginPath();

  if (flat) {
    context.moveTo(x + r * hexCosinesFlat[0], y + r * hexSinesFlat[0]);
    for (let i = 1; i < 6; i++) {
      context.lineTo(x + r * hexCosinesFlat[i], y + r * hexSinesFlat[i]);
    }
  } else {
    context.moveTo(x + r * hexCosinesPointy[0], y + r * hexSinesPointy[0]);
    for (let i = 1; i < 6; i++) {
      context.lineTo(x + r * hexCosinesPointy[i], y + r * hexSinesPointy[i]);
    }
  }

  context.fill();
}

export function hex(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  flat: boolean = false,
) {
  context.beginPath();

  if (flat) {
    context.moveTo(x + r * hexCosinesFlat[0], y + r * hexSinesFlat[0]);
    for (let i = 1; i < 6; i++) {
      context.lineTo(x + r * hexCosinesFlat[i], y + r * hexSinesFlat[i]);
    }
    context.lineTo(x + r * hexCosinesFlat[0], y + r * hexSinesFlat[0]);
  } else {
    context.moveTo(x + r * hexCosinesPointy[0], y + r * hexSinesPointy[0]);
    for (let i = 1; i < 6; i++) {
      context.lineTo(x + r * hexCosinesPointy[i], y + r * hexSinesPointy[i]);
    }
    context.lineTo(x + r * hexCosinesPointy[0], y + r * hexSinesPointy[0]);
  }

  context.stroke();
}
