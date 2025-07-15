import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const NoiseVectorField = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.Canvas2D.NoiseVectorField.main(canvasRef);
  });

  return (
    <article>
      <h1>NoiseVectorField</h1>
      <canvas ref={canvasRef} />
      <p>Description of NoiseVectorField.</p>
    </article>
  );
};
