import { onMount, Show } from "solid-js";
import { ArtData } from "./art-data/art-data";
import { TagsContainer } from "./TagsContainer";

import css from "./ArtPage.module.css";

// Additional stuff, like implementation guide and whatnot should be
// added as Components to the ArtPage props.

interface ArtPageProps {
  art: ArtData<any>;
}

export const ArtPage = (props: ArtPageProps) => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    props.art.artMain(canvasRef, props.art.artConfig);
  });

  // TODO: onCleanup

  return (
    <main class={css.main}>
      <article>
        <h1 class={css.title}>{props.art.title}</h1>

        <div class={css.tags}>
          <TagsContainer tags={props.art.tags} />
        </div>

        <figure>
          <canvas class={css.canvas} ref={canvasRef} />
          <Show when={props.art.description}>
            <figcaption class={css.description}>
              {props.art.description}
            </figcaption>
          </Show>
        </figure>
      </article>
    </main>
  );
};
