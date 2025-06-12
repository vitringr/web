import { For } from "solid-js";

import css from "./Tags.module.css";

export enum TagNames {
  "2D",
  "3D",
  Canvas,
  Input,
  Noise,
  GPU,
  Particles,
  Image,
  Draw,
  Pathfinding,
  Collision,
}

type TagData = {
  label: string;
  color: string;
  fontColor: string;
};

const tags: Record<TagNames, TagData> = {
  [TagNames["2D"]]: {
    label: "2D",
    color: "#118888",
    fontColor: "#FFFFFF",
  },
  [TagNames["3D"]]: {
    label: "3D",
    color: "#118888",
    fontColor: "#FFFFFF",
  },
  [TagNames.Canvas]: {
    label: "Canvas",
    color: "#BB9911",
    fontColor: "#FFFFFF",
  },
  [TagNames.Input]: {
    label: "Input",
    color: "#11A011",
    fontColor: "#FFFFFF",
  },
  [TagNames.Noise]: {
    label: "Noise",
    color: "#A08070",
    fontColor: "#FFFFFF",
  },
  [TagNames.GPU]: {
    label: "GPU",
    color: "#DD1111",
    fontColor: "#FFFFFF",
  },
  [TagNames.Particles]: {
    label: "Particles",
    color: "#AA11AA",
    fontColor: "#FFFFFF",
  },
  [TagNames.Image]: {
    label: "Image",
    color: "#D56065",
    fontColor: "#FFFFFF",
  },
  [TagNames.Draw]: {
    label: "Draw",
    color: "#AA7211",
    fontColor: "#FFFFFF",
  },
  [TagNames.Pathfinding]: {
    label: "Pathfinding",
    color: "#2040B1",
    fontColor: "#FFFFFF",
  },
  [TagNames.Collision]: {
    label: "Collision",
    color: "#9163F2",
    fontColor: "#FFFFFF",
  },
};

const Tag = (props: TagData) => {
  return (
    <div
      class={css.tag}
      style={{ "background-color": props.color, color: props.fontColor }}
    >
      {props.label}
    </div>
  );
};

export const TagsContainer = (props: { tags: TagNames[] }) => {
  return (
    <div class={css.wrapper}>
      <div class={css.tags_container}>
        <For each={props.tags}>
          {(tagName) => {
            const tag = tags[tagName];
            if (tag) {
              return (
                <Tag
                  color={tag.color}
                  fontColor={tag.fontColor}
                  label={tag.label}
                />
              );
            }
          }}
        </For>
      </div>
    </div>
  );
};
