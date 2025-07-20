import { For } from "solid-js";
import { ArtCard } from "./ArtCard";
import { artData } from "./art-data";

import css from "./Arts.module.css";

export const Arts = () => {
  return (
    <div class="page">
      <h1>Arts</h1>

      <p>Creative coding arts.</p>

      <div class={css.cards_container}>
        <For each={artData}>
          {(art) => (
            <ArtCard
              title={art.title}
              route={art.route}
              thumbnail={art.thumbnail}
              tags={art.tags}
            />
          )}
        </For>
      </div>
    </div>
  );
};
