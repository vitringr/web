import { Vector2 } from "@utilities/vector";

const gradients: Vector2[] = [
  Vector2.Create.north(),
  Vector2.Create.northEast(),
  Vector2.Create.east(),
  Vector2.Create.southEast(),
  Vector2.Create.south(),
  Vector2.Create.southWest(),
  Vector2.Create.west(),
  Vector2.Create.northWest(),
] as const;

const skewFactor = 0.5 * (Math.sqrt(3) - 1);
const unskewFactor = (3 - Math.sqrt(3)) / 6;

function generate(input: Vector2) {
  const skewAmount = (input.x + input.y) * skewFactor;
  const skewed = input.clone().increase(skewAmount, skewAmount);

  const base = skewed.floor();

  const unskewAmount = (base.x + base.y) * unskewFactor;
  const origin = base.clone().decrease(unskewAmount, unskewAmount);

  const differenceFromOrigin = input.clone().subtract(origin);


}
