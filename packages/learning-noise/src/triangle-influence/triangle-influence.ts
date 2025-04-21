/*

For ease of development and prototyping, the things
that are only meant for visualization and rendering
purposes are prefixed by an "_" character.

*/

import { Mathematics } from "@utilities/mathematics";
import { Canvas2D } from "@utilities/canvas2d";
import { Vector2 } from "@utilities/vector";
import { Colors } from "@utilities/colors";
import { Config } from "./config";

const influenceRadius = Mathematics.COS_45;
const influenceRadiusSquared = 0.5;

const A = new Vector2(0, 0);
const B = new Vector2(Mathematics.COS_60, -Mathematics.SIN_60);
const C = new Vector2(1, 0);

const centroid = new Vector2((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3);

const target = new Vector2(100, 100);

// ------------
// -- Render --
// ------------

let _targetColor = "#000000";
const _target = Vector2.zero();
const _offset = new Vector2(Config.xOffset, Config.yOffset);
const _influenceRadius = influenceRadius * Config.upscale;
const _A = A.clone().scale(Config.upscale).add(_offset);
const _B = B.clone().scale(Config.upscale).add(_offset);
const _C = C.clone().scale(Config.upscale).add(_offset);
const _centroid = centroid.clone().scale(Config.upscale).add(_offset);
const _AB = new Vector2(-Mathematics.COS_60, -Mathematics.SIN_60)
  .scale(Config.upscale)
  .add(_offset);
const _BC = new Vector2(1 + Mathematics.COS_60, -Mathematics.SIN_60)
  .scale(Config.upscale)
  .add(_offset);
const _AC = new Vector2(Mathematics.COS_60, Mathematics.SIN_60).scale(Config.upscale).add(_offset);

function background(context: CanvasRenderingContext2D) {
  context.fillStyle = Config.background;
  context.fillRect(0, 0, Config.width, Config.width);
}

function renderTriangle(context: CanvasRenderingContext2D) {
  context.strokeStyle = Config.triangleEdgeColor;
  context.lineWidth = Config.triangleEdgeWidth;
  Canvas2D.triangle(context, _A.x, _A.y, _B.x, _B.y, _C.x, _C.y);
}

function renderLattice(context: CanvasRenderingContext2D) {
  context.lineWidth = Config.latticeLineWidth;

  Canvas2D.hex(context, _A.x, _A.y, Config.upscale, true);
  Canvas2D.hex(context, _B.x, _B.y, Config.upscale, true);
  Canvas2D.hex(context, _C.x, _C.y, Config.upscale, true);

  Canvas2D.hex(context, _AB.x, _AB.y, Config.upscale, true);
  Canvas2D.hex(context, _BC.x, _BC.y, Config.upscale, true);
  Canvas2D.hex(context, _AC.x, _AC.y, Config.upscale, true);
}

function renderVertices(context: CanvasRenderingContext2D) {
  context.strokeStyle = Config.triangleEdgeColor;

  context.fillStyle = Config.colors.red;
  Canvas2D.circleFill(context, _A.x, _A.y, Config.vertexRadius);
  Canvas2D.circle(context, _A.x, _A.y, Config.vertexRadius);

  context.fillStyle = Config.colors.green;
  Canvas2D.circleFill(context, _B.x, _B.y, Config.vertexRadius);
  Canvas2D.circle(context, _B.x, _B.y, Config.vertexRadius);

  context.fillStyle = Config.colors.blue;
  Canvas2D.circleFill(context, _C.x, _C.y, Config.vertexRadius);
  Canvas2D.circle(context, _C.x, _C.y, Config.vertexRadius);
}

function renderCentroid(context: CanvasRenderingContext2D) {
  context.fillStyle = Config.triangleEdgeColor;
  Canvas2D.circleFill(context, _centroid.x, _centroid.y, Config.centroidRadius);
}

function renderInfluence(context: CanvasRenderingContext2D) {
  context.lineWidth = Config.influenceRadiusWidth;

  /*

  Since the influence radius is `~0.707`, the squared influence radius is `0.5`.
  When the distance squared to the target is above `0.5`, then it is outside of
  that radius, therefore too far away. The influence is then zero or less.

  This is why you can just compute `(0.5 - distanceSquared)`. Since the max range
  of that is `0.5`, multiply by `2` to have the values in the range `(0, 1]`.

  */

  const aDistanceSquared = Vector2.distanceSquared(A, target);
  const aInfluence = Math.max(0, (influenceRadiusSquared - aDistanceSquared) * 2);

  const bDistanceSquared = Vector2.distanceSquared(B, target);
  const bInfluence = Math.max(0, (influenceRadiusSquared - bDistanceSquared) * 2);

  const cDistanceSquared = Vector2.distanceSquared(C, target);
  const cInfluence = Math.max(0, (influenceRadiusSquared - cDistanceSquared) * 2);

  const _aGradient = context.createRadialGradient(_A.x, _A.y, 0, _A.x, _A.y, _influenceRadius);
  _aGradient.addColorStop(0, Colors.getRGBA(Config.influenceBrightness, 0, 0, aInfluence));
  _aGradient.addColorStop(1, Colors.getRGBA(Config.influenceBrightness, 0, 0, 0));

  const _bGradient = context.createRadialGradient(_B.x, _B.y, 0, _B.x, _B.y, _influenceRadius);
  _bGradient.addColorStop(0, Colors.getRGBA(0, Config.influenceBrightness, 0, bInfluence));
  _bGradient.addColorStop(1, Colors.getRGBA(0, Config.influenceBrightness, 0, 0));

  const _cGradient = context.createRadialGradient(_C.x, _C.y, 0, _C.x, _C.y, _influenceRadius);
  _cGradient.addColorStop(0, Colors.getRGBA(0, 0.2, Config.influenceBrightness, cInfluence));
  _cGradient.addColorStop(1, Colors.getRGBA(0, 0.2, Config.influenceBrightness, 0));

  context.fillStyle = _aGradient;
  Canvas2D.circleFill(context, _A.x, _A.y, _influenceRadius);
  context.fillStyle = _bGradient;
  Canvas2D.circleFill(context, _B.x, _B.y, _influenceRadius);
  context.fillStyle = _cGradient;
  Canvas2D.circleFill(context, _C.x, _C.y, _influenceRadius);

  context.strokeStyle = Config.colors.red;
  Canvas2D.circle(context, _A.x, _A.y, _influenceRadius);
  context.strokeStyle = Config.colors.green;
  Canvas2D.circle(context, _B.x, _B.y, _influenceRadius);
  context.strokeStyle = Config.colors.blue;
  Canvas2D.circle(context, _C.x, _C.y, _influenceRadius);

  _targetColor = Colors.getRGB(aInfluence, bInfluence + 0.2 * cInfluence, cInfluence);
}

function renderTarget(context: CanvasRenderingContext2D) {
  context.fillStyle = _targetColor;
  Canvas2D.circleFill(context, _target.x, _target.y, Config.pointerRadius);
}

// ----------
// -- Main --
// ----------

function setupInput(canvas: HTMLCanvasElement) {
  const bounds = canvas.getBoundingClientRect();
  canvas.addEventListener("pointermove", (event: PointerEvent) => {
    _target.x = event.clientX - bounds.left;
    _target.y = event.clientY - bounds.top;

    target
      .copy(_target)
      .subtract(_offset)
      .scale(1 / Config.upscale);
  });
}

export function triangleInfluence(context: CanvasRenderingContext2D) {
  setupInput(context.canvas);

  const loop = () => {
    background(context);

    renderLattice(context);
    renderInfluence(context);
    renderTriangle(context);
    renderVertices(context);
    renderCentroid(context);

    renderTarget(context);
    requestAnimationFrame(loop);
  };

  loop();
}
