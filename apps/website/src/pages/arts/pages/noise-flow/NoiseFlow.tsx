import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const NoiseFlow = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.WebGL.NoiseFlow.main(canvasRef);
  });

  return (
    <article>
      <h1>NoiseFlow</h1>
      <canvas ref={canvasRef} />
      <p>Description of NoiseFlow.</p>
    </article>
  );
};
