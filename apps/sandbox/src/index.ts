// import { Test } from "@packages/test";
import { Creative } from "@packages/creative";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

// Test.main(canvas);

Creative.NoiseVectorField.main(canvas);
