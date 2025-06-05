import css from "./Arts.module.css";

import { TagNames } from "./Tags";
import { Routes } from "../../routes";
import { ArtCard } from "./ArtCard";

export const Arts = () => {
  return (
    <div class="page">
      <h1>Arts</h1>
      <p>Creative coding arts.</p>

      <div class={css.cards_container}>
        <ArtCard
          title="The Seer"
          route={Routes.arts.theSeer}
          image="solid.svg"
          tags={[
            TagNames["2D"],
            TagNames.Canvas,
            TagNames.Input,
            TagNames.Draw,
            TagNames.Particles,
            TagNames.Image,
            TagNames.Noise,
          ]}
        />

        <ArtCard
          title="Noise 2D"
          route={Routes.arts.noise2D}
          image="solid.svg"
          tags={[TagNames["2D"], TagNames.Canvas, TagNames.Noise]}
        />

        <ArtCard
          title="Noise Loop"
          route={Routes.arts.noiseLoop}
          image="solid.svg"
          tags={[TagNames["2D"], TagNames.Canvas, TagNames.Noise]}
        />

        <ArtCard
          title="Noise Vector Field"
          route={Routes.arts.noiseVectorField}
          image="solid.svg"
          tags={[TagNames["2D"], TagNames.Canvas, TagNames.Noise]}
        />

        <ArtCard
          title="Regeneration"
          route={Routes.arts.regeneration}
          image="solid.svg"
          tags={[
            TagNames.GPU,
            TagNames["2D"],
            TagNames.Input,
            TagNames.Draw,
            TagNames.Particles,
          ]}
        />

        <ArtCard
          title="Ten Thousand"
          route={Routes.arts.tenThousand}
          image="solid.svg"
          tags={[
            TagNames.GPU,
            TagNames["2D"],
            TagNames.Particles,
            TagNames.Image,
          ]}
        />

        <ArtCard
          title="Layers"
          route={Routes.arts.layers}
          image="solid.svg"
          tags={[TagNames.GPU, TagNames["2D"], TagNames.Input, TagNames.Image]}
        />

        <ArtCard
          title="Godfather"
          route={Routes.arts.godfather}
          image="solid.svg"
          tags={[
            TagNames.GPU,
            TagNames["2D"],
            TagNames.Image,
            TagNames.Particles,
          ]}
        />
      </div>
    </div>
  );
};
