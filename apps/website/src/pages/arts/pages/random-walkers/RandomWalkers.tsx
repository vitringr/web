import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const RandomWalkers = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.Canvas2D.RandomWalkers.main(canvasRef);
  });

  return (
    <article>
      <h1>RandomWalkers</h1>
      <canvas ref={canvasRef} />
      <p>Description of RandomWalkers.</p>
    </article>
  );
};
