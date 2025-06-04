import { A } from "@solidjs/router";

import css from "./Guides.module.css";

const GuideCard = (props: {
  title: string;
  href: string;
  description: string;
  image: string;
}) => {
  return (
    <div class={css.card}>
      <A class={css.anchor} href={props.href}>
        <span
          class={css.background}
          style={{ "background-image": "url('solid.svg')" }}
        ></span>
        <h2 class={css.title}>{props.title}</h2>
      </A>
      <p class={css.description}>{props.description}</p>
    </div>
  );
};

export const Guides = () => {
  return (
    <div class="page">
      <h1>Guides</h1>
      <p>Creative software engineering guides.</p>

      <div class={css.cards_container}>
        <GuideCard
          title="Value Noise Guide"
          href="/guides/value-noise"
          description="Probably the simplest and fastest noise generation method."
          image="solid.svg"
        />

        <GuideCard
          title="Perlin Noise Guide"
          href="/guides/perlin-noise"
          description="Classic gradient noise generation algorithm. Generates smooth, natural-looking patterns."
          image="solid.svg"
        />

        <GuideCard
          title="Simplex Noise Guide"
          href="/guides/simplex-noise"
          description="Advanced gradient noise generation algorithm. Works by calculating contribution for each point from nearby direction vectors in simplex space."
          image="solid.svg"
        />
      </div>
    </div>
  );
};
