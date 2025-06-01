import { A } from "@solidjs/router";

import css from "./Navigation.module.css";

// TODO: Research:
// <A href="/" activeClass="" inactiveClass="">

// WIP: Either Vitringr <h1> title, or just Home without the <h1>

export const Navigation = () => {
  return (
    <nav class={css.nav}>
      <A href="/" class={css.logo}>
        <h1>Vitringr</h1>
      </A>
      <A href="/guides">Guides</A>
      <A href="/art">Art</A>
      <A href="/writing">Writing</A>
      <A href="/about">About</A>
    </nav>
  );
};
