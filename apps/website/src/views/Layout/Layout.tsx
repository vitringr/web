import { type ParentProps } from "solid-js";

import { Navigation } from "../Navigation/Navigation";
import { Footer } from "../Footer/Footer";

import css from "./Layout.module.css";

export const Layout = (props: ParentProps) => (
  <div class={css.layout}>
    <Navigation />
    <main class={css.main}>{props.children}</main>
    <Footer />
  </div>
);
