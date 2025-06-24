import { Creative } from "@packages/creative";
import { Test } from "@packages/test";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

// Test.main(canvas);
Creative.Canvas2D.NoiseRainbow.main(canvas);
