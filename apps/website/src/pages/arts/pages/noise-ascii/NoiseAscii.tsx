import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const NoiseAscii = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.Canvas2D.NoiseAscii.main(canvasRef);
  });

  return (
    <article>
      <h1>NoiseAscii</h1>
      <canvas ref={canvasRef} />
      <p>Description of NoiseAscii.</p>
    </article>
  );
};
