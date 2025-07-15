import { Creative } from "@packages/creative";
import { ArtPage } from "../ArtPage";

export const Anger = () => {
  return ArtPage({
    title: "Anger",
    artMain: Creative.WebGL.Anger.main,
    artConfig: { width: 600, height: 600 },
    description: "Dalsdna KEKEKEKe beae idnas dj",
  });
};

// export const Anger = () => {
//   let canvasRef: HTMLCanvasElement | undefined;
//
//   onMount(() => {
//     if (!canvasRef) throw "Invalid canvasRef";
//     Creative.WebGL.Anger.main(canvasRef, {canvasWidth: 600, canvasHeight: 600});
//   });
//
//   return (
//     <article>
//       <canvas ref={canvasRef} />
//       <p>Description of Anger.</p>
//     </article>
//   );
// };
