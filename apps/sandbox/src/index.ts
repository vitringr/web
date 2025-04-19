// import { QuadtreeSimulation } from "@packages/quadtree-simulation";
// import { EasingFunctions } from "@packages/easing-functions";
// import { LearningNoise } from "@packages/learning-noise";
// import { Pathfinder } from "@packages/pathfinder";
// import { Tsunagari } from "@packages/tsunagari";
import { Test } from "@packages/test";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

// QuadtreeSimulation.main(canvas)
// EasingFunctions.main(canvas);
// LearningNoise.main(canvas);
// Pathfinder.main(canvas);
// Tsunagari.main(canvas);
Test.main(canvas);
