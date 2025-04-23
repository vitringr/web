class SimplexNoise2D {
  // Gradient vectors for 2D noise (normalized later)
  private static readonly GRADIENT_VECTORS = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ].map(([x, y]) => {
    const length = Math.sqrt(x * x + y * y);
    return [x / length, y / length];
  });

  // Permutation table for hashing
  private static readonly PERMUTATION_TABLE = (() => {
    const table = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69,
      142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219,
      203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
      74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230,
      220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209,
      76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198,
      173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
      207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
      154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79,
      113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
      191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
      184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29,
      24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ];
    const doubledTable = new Array(512);
    for (let i = 0; i < 512; i++) {
      doubledTable[i] = table[i & 255];
    }
    return doubledTable;
  })();

  // Skew factors for 2D noise
  private static readonly SKEW_FACTOR = 0.5 * (Math.sqrt(3) - 1);
  private static readonly UNSKEW_FACTOR = (3 - Math.sqrt(3)) / 6;
  private static readonly NORMALIZATION_FACTOR = 1 / 0.022108854818853867;

  public static generate(x: number, y: number): number {
    // Skew input coordinates to simplex space
    const skewAmount = (x + y) * this.SKEW_FACTOR;
    const skewedX = x + skewAmount;
    const skewedY = y + skewAmount;

    // Determine base cell coordinates
    const baseX = Math.floor(skewedX);
    const baseY = Math.floor(skewedY);

    // Unskew cell origin back to original space
    const unskewAmount = (baseX + baseY) * this.UNSKEW_FACTOR;
    const originX = baseX - unskewAmount;
    const originY = baseY - unskewAmount;

    // Calculate distances from cell origin
    const xDistanceToOrigin = x - originX;
    const yDistanceToOrigin = y - originY;

    // Determine which simplex triangle we're in
    let middleCornerXOffset: number, middleCornerYOffset: number;
    if (xDistanceToOrigin > yDistanceToOrigin) {
      middleCornerXOffset = 1;
      middleCornerYOffset = 0; // Lower triangle
    } else {
      middleCornerXOffset = 0;
      middleCornerYOffset = 1; // Upper triangle
    }

    // Calculate middle corner coordinates
    const xDistanceToMiddle = xDistanceToOrigin - middleCornerXOffset + this.UNSKEW_FACTOR;
    const yDistanceToMiddle = yDistanceToOrigin - middleCornerYOffset + this.UNSKEW_FACTOR;

    // Calculate last corner coordinates
    const xDistanceToFar = xDistanceToOrigin - 1 + 2 * this.UNSKEW_FACTOR;
    const yDistanceToFar = yDistanceToOrigin - 1 + 2 * this.UNSKEW_FACTOR;

    // Hash coordinates to get gradient indices
    const gradientIndex0 =
      this.PERMUTATION_TABLE[(baseX & 255) + this.PERMUTATION_TABLE[baseY & 255]] % 8;
    const gradientIndex1 =
      this.PERMUTATION_TABLE[
      (baseX + middleCornerXOffset) &
      (255 + this.PERMUTATION_TABLE[(baseY + middleCornerYOffset) & 255])
      ] % 8;
    const gradientIndex2 =
      this.PERMUTATION_TABLE[(baseX + 1) & (255 + this.PERMUTATION_TABLE[(baseY + 1) & 255])] % 8;

    // Calculate contributions from each corner
    const contribution0 = this.calculateCornerContribution(
      xDistanceToOrigin,
      yDistanceToOrigin,
      gradientIndex0,
    );
    const contribution1 = this.calculateCornerContribution(
      xDistanceToMiddle,
      yDistanceToMiddle,
      gradientIndex1,
    );
    const contribution2 = this.calculateCornerContribution(
      xDistanceToFar,
      yDistanceToFar,
      gradientIndex2,
    );

    // Normalize from [-1,1] to [0,1] range
    return (this.NORMALIZATION_FACTOR * (contribution0 + contribution1 + contribution2) + 1) / 2;
  }

  private static calculateCornerContribution(
    xDistance: number,
    yDistance: number,
    gradientIndex: number,
  ): number {
    const squaredDistance = xDistance * xDistance + yDistance * yDistance;
    const falloff = 0.5 - squaredDistance;

    if (falloff < 0) return 0;

    const falloffSquared = falloff * falloff;
    const falloffToFourth = falloffSquared * falloffSquared;
    return (
      falloffToFourth * this.dotProduct(this.GRADIENT_VECTORS[gradientIndex], xDistance, yDistance)
    );
  }

  private static dotProduct(gradient: number[], x: number, y: number): number {
    return gradient[0] * x + gradient[1] * y;
  }
}
