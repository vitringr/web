import { A } from "@solidjs/router";

import css from "./Navigation.module.css";
import { Routes } from "../../routes";

// TODO: Research:
// <A href="/" activeClass="" inactiveClass="">

// WIP: Either Vitringr <h1> title, or just Home without the <h1>.

// WIP: Maybe <header> with <h1> title for Vitringr here, on in home page.

export const Navigation = () => {
  return (
    <nav class={css.nav}>
      <A href={Routes.root.home}>Home</A>
      <A href={Routes.root.guides}>Guides</A>
      <A href={Routes.root.arts}>Arts</A>
      <A href={Routes.root.writing}>Writing</A>
      <A href={Routes.root.about}>About</A>
      <A href={Routes.root.contact}>Contact</A>
    </nav>
  );
};
