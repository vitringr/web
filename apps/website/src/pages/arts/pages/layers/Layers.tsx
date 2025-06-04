import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const Layers = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.WebGL.Layers.main(canvasRef);
  });

  return (
    <article>
      <h1>Layers</h1>
      <canvas ref={canvasRef} />
      <p>Description of Layers.</p>
    </article>
  );
};
