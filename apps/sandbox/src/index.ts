import { QuadtreeSimulation } from "@packages/quadtree-simulation";
// import { Tsunagari } from "@packages/tsunagari";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

QuadtreeSimulation.main(canvas)
// Tsunagari.main(canvas);
