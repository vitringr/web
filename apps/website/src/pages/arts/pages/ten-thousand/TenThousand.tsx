import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const TenThousand = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.WebGL.TenThousand.main(canvasRef);
  });

  return (
    <article>
      <h1>Ten Thousand</h1>
      <canvas ref={canvasRef} />
      <p>Description of Ten Thousand.</p>
    </article>
  );
};
