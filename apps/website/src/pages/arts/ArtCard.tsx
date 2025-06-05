import { A } from "@solidjs/router";

import { Routes } from "../../routes";
import { TagNames, TagsContainer } from "./Tags";

import css from "./ArtCard.module.css";

export const ArtCard = (props: {
  title: string;
  route: string;
  image: string;
  tags: TagNames[];
}) => {
  return (
    <div class={css.card}>
      <A class={css.link} href={Routes.root.arts + props.route}>
        <div class={css.image_container}>
          <img class={css.image} src={props.image} />
          <div class={css.tags_overlay}>
            <TagsContainer tags={props.tags} />
          </div>
        </div>
        <h2 class={css.title}>{props.title}</h2>
      </A>
    </div>
  );
};
