export enum ArtTagNames {
  "2D",
  "3D",
  Input,
  GPU,
  Noise,
  Particles,
  Image,
  Pathfinding,
  Collision,
  Random,
  ASCII
}

export type ArtTagFields = {
  label: string;
  color: string;
  fontColor: string;
};

export const artTags: Record<ArtTagNames, ArtTagFields> = {
  [ArtTagNames["2D"]]: {
    label: "2D",
    color: "#118888",
    fontColor: "#FFFFFF",
  },
  [ArtTagNames["3D"]]: {
    label: "3D",
    color: "#118888",
    fontColor: "#FFFFFF",
  },
  [ArtTagNames.Input]: {
    label: "Input",
    color: "#11A011",
    fontColor: "#FFFFFF",
  },
  [ArtTagNames.GPU]: {
    label: "GPU",
    color: "#DD1111",
    fontColor: "#FFFFFF",
  },
  [ArtTagNames.Noise]: {
    label: "Noise",
    color: "#A08070",
    fontColor: "#FFFFFF",
  },
  [ArtTagNames.Particles]: {
    label: "Particles",
    color: "#AA11AA",
    fontColor: "#FFFFFF",
  },
  [ArtTagNames.Image]: {
    label: "Image",
    color: "#D56065",
    fontColor: "#FFFFFF",
  },
  [ArtTagNames.Pathfinding]: {
    label: "Pathfinding",
    color: "#2040B1",
    fontColor: "#FFFFFF",
  },
  [ArtTagNames.Collision]: {
    label: "Collision",
    color: "#9163F2",
    fontColor: "#FFFFFF",
  },
  [ArtTagNames.Random]: {
    label: "Random",
    color: "#6E915F",
    fontColor: "#FFFFFF",
  },
  [ArtTagNames.ASCII]: {
    label: "ASCII",
    color: "#666666",
    fontColor: "#FFFFFF",
  },
};
