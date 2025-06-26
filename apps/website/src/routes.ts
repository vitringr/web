export namespace Routes {
  export const root = {
    home: "/",
    guides: "/guides",
    arts: "/arts",
    writing: "/writing",
    about: "/about",
    contact: "/contact",
    notFound: "*404",
  } as const;

  // export const home = {} as const;

  export const guides = {
    valueNoise: "/value-noise",
    perlinNoise: "/perlin-noise",
    simplexNoise: "/simplex-noise",
  } as const;

  export const arts = {
    theSeer: "/the-seer",
    noise2D: "/noise-2d",
    noiseFlow: "/noise-flow",
    noiseLoop: "/noise-loop",
    noiseVectorField: "/noise-vector-field",
    noiseRainbow: "/noise-rainbow",
    regeneration: "/regeneration",
    tenThousand: "/ten-thousand",
    layers: "/layers",
    godfather: "/godfather",
    blockCellularSand: "/block-cellular-sand",
  } as const;

  // export const writing = {} as const;

  // export const about = {} as const;

  // export const contact = {} as const;
}
