/*

  For canvas context, prefer using RGB format.
  Internally it converts hex strings to RGB/RGBA anyways.

*/

export function getRGB(red: number, green: number, blue: number) {
  return (
    "rgb(" +
    ((red * 255) | 0) +
    "," +
    ((green * 255) | 0) +
    "," +
    ((blue * 255) | 0) +
    ")"
  );
}

export function getRGBA(
  red: number,
  green: number,
  blue: number,
  alpha: number,
) {
  return (
    "rgb(" +
    ((red * 255) | 0) +
    "," +
    ((green * 255) | 0) +
    "," +
    ((blue * 255) | 0) +
    "," +
    ((alpha * 255) | 0) +
    ")"
  );
}

export function getRGBGrayscale(value: number) {
  const byte = (value * 255) | 0;
  return "rgb(" + byte + "," + byte + "," + byte + ")";
}

export function getHex(red: number, green: number, blue: number) {
  const r = ((red * 255) | 0).toString(16).padStart(2, "0");
  const g = ((green * 255) | 0).toString(16).padStart(2, "0");
  const b = ((blue * 255) | 0).toString(16).padStart(2, "0");
  return "#" + r + g + b;
}

export function getHexTransparent(
  red: number,
  green: number,
  blue: number,
  alpha: number,
) {
  const r = ((red * 255) | 0).toString(16).padStart(2, "0");
  const g = ((green * 255) | 0).toString(16).padStart(2, "0");
  const b = ((blue * 255) | 0).toString(16).padStart(2, "0");
  const a = ((alpha * 255) | 0).toString(16).padStart(2, "0");
  return "#" + r + g + b + a;
}
