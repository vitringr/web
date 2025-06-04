/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import { Routes } from "./routes";

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
import { NoiseVectorField } from "./pages/arts/pages/noise-vector-field/NoiseVectorField";
import { Writing } from "./pages/writing/Writing";
import { About } from "./pages/about/About";
import { Contact } from "./pages/contact/Contact";
import { NotFound } from "./pages/not-found/NotFound";

import "./styles/reset.css";
import "./styles/style.css";

const root = document.getElementById("root");
if (!root) throw "Invalid #root HTML element!";

const AppRouter = () => (
  <Router root={Layout}>
    <Route path={Routes.home.page} component={Home} />

    <Route path={Routes.guides.page}>
      <Route path="/" component={Guides} />
      <Route path={Routes.guides.valueNoise} component={ValueNoise} />
      <Route path={Routes.guides.perlinNoise} component={PerlinNoise} />
      <Route path={Routes.guides.simplexNoise} component={SimplexNoise} />
    </Route>

    <Route path={Routes.arts.page}>
      <Route path="/" component={Arts} />
      <Route path={Routes.arts.theSeer} component={TheSeer} />
      <Route path={Routes.arts.noise2D} component={Noise2D} />
      <Route path={Routes.arts.noiseLoop} component={NoiseLoop} />
      <Route path={Routes.arts.noiseVectorField} component={NoiseVectorField} />
    </Route>

    <Route path={Routes.writing.page} component={Writing} />

    <Route path={Routes.about.page} component={About} />

    <Route path={Routes.contact.page} component={Contact} />

    <Route path="*404" component={NotFound} />
  </Router>
);

render(AppRouter, root);
