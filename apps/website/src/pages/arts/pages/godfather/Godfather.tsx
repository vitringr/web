import { onMount } from "solid-js";

import { Creative } from "@packages/creative";

export const Godfather = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.WebGL.Godfather.main(canvasRef);
  });

  return (
    <article>
      <h1>Godfather</h1>
      <canvas ref={canvasRef} />
      <p>Description of Godfather.</p>
    </article>
  );
};
