import { Creative } from "@packages/creative";
import { ArtPage } from "../ArtPage";
import { artData } from "../art-data/art-data";

export const BlockCellularSand = () => {
  // return ArtPage({
  //   title: "Block Cellular Sand",
  //   artMain: Creative.WebGL.BlockCellularAutomata.main,
  //   artConfig: { canvasWidth: 800, canvasHeight: 800 },
  //   description: "Dalsdna KEKEKEKe beae idnas dj",
  // });
  return ArtPage(artData[2]);
};
