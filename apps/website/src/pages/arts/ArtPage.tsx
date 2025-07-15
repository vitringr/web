import { onMount } from "solid-js";
import { ArtData } from "./art-data/art-data";

import css from "./ArtPage.module.css";

// Additional stuff, like implementation guide and whatnot should be
// added as Components to the ArtPage props.

export const ArtPage = (props: ArtData<any>) => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    props.artMain(canvasRef, props.artConfig);
  });

  // TODO: onCleanup

  return (
    <main>
      <article>
        <h1>{props.title}</h1>

        <figure>
          <canvas ref={canvasRef} />
          <figcaption>{props.description}</figcaption>
        </figure>
      </article>
    </main>
  );
};
