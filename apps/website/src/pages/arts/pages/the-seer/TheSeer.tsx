import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const TheSeer = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.Canvas2D.TheSeer.main(canvasRef);
  });

  return (
    <article>
      <h1>TheSeer</h1>
      <canvas ref={canvasRef} />
      <p>Description of TheSeer.</p>
    </article>
  );
};
