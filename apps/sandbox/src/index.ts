import { Creative } from "@packages/creative";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

Creative.Canvas2D.Weave.main(canvas, {
  canvasSize: 900,
  gridSize: 450,
  pins: 500,
  resetVisitsAfter: 200,
  stopAfter: 30_000,
  colors: {
    background: "#EEEED0",
    lines: "#00000032",
  }
});
