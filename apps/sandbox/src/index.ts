import { Pathfinder } from "@packages/pathfinder";
// import { Tsunagari } from "@packages/tsunagari";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

// Tsunagari.main(canvas);
Pathfinder.main(canvas);
