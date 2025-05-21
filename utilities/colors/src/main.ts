/*

  For canvas context, prefer using the RGB format.
  Internally it converts hex strings into RGB/RGBA anyways.

*/

export function getRGB(red: number, green: number, blue: number) {
  return (
    "rgb(" +
    ((red * 0xff) | 0) +
    "," +
    ((green * 0xff) | 0) +
    "," +
    ((blue * 0xff) | 0) +
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
    ((red * 0xff) | 0) +
    "," +
    ((green * 0xff) | 0) +
    "," +
    ((blue * 0xff) | 0) +
    "," +
    alpha +
    ")"
  );
}

export function getRGBGrayscale(value: number) {
  const byte = (value * 0xff) | 0;
  return "rgb(" + byte + "," + byte + "," + byte + ")";
}

export function getHex(red: number, green: number, blue: number) {
  const r = ((red * 0xff) | 0).toString(16).padStart(2, "0");
  const g = ((green * 0xff) | 0).toString(16).padStart(2, "0");
  const b = ((blue * 0xff) | 0).toString(16).padStart(2, "0");
  return "#" + r + g + b;
}

export function getHexTransparent(
  red: number,
  green: number,
  blue: number,
  alpha: number,
) {
  const r = ((red * 0xff) | 0).toString(16).padStart(2, "0");
  const g = ((green * 0xff) | 0).toString(16).padStart(2, "0");
  const b = ((blue * 0xff) | 0).toString(16).padStart(2, "0");
  const a = ((alpha * 0xff) | 0).toString(16).padStart(2, "0");
  return "#" + r + g + b + a;
}
