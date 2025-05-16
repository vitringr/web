import { Vector2 } from "@utilities/vector";

const gradients = [
  Vector2.Create.north(),
  Vector2.Create.northEast(),
  Vector2.Create.east(),
  Vector2.Create.southEast(),
  Vector2.Create.south(),
  Vector2.Create.southWest(),
  Vector2.Create.west(),
  Vector2.Create.northWest(),
] as const;

function noise(input_square: Vector2) {
  const F = 0.3660254037844386; // Skew factor
  const G = 0.2113248654051871; // Unskew factor

  // 1. Find square cell origin
  const origin = input_square.clone().floor();

  // 2. Find square cell triangle
  const fraction = input_square.clone().subtract(origin);
  const isBotTriangle = fraction.x > fraction.y;

  // 2. Get 3 square-space corners of the triangle
  const a_square = origin.clone();
  const b_square = origin.clone();
  isBotTriangle ? (b_square.x += 1) : (b_square.y += 1);
  const c_square = origin.clone().increase(1, 1);

  // 3. Unskew corners back to simplex space
  const unskew = (vector: Vector2) => {
    const t = (vector.x + vector.y) * G;
    return vector.clone().decrease(t, t);
  };

  const a_simplex = unskew(a_square);
  const b_simplex = unskew(b_square);
  const c_simplex = unskew(c_square);

  // 4. Compute displacement vectors in simplex space
  const a_displacement = input_square.clone().subtract(a_simplex);
  const b_displacement = input_square.clone().subtract(b_simplex);
  const c_displacement = input_square.clone().subtract(c_simplex);

  // 5. Get gradients for each corner (from permutation table)
  // Note: In practice, you'd use a permutation table here
  const grad = (vector: Vector2) => {
    // Pseudo-random gradient selection (replace with proper hash)
    let random = Math.sin(vector.x * 12.9898 + vector.y * 78.233) * 43758.5453;
    random %= gradients.length;
    random = Math.floor(Math.abs(random));

    return gradients[random];
  };

  const a_gradient = grad(a_square);
  const b_gradient = grad(b_square);
  const c_gradient = grad(c_square);

  // 6. Calculate dot products and falloff
  const falloff = (r2: number) => Math.max(0, 0.5 - r2) ** 4;

  const dotA = a_gradient.x * a_displacement.x + a_gradient.y * a_displacement.y;
  const dotB = b_gradient.x * b_displacement.x + b_gradient.y * b_displacement.y;
  const dotC = c_gradient.x * c_displacement.x + c_gradient.y * c_displacement.y;

  const r2a = a_displacement.x * a_displacement.x + a_displacement.y * a_displacement.y;
  const r2b = b_displacement.x * b_displacement.x + b_displacement.y * b_displacement.y;
  const r2c = c_displacement.x * c_displacement.x + c_displacement.y * c_displacement.y;

  const contributionA = dotA * falloff(r2a);
  const contributionB = dotB * falloff(r2b);
  const contributionC = dotC * falloff(r2c);

  // 7. Combine contributions (scaled to ~[-1, 1])
  return (contributionA + contributionB + contributionC) * 70;
}
