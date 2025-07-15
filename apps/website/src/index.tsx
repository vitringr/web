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
import { TheSeer } from "./pages/arts/art-pages/TheSeer";
import { SystemShock } from "./pages/arts/art-pages/SystemShock";
import { Anger } from "./pages/arts/art-pages/Anger";
import { Sparks } from "./pages/arts/art-pages/Sparks";
import { Overgrowth } from "./pages/arts/art-pages/Overgrowth";
import { RandomWalkers } from "./pages/arts/art-pages/RandomWalkers";
import { Noise2D } from "./pages/arts/art-pages/Noise2D";
import { NoiseFlow } from "./pages/arts/art-pages/NoiseFlow";
import { NoiseLoop } from "./pages/arts/art-pages/NoiseLoop";
import { NoiseVectorField } from "./pages/arts/art-pages/NoiseVectorField";
import { NoiseBlanket } from "./pages/arts/art-pages/NoiseBlanket";
import { NoiseAscii } from "./pages/arts/art-pages/NoiseAscii";
import { NoiseRainbow } from "./pages/arts/art-pages/NoiseRainbow";
import { Regeneration } from "./pages/arts/art-pages/Regeneration";
import { TenThousand } from "./pages/arts/art-pages/TenThousand";
import { Layers } from "./pages/arts/art-pages/Layers";
import { BlockCellularSand } from "./pages/arts/art-pages/BlockCellularSand";

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
      <Route path={Routes.arts.systemShock} component={SystemShock} />
      <Route path={Routes.arts.anger} component={Anger} />
      <Route path={Routes.arts.sparks} component={Sparks} />
      <Route path={Routes.arts.overgrowth} component={Overgrowth} />
      <Route path={Routes.arts.randomWalkers} component={RandomWalkers} />
      <Route path={Routes.arts.noise2D} component={Noise2D} />
      <Route path={Routes.arts.noiseFlow} component={NoiseFlow} />
      <Route path={Routes.arts.noiseLoop} component={NoiseLoop} />
      <Route path={Routes.arts.noiseVectorField} component={NoiseVectorField} />
      <Route path={Routes.arts.noiseBlanket} component={NoiseBlanket} />
      <Route path={Routes.arts.noiseAscii} component={NoiseAscii} />
      <Route path={Routes.arts.noiseRainbow} component={NoiseRainbow} />
      <Route path={Routes.arts.regeneration} component={Regeneration} />
      <Route path={Routes.arts.tenThousand} component={TenThousand} />
      <Route path={Routes.arts.layers} component={Layers} />
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
