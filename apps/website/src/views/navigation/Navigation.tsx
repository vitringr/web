import { A } from "@solidjs/router";

import css from "./Navigation.module.css";

// TODO: Research:
// <A href="/" activeClass="" inactiveClass="">

// WIP: Either Vitringr <h1> title, or just Home without the <h1>.

// WIP: Maybe <header> with <h1> title for Vitringr here, on in home page.

export const Navigation = () => {
  return (
    <nav class={css.nav}>
      <A href="/">Home</A>
      <A href="/guides">Guides</A>
      <A href="/arts">Arts</A>
      <A href="/writing">Writing</A>
      <A href="/about">About</A>
      <A href="/contact">Contact</A>
    </nav>
  );
};
