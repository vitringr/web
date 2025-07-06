import { Creative } from "@packages/creative";
import { LearningSDF } from "@packages/learning-sdf";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

LearningSDF.New.main(canvas);
