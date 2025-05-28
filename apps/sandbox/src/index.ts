import { Creative } from "@packages/creative";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

Creative.Canvas2D.Noise2D.main(canvas);
