import { Creative } from "@packages/creative";
import { ArtPage } from "../ArtPage";

export const BlockCellularSand = () => {
  return ArtPage({
    title: "Block Cellular Sand",
    artMain: Creative.WebGL.BlockCellularAutomata.main,
    artConfig: { canvasWidth: 800, canvasHeight: 800 },
    description: "Dalsdna KEKEKEKe beae idnas dj",
  });
};
