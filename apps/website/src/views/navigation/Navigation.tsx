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
      <A href={Routes.home.page}>Home</A>
      <A href={Routes.guides.page}>Guides</A>
      <A href={Routes.arts.page}>Arts</A>
      <A href={Routes.writing.page}>Writing</A>
      <A href={Routes.about.page}>About</A>
      <A href={Routes.contact.page}>Contact</A>
    </nav>
  );
};
