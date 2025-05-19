// import { QuadtreeSimulation } from "@packages/quadtree-simulation";
// import { EasingFunctions } from "@packages/easing-functions";
// import { LearningNoise } from "@packages/learning-noise";
// import { Pathfinder } from "@packages/pathfinder";
// import { Tsunagari } from "@packages/tsunagari";
// import { Test } from "@packages/test";

import { noise } from "@utilities/noise";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

const context = canvas.getContext("2d");

canvas.style.border = "1px solid red";

canvas.width = canvas.height = 600;

if (!context) throw "No context";

const scale = 0.003;

for (let x = 0; x < 600; x++) {
  for (let y = 0; y < 600; y++) {
    const value = noise(x * scale, y * scale);

    context.fillStyle = `rgb(0, ${value * 0xff}, 0)`;
    context.fillRect(x, y, 1, 1);
  }
}

// QuadtreeSimulation.main(canvas)
// EasingFunctions.main(canvas);
// LearningNoise.main(canvas);
// Pathfinder.main(canvas);
// Tsunagari.main(canvas);
// Test.main(canvas);
