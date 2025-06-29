import { Routes } from "../../routes";
import { ArtCard } from "./ArtCard";
import { TagNames } from "./Tags";

import css from "./Arts.module.css";

import theSeerThumbnail from "./thumbnails/theSeer.png";
import blockCellularSandThumbnail from "./thumbnails/blockCellularSand.png";
import layersThumbnail from "./thumbnails/layers.png";
import noise2DThumbnail from "./thumbnails/noise2D.png";
import randomWalkersThumbnail from "./thumbnails/randomWalkers.png";
import noiseFlowThumbnail from "./thumbnails/noiseFlow.png";
import noiseRainbow from "./thumbnails/noiseRainbow.png";
import noiseLoopThumbnail from "./thumbnails/noiseLoop.png";
import noiseVectorFieldThumbnail from "./thumbnails/noiseVectorField.png";
import tenThousandThumbnail from "./thumbnails/tenThousand.png";

export const Arts = () => {
  return (
    <div class="page">
      <h1>Arts</h1>
      <p>Creative coding arts.</p>

      <div class={css.cards_container}>
        <ArtCard
          title="The Seer"
          route={Routes.arts.theSeer}
          image={theSeerThumbnail}
          tags={[
            TagNames["2D"],
            TagNames.Input,
            TagNames.Particles,
            TagNames.Image,
            TagNames.Noise,
          ]}
        />

        <ArtCard
          title="Random Walkers"
          route={Routes.arts.randomWalkers}
          image={randomWalkersThumbnail}
          tags={[TagNames["2D"], TagNames.Random]}
        />

        <ArtCard
          title="Overgrowth"
          route={Routes.arts.noise2D}
          image="solidjs"
          tags={[
            TagNames["2D"],
            TagNames.Input,
            TagNames.Particles,
            TagNames.Noise,
          ]}
        />

        <ArtCard
          title="Noise 2D"
          route={Routes.arts.noise2D}
          image={noise2DThumbnail}
          tags={[TagNames["2D"], TagNames.GPU, TagNames.Noise]}
        />

        <ArtCard
          title="Noise Flow"
          route={Routes.arts.noiseFlow}
          image={noiseFlowThumbnail}
          tags={[TagNames["2D"], TagNames.GPU, TagNames.Noise]}
        />

        <ArtCard
          title="Noise Loop"
          route={Routes.arts.noiseLoop}
          image={noiseLoopThumbnail}
          tags={[TagNames["2D"], TagNames.Noise]}
        />

        <ArtCard
          title="Noise Vector Field"
          route={Routes.arts.noiseVectorField}
          image={noiseVectorFieldThumbnail}
          tags={[TagNames["2D"], TagNames.Noise]}
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
          image="solid.svg"
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
          image={tenThousandThumbnail}
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
          image={layersThumbnail}
          tags={[TagNames["2D"], TagNames.Input, TagNames.GPU, TagNames.Image]}
        />

        <ArtCard
          title="Godfather"
          route={Routes.arts.godfather}
          image="solid.svg"
          tags={[
            TagNames["2D"],
            TagNames.GPU,
            TagNames.Particles,
            TagNames.Image,
          ]}
        />

        <ArtCard
          title="Block Cellular Sand"
          route={Routes.arts.blockCellularSand}
          image={blockCellularSandThumbnail}
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
