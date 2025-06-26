import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const NoiseRainbow = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.Canvas2D.NoiseRainbow.main(canvasRef);
  });

  return (
    <article>
      <h1>NoiseRainbow</h1>
      <canvas style={{filter: "blur(4px)"}} ref={canvasRef} />
      <p>Description of NoiseRainbow.</p>
    </article>
  );
};
