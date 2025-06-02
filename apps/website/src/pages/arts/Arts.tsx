import { A } from "@solidjs/router";

import css from "./Arts.module.css";

import { TagNames, TagsContainer } from "./Tags";

const ArtCard = (props: {
  title: string;
  href: string;
  image: string;
  tags: TagNames[];
}) => {
  return (
    <div class={css.card}>
      <A class={css.link} href={props.href}>
        <div class={css.image_container}>
          <img class={css.image} src={props.image} loading="lazy" />
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
    <div>
      <h1>Arts</h1>
      <p>Creative coding arts.</p>

      <div class={css.cards_container}>
        <ArtCard
          title="The Seer"
          href="/arts/the-seer"
          image="solid.svg"
          tags={[
            TagNames["2D"],
            TagNames.Canvas,
            TagNames.Input,
            TagNames.Particles,
            TagNames.Noise,
          ]}
        />

        <ArtCard
          title="Noise2D"
          href="/arts/noise-2d"
          image="solid.svg"
          tags={[
            TagNames["2D"],
            TagNames["3D"],
            TagNames.Canvas,
            TagNames.Input,
            TagNames.Particles,
            TagNames["3D"],
            TagNames.Canvas,
            TagNames.GPU,
            TagNames.Noise,
            TagNames["2D"],
            TagNames.Input,
            TagNames.GPU,
          ]}
        />

        <ArtCard
          title="Noise Loop"
          href="/arts/noise-loop"
          image="solid.svg"
          tags={[
            TagNames["2D"],
            TagNames.Input,
            TagNames["3D"],
            TagNames.Canvas,
            TagNames["2D"],
            TagNames.GPU,
            TagNames["3D"],
            TagNames.Canvas,
            TagNames.GPU,
            TagNames.Particles,
            TagNames.Noise,
            TagNames.Input,
          ]}
        />
      </div>
    </div>
  );
};
