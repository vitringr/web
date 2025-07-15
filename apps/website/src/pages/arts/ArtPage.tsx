import { onMount } from "solid-js";

import css from "./ArtPage.module.css";

// Additional stuff, like implementation guide and whatnot should be
// added as Components to the ArtPage props.

interface ArtPageProps<T extends {}> {
  title: string;
  description: string;
  artMain: (canvas: HTMLCanvasElement, settings?: Partial<T>) => void;
  artConfig?: Partial<T>;
}

export const ArtPage = <T extends {}>(props: ArtPageProps<T>) => {
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
