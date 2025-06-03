/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import { Layout } from "./views/layout/Layout";

import { Home } from "./pages/home/Home";
import { Guides } from "./pages/guides/Guides";
import { ValueNoise } from "./pages/guides/pages/value-noise/ValueNoise";
import { SimplexNoise } from "./pages/guides/pages/simplex-noise/SimplexNoise";
import { PerlinNoise } from "./pages/guides/pages/perlin-noise/PerlinNoise";
import { Arts } from "./pages/arts/Arts";
import { TheSeer } from "./pages/arts/pages/the-seer/TheSeer";
import { Noise2D } from "./pages/arts/pages/noise-2d/Noise2D";
import { NoiseLoop } from "./pages/arts/pages/noise-loop/NoiseLoop";
import { Writing } from "./pages/writing/Writing";
import { About } from "./pages/about/About";
import { Contact } from "./pages/contact/Contact";
import { NotFound } from "./pages/not-found/NotFound";

import "./styles/reset.css";
import "./styles/style.css";
import "./styles/page.css";

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

    <Route path="/arts">
      <Route path="/" component={Arts} />
      <Route path="/the-seer" component={TheSeer} />
      <Route path="/noise-2d" component={Noise2D} />
      <Route path="/noise-loop" component={NoiseLoop} />
    </Route>

    <Route path="/writing" component={Writing} />

    <Route path="/about" component={About} />

    <Route path="/contact" component={Contact} />

    <Route path="*404" component={NotFound} />
  </Router>
);

render(AppRouter, root);
