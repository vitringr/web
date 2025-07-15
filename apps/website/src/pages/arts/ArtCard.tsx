import { A } from "@solidjs/router";

import { Routes } from "../../routes";
import { TagNames, TagsContainer } from "./Tags";

import css from "./ArtCard.module.css";

export interface ArtCardProps {
  title: string;
  route: string;
  thumbnail: string;
  tags: TagNames[];
}

export const ArtCard = (props: ArtCardProps) => {
  return (
    <div class={css.card}>
      <A class={css.link} href={Routes.root.arts + props.route}>
        <div class={css.image_container}>
          <img class={css.image} src={props.thumbnail} />
        </div>

        <h2 class={css.title}>{props.title}</h2>

        <TagsContainer tags={props.tags} />
      </A>
    </div>
  );
};
