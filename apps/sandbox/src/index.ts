import { Creative } from "@packages/creative";
import { LearningNoise } from "@packages/learning-noise";
import { LearningSDF } from "@packages/learning-sdf";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

// LearningNoise.PerlinNoise.main(canvas)
Creative.Canvas2D.New.main(canvas)
