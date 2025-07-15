import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const Regeneration = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.WebGL.Regeneration.main(canvasRef);
  });

  return (
    <article>
      <h1>Regeneration</h1>
      <canvas ref={canvasRef} />
      <p>Description of Regeneration.</p>
    </article>
  );
};
