import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const BlockCellularSand = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.WebGL.BlockCellularAutomata.main(canvasRef);
  });

  return (
    <article>
      <h1>BlockCellularSand</h1>
      <canvas ref={canvasRef} />
      <p>Description of BlockCellularSand.</p>
    </article>
  );
};
