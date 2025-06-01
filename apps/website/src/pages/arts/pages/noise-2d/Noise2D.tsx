import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const Noise2D = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.Canvas2D.Noise2D.main(canvasRef);
  });

  return (
    <article>
      <h1>Noise2D</h1>
      <canvas ref={canvasRef} />
      <p>Description of Noise2D.</p>
    </article>
  );
};
