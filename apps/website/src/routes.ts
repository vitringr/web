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
    systemShock: "/system-shock",
    anger: "/anger",
    concealed: "/concealed",
    sparks: "/sparks",
    overgrowth: "/overgrowth",
    randomWalkers: "/random-walkers",
    noise2D: "/noise-2d",
    noiseFlow: "/noise-flow",
    stars: "/stars",
    noiseLoop: "/noise-loop",
    noiseVectorField: "/noise-vector-field",
    noiseBlanket: "/noise-blanket",
    noiseAscii: "/noise-ascii",
    noiseRainbow: "/noise-rainbow",
    regeneration: "/regeneration",
    tenThousand: "/ten-thousand",
    layers: "/layers",
    blockCellularSand: "/block-cellular-sand",
  } as const;

  // export const writing = {} as const;

  // export const about = {} as const;

  // export const contact = {} as const;
}
