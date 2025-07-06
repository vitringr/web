import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const Anger = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.WebGL.Anger.main(canvasRef);
  });

  return (
    <article>
      <canvas ref={canvasRef} />
      <p>Description of Anger.</p>
    </article>
  );
};
