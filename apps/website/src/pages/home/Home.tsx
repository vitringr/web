// import { onMount } from "solid-js";

export const Home = () => {
  let canvasRef!: HTMLCanvasElement;

  // onMount(() => {
  //   new Layers(canvasRef).init()
  // });

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};
