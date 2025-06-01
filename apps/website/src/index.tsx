/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import { Layout } from "./views/layout/Layout";

import { Home } from "./pages/home/Home";
import { Guides } from "./pages/guides/Guides";
import { ValueNoise } from "./pages/guides/pages/value-noise/ValueNoise";
import { SimplexNoise } from "./pages/guides/pages/simplex-noise/SimplexNoise";
import { PerlinNoise } from "./pages/guides/pages/perlin-noise/PerlinNoise";
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

    <Route path="/guides">
      <Route path="/" component={Guides} />
      <Route path="/value-noise" component={ValueNoise} />
      <Route path="/perlin-noise" component={PerlinNoise} />
      <Route path="/simplex-noise" component={SimplexNoise} />
    </Route>

    <Route path="/art" component={Art} />

    <Route path="/writing" component={Writing} />

    <Route path="/about" component={About} />

    <Route path="*404" component={NotFound} />
  </Router>
);

render(AppRouter, root);
