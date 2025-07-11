import { Routes } from "../../routes";
import { ArtCard } from "./ArtCard";
import { TagNames } from "./Tags";

import css from "./Arts.module.css";

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

export const Arts = () => {
  return (
    <div class="page">
      <h1>Arts</h1>
      <p>Creative coding arts.</p>

      <div class={css.cards_container}>
        <ArtCard
          title="The Seer"
          route={Routes.arts.theSeer}
          image={theSeerPNG}
          tags={[
            TagNames["2D"],
            TagNames.Input,
            TagNames.Particles,
            TagNames.Image,
            TagNames.Noise,
          ]}
        />

        <ArtCard
          title="System Shock"
          route={Routes.arts.systemShock}
          image={systemShockPNG}
          tags={[
            TagNames["2D"],
            TagNames.ASCII,
            TagNames.Image,
            TagNames.Noise,
            TagNames.Random,
          ]}
        />

        <ArtCard
          title="Anger"
          route={Routes.arts.anger}
          image={angerPNG}
          tags={[
            TagNames["2D"],
            TagNames.GPU,
            TagNames.Noise,
          ]}
        />


        <ArtCard
          title="Sparks"
          route={Routes.arts.sparks}
          image={sparksPNG}
          tags={[
            TagNames["2D"],
            TagNames.Input,
            TagNames.Particles,
            TagNames.Noise,
          ]}
        />

        <ArtCard
          title="Overgrowth"
          route={Routes.arts.overgrowth}
          image={overgrowthPNG}
          tags={[
            TagNames["2D"],
            TagNames.Input,
            TagNames.Particles,
            TagNames.Noise,
          ]}
        />

        <ArtCard
          title="Random Walkers"
          route={Routes.arts.randomWalkers}
          image={randomWalkersPNG}
          tags={[TagNames["2D"], TagNames.Random]}
        />

        <ArtCard
          title="Noise 2D"
          route={Routes.arts.noise2D}
          image={noise2DPNG}
          tags={[TagNames["2D"], TagNames.GPU, TagNames.Noise]}
        />

        <ArtCard
          title="Noise Flow"
          route={Routes.arts.noiseFlow}
          image={noiseFlowPNG}
          tags={[TagNames["2D"], TagNames.GPU, TagNames.Noise]}
        />

        <ArtCard
          title="Noise Loop"
          route={Routes.arts.noiseLoop}
          image={noiseLoopPNG}
          tags={[TagNames["2D"], TagNames.Noise]}
        />

        <ArtCard
          title="Noise Vector Field"
          route={Routes.arts.noiseVectorField}
          image={noiseVectorFieldPNG}
          tags={[TagNames["2D"], TagNames.Noise]}
        />

        <ArtCard
          title="Noise Blanket"
          route={Routes.arts.noiseBlanket}
          image={noiseBlanketPNG}
          tags={[TagNames["2D"], TagNames.Noise]}
        />

        <ArtCard
          title="Noise Ascii"
          route={Routes.arts.noiseAscii}
          image={noiseAsciiPNG}
          tags={[TagNames["2D"], TagNames.Noise, TagNames.ASCII]}
        />

        <ArtCard
          title="Noise Rainbow"
          route={Routes.arts.noiseRainbow}
          image={noiseRainbow}
          tags={[TagNames["2D"], TagNames.Noise]}
        />

        <ArtCard
          title="Regeneration"
          route={Routes.arts.regeneration}
          image={regenerationPNG}
          tags={[
            TagNames["2D"],
            TagNames.Input,
            TagNames.GPU,
            TagNames.Particles,
          ]}
        />

        <ArtCard
          title="Ten Thousand"
          route={Routes.arts.tenThousand}
          image={tenThousandPNG}
          tags={[
            TagNames["2D"],
            TagNames.GPU,
            TagNames.Particles,
            TagNames.Image,
          ]}
        />

        <ArtCard
          title="Layers"
          route={Routes.arts.layers}
          image={layersPNG}
          tags={[TagNames["2D"], TagNames.Input, TagNames.GPU, TagNames.Image]}
        />

        <ArtCard
          title="Block Cellular Sand"
          route={Routes.arts.blockCellularSand}
          image={blockCellularSandPNG}
          tags={[
            TagNames["2D"],
            TagNames.Input,
            TagNames.GPU,
            TagNames.Particles,
          ]}
        />
      </div>
    </div>
  );
};
