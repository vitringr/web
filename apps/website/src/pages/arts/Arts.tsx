import { A } from "@solidjs/router";

import css from "./Arts.module.css";

import { TagNames, TagsContainer } from "./Tags";
import { Routes } from "../../routes";

const ArtCard = (props: {
  title: string;
  route: string;
  image: string;
  tags: TagNames[];
}) => {
  return (
    <div class={css.card}>
      <A class={css.link} href={Routes.root.arts + props.route}>
        <div class={css.image_container}>
          <img class={css.image} src={props.image} />
          <div class={css.tags_overlay}>
            <TagsContainer tags={props.tags} />
          </div>
        </div>
        <h2 class={css.title}>{props.title}</h2>
      </A>
    </div>
  );
};

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
