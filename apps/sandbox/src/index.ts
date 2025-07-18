import { Creative } from "@packages/creative";
import { Test } from "@packages/test";
import { Test2 } from "@packages/test2";
import { Test3 } from "@packages/test3";
import { Test4 } from "@packages/test4";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

Test4.main(canvas);
