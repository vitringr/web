import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const NoiseLoop = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.Canvas2D.NoiseLoop.main(canvasRef);
  });

  return (
    <article>
      <h1>NoiseLoop</h1>
      <canvas ref={canvasRef} />
      <p>Description of NoiseLoop.</p>
    </article>
  );
};
