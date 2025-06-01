import { A } from "@solidjs/router";

import css from "./Navigation.module.css";

export const Navigation = () => {
  return (
    <nav class={css.nav}>
      <p>Navigation text</p>
      <A href="/" activeClass="" inactiveClass="">
        Home
      </A>
      <A href="/about">About</A>
      <A href="/art">Art</A>
      <A href="/kek">Kek</A>
    </nav>
  );
};
