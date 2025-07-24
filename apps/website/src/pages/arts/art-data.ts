import { Creative } from "@packages/creative";
import { ArtTagNames } from "./art-tags";
import { Routes } from "../../routes";

import theSeerPNG from "./thumbnails/theSeer.png";
import layersPNG from "./thumbnails/layers.png";
import noise2DPNG from "./thumbnails/noise2D.png";
import noiseRainbow from "./thumbnails/noiseRainbow.png";
import randomWalkersPNG from "./thumbnails/randomWalkers.png";
import noiseLoopPNG from "./thumbnails/noiseLoop.png";
import noiseVectorFieldPNG from "./thumbnails/noiseVectorField.png";
import noiseBlanketPNG from "./thumbnails/noiseBlanket.png";
import noiseAsciiPNG from "./thumbnails/noiseAscii.png";
import tenThousandPNG from "./thumbnails/tenThousand.png";
import overgrowthPNG from "./thumbnails/overgrowth.png";
import firecrackersPNG from "./thumbnails/firecrackers.png";
import systemShockPNG from "./thumbnails/systemShock.png";
import regenerationPNG from "./thumbnails/regeneration.png";
import angerPNG from "./thumbnails/anger.png";
import wealthPNG from "./thumbnails/wealth.png";
import starsPNG from "./thumbnails/stars.png";
import gameOfLifePNG from "./thumbnails/gameOfLife.png";

export interface ArtData<T> {
  title: string;
  route: string;

  thumbnail: string;
  tags: ArtTagNames[];

  artMain: (canvas: HTMLCanvasElement, settings?: Partial<T>) => void;
  artConfig?: Partial<T>;

  description?: string;
}

function defineArt<T>(art: ArtData<T>): ArtData<T> {
  return art;
}

export const artData: ArtData<any>[] = [
  defineArt({
    title: "The Seer",
    route: Routes.arts.theSeer,
    thumbnail: theSeerPNG,
    tags: [
      ArtTagNames.Input,
      ArtTagNames.Particles,
      ArtTagNames.Image,
      ArtTagNames.Noise,
    ],
    artMain: Creative.Canvas2D.TheSeer.main,
  }),

  defineArt({
    title: "System Shock",
    route: Routes.arts.systemShock,
    thumbnail: systemShockPNG,
    tags: [
      ArtTagNames.ASCII,
      ArtTagNames.Image,
      ArtTagNames.Noise,
      ArtTagNames.Random,
    ],
    artMain: Creative.Canvas2D.SystemShock.main,
    description: "Description of System Shock",
  }),

  defineArt({
    title: "Wealth",
    route: Routes.arts.wealth,
    thumbnail: wealthPNG,
    tags: [
      ArtTagNames.Input,
      ArtTagNames.GPU,
      ArtTagNames.Particles,
      ArtTagNames.Noise,
    ],
    artMain: Creative.WebGL.Wealth.main,
  }),

  defineArt({
    title: "Game of Life",
    route: Routes.arts.gameOfLife,
    thumbnail: gameOfLifePNG,
    tags: [ArtTagNames.Input, ArtTagNames.GPU, ArtTagNames.Automata],
    artMain: Creative.WebGL.GameOfLife.main,
  }),

  defineArt({
    title: "Layers",
    route: Routes.arts.layers,
    thumbnail: layersPNG,
    tags: [ArtTagNames.Input, ArtTagNames.GPU, ArtTagNames.Image],
    artMain: Creative.WebGL.Layers.main,
  }),

  defineArt({
    title: "Overgrowth",
    route: Routes.arts.overgrowth,
    thumbnail: overgrowthPNG,
    tags: [ArtTagNames.Input, ArtTagNames.Particles, ArtTagNames.Noise],
    artMain: Creative.Canvas2D.Overgrowth.main,
    description: "Description of Overgrowth.",
  }),

  defineArt({
    title: "Firecrackers",
    route: Routes.arts.firecrackers,
    thumbnail: firecrackersPNG,
    tags: [ArtTagNames.Input, ArtTagNames.Particles, ArtTagNames.Noise],
    artMain: Creative.Canvas2D.Firecrackers.main,
  }),

  defineArt({
    title: "Random Walkers",
    route: Routes.arts.randomWalkers,
    thumbnail: randomWalkersPNG,
    tags: [ArtTagNames.Random],
    artMain: Creative.Canvas2D.RandomWalkers.main,
  }),

  defineArt({
    title: "Stars",
    route: Routes.arts.stars,
    thumbnail: starsPNG,
    tags: [ArtTagNames.GPU, ArtTagNames.Particles, ArtTagNames.Random],
    artMain: Creative.WebGL.Stars.main,
  }),

  defineArt({
    title: "Ten Thousand",
    route: Routes.arts.tenThousand,
    thumbnail: tenThousandPNG,
    tags: [ArtTagNames.GPU, ArtTagNames.Particles, ArtTagNames.Image],
    artMain: Creative.WebGL.TenThousand.main,
  }),

  defineArt({
    title: "Anger",
    route: Routes.arts.anger,
    thumbnail: angerPNG,
    tags: [ArtTagNames.GPU, ArtTagNames.Noise],
    artMain: Creative.WebGL.Anger.main,
  }),

  defineArt({
    title: "Regeneration",
    route: Routes.arts.regeneration,
    thumbnail: regenerationPNG,
    tags: [ArtTagNames.Input, ArtTagNames.GPU, ArtTagNames.Particles],
    artMain: Creative.WebGL.Regeneration.main,
  }),

  defineArt({
    title: "Noise Loop",
    route: Routes.arts.noiseLoop,
    thumbnail: noiseLoopPNG,
    tags: [ArtTagNames.Noise],
    artMain: Creative.Canvas2D.NoiseLoop.main,
  }),

  defineArt({
    title: "Noise 2D",
    route: Routes.arts.noise2D,
    thumbnail: noise2DPNG,
    tags: [ArtTagNames.GPU, ArtTagNames.Noise],
    artMain: Creative.WebGL.Noise2D.main,
  }),

  defineArt({
    title: "Noise Vector Field",
    route: Routes.arts.noiseVectorField,
    thumbnail: noiseVectorFieldPNG,
    tags: [ArtTagNames.Noise],
    artMain: Creative.Canvas2D.NoiseVectorField.main,
  }),

  defineArt({
    title: "Noise Blanket",
    route: Routes.arts.noiseBlanket,
    thumbnail: noiseBlanketPNG,
    tags: [ArtTagNames.Noise],
    artMain: Creative.Canvas2D.NoiseBlanket.main,
  }),

  defineArt({
    title: "Noise Ascii",
    route: Routes.arts.noiseAscii,
    thumbnail: noiseAsciiPNG,
    tags: [ArtTagNames.Noise, ArtTagNames.ASCII],
    artMain: Creative.Canvas2D.NoiseAscii.main,
  }),

  defineArt({
    title: "Noise Rainbow",
    route: Routes.arts.noiseRainbow,
    thumbnail: noiseRainbow,
    tags: [ArtTagNames.Noise],
    artMain: Creative.Canvas2D.NoiseRainbow.main,
  }),
] as const;
