import { onMount } from "solid-js";
import { Creative } from "@packages/creative";

export const Art = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) throw "Invalid canvasRef";
    Creative.Canvas2D.TheSeer.main(canvasRef);
  });

  return (
    <>
      <p>Art page text</p>
      <canvas ref={canvasRef} />
    </>
  );
};
