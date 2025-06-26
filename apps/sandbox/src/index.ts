import { Creative } from "@packages/creative";
import { NoiseHTML } from "@packages/noise-html";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

NoiseHTML.main(canvas);
// Creative.Canvas2D.NoiseVectorField.main(canvas);
