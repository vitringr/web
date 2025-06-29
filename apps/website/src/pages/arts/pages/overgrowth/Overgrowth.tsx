import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const Overgrowth = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.Canvas2D.Overgrowth.main(canvasRef);
  });

  return (
    <article>
      <h1>Overgrowth</h1>
      <canvas ref={canvasRef} />
      <p>Description of Overgrowth.</p>
    </article>
  );
};
