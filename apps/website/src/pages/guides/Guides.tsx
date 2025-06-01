import { A } from "@solidjs/router";

import css from "./Guides.module.css";

const GuideBillboard = (props: {
  title: string;
  href: string;
  description: string;
}) => {
  return (
    <A href={props.href} class={css.billboard}>
      <h3 class={css.title}>{props.title}</h3>
      <p class={css.description}>{props.description}</p>
    </A>
  );
};

export const Guides = () => {
  return (
    <div>
      <p>Guides page text.</p>

      <div class={css.billboards_container}>
        <GuideBillboard
          title="Value Noise Guide"
          href="/guides/value-noise"
          description="Probably the simplest and fastest noise generation method."
        />

        <GuideBillboard
          title="Perlin Noise Guide"
          href="/guides/perlin-noise"
          description="Classic gradient noise generation algorithm. Generates smooth, natural-looking patterns."
        />

        <GuideBillboard
          title="Simplex Noise Guide"
          href="/guides/simplex-noise"
          description="Advanced gradient noise generation algorithm. Works by calculating contribution for each point from nearby direction vectors in simplex space."
        />
      </div>
    </div>
  );
};
