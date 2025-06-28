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
import { RandomWalkers } from "./pages/arts/pages/random-walkers/RandomWalkers";
import { Noise2D } from "./pages/arts/pages/noise-2d/Noise2D";
import { NoiseFlow } from "./pages/arts/pages/noise-flow/NoiseFlow";
import { NoiseLoop } from "./pages/arts/pages/noise-loop/NoiseLoop";
import { NoiseVectorField } from "./pages/arts/pages/noise-vector-field/NoiseVectorField";
import { NoiseRainbow } from "./pages/arts/pages/noise-rainbow/NoiseRainbow";
import { Regeneration } from "./pages/arts/pages/regeneration/Regeneration";
import { TenThousand } from "./pages/arts/pages/ten-thousand/TenThousand";
import { Layers } from "./pages/arts/pages/layers/Layers";
import { Godfather } from "./pages/arts/pages/godfather/Godfather";
import { BlockCellularSand } from "./pages/arts/pages/block-cellular-sand/BlockCellularSand";

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
    <Route path={Routes.root.home} component={Home} />

    <Route path={Routes.root.guides}>
      <Route path="/" component={Guides} />
      <Route path={Routes.guides.valueNoise} component={ValueNoise} />
      <Route path={Routes.guides.perlinNoise} component={PerlinNoise} />
      <Route path={Routes.guides.simplexNoise} component={SimplexNoise} />
    </Route>

    <Route path={Routes.root.arts}>
      <Route path="/" component={Arts} />
      <Route path={Routes.arts.theSeer} component={TheSeer} />
      <Route path={Routes.arts.randomWalkers} component={RandomWalkers} />
      <Route path={Routes.arts.noise2D} component={Noise2D} />
      <Route path={Routes.arts.noiseFlow} component={NoiseFlow} />
      <Route path={Routes.arts.noiseLoop} component={NoiseLoop} />
      <Route path={Routes.arts.noiseVectorField} component={NoiseVectorField} />
      <Route path={Routes.arts.noiseRainbow} component={NoiseRainbow} />
      <Route path={Routes.arts.regeneration} component={Regeneration} />
      <Route path={Routes.arts.tenThousand} component={TenThousand} />
      <Route path={Routes.arts.layers} component={Layers} />
      <Route path={Routes.arts.godfather} component={Godfather} />
      <Route
        path={Routes.arts.blockCellularSand}
        component={BlockCellularSand}
      />
    </Route>

    <Route path={Routes.root.writing} component={Writing} />

    <Route path={Routes.root.about} component={About} />

    <Route path={Routes.root.contact} component={Contact} />

    <Route path={Routes.root.notFound} component={NotFound} />
  </Router>
);

render(AppRouter, root);
