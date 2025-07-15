import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const SystemShock = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.Canvas2D.SystemShock.main(canvasRef);
  });

  return (
    <article>
      <canvas ref={canvasRef} />
      <p>Description of SystemShock.</p>
    </article>
  );
};
