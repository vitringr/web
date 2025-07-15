import { Creative } from "@packages/creative";
import { TagNames } from "../Tags";
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

interface ArtData<T> {
  title: string;
  route: string;
  thumbnail: string;
  tags: TagNames[];
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
      TagNames["2D"],
      TagNames.Input,
      TagNames.Particles,
      TagNames.Image,
      TagNames.Noise,
    ],
    description: "",
    artMain: Creative.Canvas2D.TheSeer.main,
  }),

  defineArt({
    title: "System Shock",
    route: Routes.arts.systemShock,
    thumbnail: systemShockPNG,
    tags: [
      TagNames["2D"],
      TagNames.ASCII,
      TagNames.Image,
      TagNames.Noise,
      TagNames.Random,
    ],
    description: "",
    artMain: Creative.Canvas2D.SystemShock.main,
  }),

  defineArt({
    title: "Anger",
    route: Routes.arts.anger,
    thumbnail: angerPNG,
    tags: [TagNames["2D"], TagNames.GPU, TagNames.Noise],
    description: "",
    artMain: Creative.WebGL.Anger.main,
  }),

  defineArt({
    title: "Sparks",
    route: Routes.arts.sparks,
    thumbnail: sparksPNG,
    tags: [TagNames["2D"], TagNames.Input, TagNames.Particles, TagNames.Noise],
    description: "",
    artMain: Creative.Canvas2D.Sparks.main,
  }),

  defineArt({
    title: "Overgrowth",
    route: Routes.arts.overgrowth,
    thumbnail: overgrowthPNG,
    tags: [TagNames["2D"], TagNames.Input, TagNames.Particles, TagNames.Noise],
    description: "",
    artMain: Creative.Canvas2D.Overgrowth.main,
  }),

  defineArt({
    title: "Random Walkers",
    route: Routes.arts.randomWalkers,
    thumbnail: randomWalkersPNG,
    tags: [TagNames["2D"], TagNames.Random],
    description: "",
    artMain: Creative.Canvas2D.RandomWalkers.main,
  }),

  defineArt({
    title: "Noise 2D",
    route: Routes.arts.noise2D,
    thumbnail: noise2DPNG,
    tags: [TagNames["2D"], TagNames.GPU, TagNames.Noise],
    description: "",
    artMain: Creative.WebGL.Noise2D.main,
  }),

  defineArt({
    title: "Noise Flow",
    route: Routes.arts.noiseFlow,
    thumbnail: noiseFlowPNG,
    tags: [TagNames["2D"], TagNames.GPU, TagNames.Noise],
    description: "",
    artMain: Creative.WebGL.NoiseFlow.main,
  }),

  defineArt({
    title: "Noise Loop",
    route: Routes.arts.noiseLoop,
    thumbnail: noiseLoopPNG,
    tags: [TagNames["2D"], TagNames.Noise],
    description: "",
    artMain: Creative.Canvas2D.NoiseLoop.main,
  }),

  defineArt({
    title: "Noise Vector Field",
    route: Routes.arts.noiseVectorField,
    thumbnail: noiseVectorFieldPNG,
    tags: [TagNames["2D"], TagNames.Noise],
    description: "",
    artMain: Creative.Canvas2D.NoiseVectorField.main,
  }),

  defineArt({
    title: "Noise Blanket",
    route: Routes.arts.noiseBlanket,
    thumbnail: noiseBlanketPNG,
    tags: [TagNames["2D"], TagNames.Noise],
    description: "",
    artMain: Creative.Canvas2D.NoiseBlanket.main,
  }),

  defineArt({
    title: "Noise Ascii",
    route: Routes.arts.noiseAscii,
    thumbnail: noiseAsciiPNG,
    tags: [TagNames["2D"], TagNames.Noise, TagNames.ASCII],
    description: "",
    artMain: Creative.Canvas2D.NoiseAscii.main,
  }),

  defineArt({
    title: "Noise Rainbow",
    route: Routes.arts.noiseRainbow,
    thumbnail: noiseRainbow,
    tags: [TagNames["2D"], TagNames.Noise],
    description: "",
    artMain: Creative.Canvas2D.NoiseRainbow.main,
  }),

  defineArt({
    title: "Regeneration",
    route: Routes.arts.regeneration,
    thumbnail: regenerationPNG,
    tags: [TagNames["2D"], TagNames.Input, TagNames.GPU, TagNames.Particles],
    description: "",
    artMain: Creative.WebGL.Regeneration.main,
  }),

  defineArt({
    title: "Ten Thousand",
    route: Routes.arts.tenThousand,
    thumbnail: tenThousandPNG,
    tags: [TagNames["2D"], TagNames.GPU, TagNames.Particles, TagNames.Image],
    description: "",
    artMain: Creative.WebGL.TenThousand.main,
  }),

  defineArt({
    title: "Layers",
    route: Routes.arts.layers,
    thumbnail: layersPNG,
    tags: [TagNames["2D"], TagNames.Input, TagNames.GPU, TagNames.Image],
    description: "",
    artMain: Creative.WebGL.Layers.main,
  }),

  defineArt({
    title: "Block Cellular Sand",
    route: Routes.arts.blockCellularSand,
    thumbnail: blockCellularSandPNG,
    tags: [TagNames["2D"], TagNames.Input, TagNames.GPU, TagNames.Particles],
    description: "",
    artMain: Creative.WebGL.BlockCellularAutomata.main,
  }),
] as const;
