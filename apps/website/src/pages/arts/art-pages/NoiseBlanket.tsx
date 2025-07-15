import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const NoiseBlanket = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.Canvas2D.NoiseBlanket.main(canvasRef);
  });

  return (
    <article>
      <h1>NoiseBlanket</h1>
      <canvas ref={canvasRef} />
      <p>Description of NoiseBlanket.</p>
    </article>
  );
};
