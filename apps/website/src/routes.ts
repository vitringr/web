export namespace Routes {
  export const root = {
    home: "/",
    guides: "/guides",
    arts: "/arts",
    writing: "/writing",
    about: "/about",
    contact: "/contact",
    notFound: "*404",
  };

  // export const home = {} as const;

  export const guides = {
    valueNoise: "/value-noise",
    perlinNoise: "/perlin-noise",
    simplexNoise: "/simplex-noise",
  } as const;

  export const arts = {
    theSeer: "/the-seer",
    noise2D: "/noise-2d",
    noiseLoop: "/noise-loop",
    noiseVectorField: "/noise-vector-field",
  } as const;

  // export const writing = {} as const;

  // export const about = {} as const;

  // export const contact = {} as const;
}
