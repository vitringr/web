import { onMount } from "solid-js";
import { ArtData } from "./art-data/art-data";

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
    <main>
      <article>
        <h1>{props.art.title}</h1>

        <figure>
          <canvas ref={canvasRef} />
          <figcaption>{props.art.description}</figcaption>
        </figure>
      </article>
    </main>
  );
};
