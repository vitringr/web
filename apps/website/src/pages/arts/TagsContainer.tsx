import { For } from "solid-js";
import { ArtTagFields, ArtTagNames, artTags } from "./art-tags";

import css from "./TagsContainer.module.css";

const Tag = (props: ArtTagFields) => {
  return (
    <div
      class={css.tag}
      style={{ "background-color": props.color, color: props.fontColor }}
    >
      {props.label}
    </div>
  );
};

export const TagsContainer = (props: { tags: ArtTagNames[] }) => {
  return (
    <div class={css.wrapper}>
      <div class={css.tags_container}>
        <For each={props.tags}>
          {(tagName) => {
            const tag = artTags[tagName];
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
