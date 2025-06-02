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
    color: "#11AA11",
    fontColor: "#FFFFFF",
  },
  [TagNames.Noise]: {
    label: "Noise",
    color: "#A08070",
    fontColor: "#FFFFFF",
  },
  [TagNames.GPU]: {
    label: "GPU",
    color: "#AA1111",
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
};

const Tag = (props: TagData) => {
  return (
    <span
      class={css.tag}
      style={{ "background-color": props.color, color: props.fontColor }}
    >
      {props.label}
    </span>
  );
};

export const TagsContainer = (props: { tags: TagNames[] }) => {
  return (
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
  );
};
