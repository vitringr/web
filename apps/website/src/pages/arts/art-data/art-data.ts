import { Creative } from "@packages/creative";
import { ArtTagNames } from "./art-tags";
import { Routes } from "../../../routes";

import theSeerPNG from "./thumbnails/theSeer.png";
import blockCellularSandPNG from "./thumbnails/blockCellularSand.png";
import layersPNG from "./thumbnails/layers.png";
import noise2DPNG from "./thumbnails/noise2D.png";
import noiseRainbow from "./thumbnails/noiseRainbow.png";
import randomWalkersPNG from "./thumbnails/randomWalkers.png";
import noiseFlowPNG from "./thumbnails/noiseFlow.png";
import noiseLoopPNG from "./thumbnails/noiseLoop.png";
import noiseVectorFieldPNG from "./thumbnails/noiseVectorField.png";
import noiseBlanketPNG from "./thumbnails/noiseBlanket.png";
import noiseAsciiPNG from "./thumbnails/noiseAscii.png";
import tenThousandPNG from "./thumbnails/tenThousand.png";
import overgrowthPNG from "./thumbnails/overgrowth.png";
import sparksPNG from "./thumbnails/sparks.png";
import systemShockPNG from "./thumbnails/systemShock.png";
import regenerationPNG from "./thumbnails/regeneration.png";
import angerPNG from "./thumbnails/anger.png";

export interface ArtData<T> {
  title: string;
  route: string;
  thumbnail: string;
  tags: ArtTagNames[];
  description: string;

  artMain: (canvas: HTMLCanvasElement, settings?: Partial<T>) => void;
  artConfig?: Partial<T>;
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
      ArtTagNames["2D"],
      ArtTagNames.Input,
      ArtTagNames.Particles,
      ArtTagNames.Image,
      ArtTagNames.Noise,
    ],
    description: "",
    artMain: Creative.Canvas2D.TheSeer.main,
  }),

  defineArt({
    title: "System Shock",
    route: Routes.arts.systemShock,
    thumbnail: systemShockPNG,
    tags: [
      ArtTagNames["2D"],
      ArtTagNames.ASCII,
      ArtTagNames.Image,
      ArtTagNames.Noise,
      ArtTagNames.Random,
    ],
    description: "Description of System Shock",
    artMain: Creative.Canvas2D.SystemShock.main,
  }),

  defineArt({
    title: "Anger",
    route: Routes.arts.anger,
    thumbnail: angerPNG,
    tags: [ArtTagNames["2D"], ArtTagNames.GPU, ArtTagNames.Noise],
    description: "",
    artMain: Creative.WebGL.Anger.main,
  }),

  defineArt({
    title: "Sparks",
    route: Routes.arts.sparks,
    thumbnail: sparksPNG,
    tags: [
      ArtTagNames["2D"],
      ArtTagNames.Input,
      ArtTagNames.Particles,
      ArtTagNames.Noise,
    ],
    description: "",
    artMain: Creative.Canvas2D.Sparks.main,
  }),

  defineArt({
    title: "Overgrowth",
    route: Routes.arts.overgrowth,
    thumbnail: overgrowthPNG,
    tags: [
      ArtTagNames["2D"],
      ArtTagNames.Input,
      ArtTagNames.Particles,
      ArtTagNames.Noise,
    ],
    description: "",
    artMain: Creative.Canvas2D.Overgrowth.main,
  }),

  defineArt({
    title: "Random Walkers",
    route: Routes.arts.randomWalkers,
    thumbnail: randomWalkersPNG,
    tags: [ArtTagNames["2D"], ArtTagNames.Random],
    description: "",
    artMain: Creative.Canvas2D.RandomWalkers.main,
  }),

  defineArt({
    title: "Noise 2D",
    route: Routes.arts.noise2D,
    thumbnail: noise2DPNG,
    tags: [ArtTagNames["2D"], ArtTagNames.GPU, ArtTagNames.Noise],
    description: "",
    artMain: Creative.WebGL.Noise2D.main,
  }),

  defineArt({
    title: "Noise Flow",
    route: Routes.arts.noiseFlow,
    thumbnail: noiseFlowPNG,
    tags: [ArtTagNames["2D"], ArtTagNames.GPU, ArtTagNames.Noise],
    description: "",
    artMain: Creative.WebGL.NoiseFlow.main,
  }),

  defineArt({
    title: "Noise Loop",
    route: Routes.arts.noiseLoop,
    thumbnail: noiseLoopPNG,
    tags: [ArtTagNames["2D"], ArtTagNames.Noise],
    description: "",
    artMain: Creative.Canvas2D.NoiseLoop.main,
  }),

  defineArt({
    title: "Noise Vector Field",
    route: Routes.arts.noiseVectorField,
    thumbnail: noiseVectorFieldPNG,
    tags: [ArtTagNames["2D"], ArtTagNames.Noise],
    description: "",
    artMain: Creative.Canvas2D.NoiseVectorField.main,
  }),

  defineArt({
    title: "Noise Blanket",
    route: Routes.arts.noiseBlanket,
    thumbnail: noiseBlanketPNG,
    tags: [ArtTagNames["2D"], ArtTagNames.Noise],
    description: "",
    artMain: Creative.Canvas2D.NoiseBlanket.main,
  }),

  defineArt({
    title: "Noise Ascii",
    route: Routes.arts.noiseAscii,
    thumbnail: noiseAsciiPNG,
    tags: [ArtTagNames["2D"], ArtTagNames.Noise, ArtTagNames.ASCII],
    description: "",
    artMain: Creative.Canvas2D.NoiseAscii.main,
  }),

  defineArt({
    title: "Noise Rainbow",
    route: Routes.arts.noiseRainbow,
    thumbnail: noiseRainbow,
    tags: [ArtTagNames["2D"], ArtTagNames.Noise],
    description: "",
    artMain: Creative.Canvas2D.NoiseRainbow.main,
  }),

  defineArt({
    title: "Regeneration",
    route: Routes.arts.regeneration,
    thumbnail: regenerationPNG,
    tags: [
      ArtTagNames["2D"],
      ArtTagNames.Input,
      ArtTagNames.GPU,
      ArtTagNames.Particles,
    ],
    description: "",
    artMain: Creative.WebGL.Regeneration.main,
  }),

  defineArt({
    title: "Ten Thousand",
    route: Routes.arts.tenThousand,
    thumbnail: tenThousandPNG,
    tags: [
      ArtTagNames["2D"],
      ArtTagNames.GPU,
      ArtTagNames.Particles,
      ArtTagNames.Image,
    ],
    description: "",
    artMain: Creative.WebGL.TenThousand.main,
  }),

  defineArt({
    title: "Layers",
    route: Routes.arts.layers,
    thumbnail: layersPNG,
    tags: [
      ArtTagNames["2D"],
      ArtTagNames.Input,
      ArtTagNames.GPU,
      ArtTagNames.Image,
    ],
    description: "",
    artMain: Creative.WebGL.Layers.main,
  }),

  defineArt({
    title: "Block Cellular Sand",
    route: Routes.arts.blockCellularSand,
    thumbnail: blockCellularSandPNG,
    tags: [
      ArtTagNames["2D"],
      ArtTagNames.Input,
      ArtTagNames.GPU,
      ArtTagNames.Particles,
    ],
    description: "",
    artMain: Creative.WebGL.BlockCellularAutomata.main,
  }),
] as const;
