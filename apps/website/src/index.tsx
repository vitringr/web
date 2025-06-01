/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import { Layout } from "./views/Layout/Layout";

import { Home } from "./pages/home/Home";
import { Guides } from "./pages/guides/Guides";
import { Art } from "./pages/art/Art";
import { Writing } from "./pages/writing/Writing";
import { About } from "./pages/about/About";
import { NotFound } from "./pages/not-found/NotFound";

import "./styles/reset.css";
import "./styles/style.css";

const root = document.getElementById("root");
if (!root) throw "Invalid #root HTML element!";

const AppRouter = () => (
  <Router root={Layout}>
    <Route path="/" component={Home} />
    <Route path="/guides" component={Guides} />
    <Route path="/art" component={Art} />
    <Route path="/writing" component={Writing} />
    <Route path="/about" component={About} />
    <Route path="*404" component={NotFound} />
  </Router>
);

render(AppRouter, root);
