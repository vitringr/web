import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const Sparks = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.Canvas2D.Sparks.main(canvasRef);
  });

  return (
    <article>
      <h1>Sparks</h1>
      <canvas ref={canvasRef} />
      <p>Description of Sparks.</p>
    </article>
  );
};
