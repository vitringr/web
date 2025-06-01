import { A } from "@solidjs/router";

import css from "./Arts.module.css";

type Tag = {
  name: string;
  color: string;
};

// WIP: tags
const ArtCard = (props: {
  title: string;
  href: string;
  image: string;
  tags: string[];
}) => {
  return (
    <div class={css.card}>
      <A class={css.link} href={props.href}>
        <img class={css.image} src={props.image} />
        <h2 class={css.title}>{props.title}</h2>
      </A>
      <p>{props.tags.join(" ")}</p>
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
          tags={["kek", "aer", "lol"]}
        />

        <ArtCard
          title="Noise2D"
          href="/arts/noise-2d"
          image="solid.svg"
          tags={["kek", "aer", "lol"]}
        />

        <ArtCard
          title="Noise Loop"
          href="/arts/noise-loop"
          image="solid.svg"
          tags={["kek", "aer", "lol"]}
        />
      </div>
    </div>
  );
};
