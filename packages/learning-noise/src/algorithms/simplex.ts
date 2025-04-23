import { Vector2 } from "@utilities/vector";

const gradients: Vector2[] = [
  Vector2.north(),
  Vector2.northEast(),
  Vector2.east(),
  Vector2.southEast(),
  Vector2.south(),
  Vector2.southWest(),
  Vector2.west(),
  Vector2.northWest(),
] as const;

const skewFactor = 0.5 * (Math.sqrt(3) - 1);
const unskewFactor = (3 - Math.sqrt(3)) / 6;

function generate(input: Vector2) {
  const skewAmount = (input.x + input.y) * skewFactor;

  const skewed = input.clone().increase(skewAmount, skewAmount);

  const base = skewed
}
