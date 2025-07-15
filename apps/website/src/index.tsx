/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { For } from "solid-js";

import { Routes } from "./routes";

import { Layout } from "./views/layout/Layout";

import { Home } from "./pages/home/Home";
import { Guides } from "./pages/guides/Guides";
import { ValueNoise } from "./pages/guides/pages/value-noise/ValueNoise";
import { SimplexNoise } from "./pages/guides/pages/simplex-noise/SimplexNoise";
import { PerlinNoise } from "./pages/guides/pages/perlin-noise/PerlinNoise";
import { Arts } from "./pages/arts/Arts";
import { Writing } from "./pages/writing/Writing";
import { About } from "./pages/about/About";
import { Contact } from "./pages/contact/Contact";
import { NotFound } from "./pages/not-found/NotFound";

import { artData } from "./pages/arts/art-data/art-data";
import { ArtPage } from "./pages/arts/ArtPage";

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
      <For each={artData}>
        {(art) => (
          <Route path={art.route} component={() => <ArtPage art={art} />} />
        )}
      </For>
    </Route>

    <Route path={Routes.root.writing} component={Writing} />

    <Route path={Routes.root.about} component={About} />

    <Route path={Routes.root.contact} component={Contact} />

    <Route path={Routes.root.notFound} component={NotFound} />
  </Router>
);

render(AppRouter, root);
