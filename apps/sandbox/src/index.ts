import { Creative } from "@packages/creative";
import { Test } from "@packages/test";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

Creative.Canvas2D.TheSeer.main(canvas);
// Test.main(canvas);
