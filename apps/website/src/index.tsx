/* @refresh reload */
import { render } from "solid-js/web";
import { type ParentProps } from "solid-js";
import { Route, Router } from "@solidjs/router";

import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";

import { Home } from "./pages/home/Home";
import { About } from "./pages/about/About";
import { Art } from "./pages/art/Art";
import { NotFound } from "./pages/not-found/NotFound";

import "./styles/reset.css";
import "./styles/style.css";

const root = document.getElementById("root");
if (!root) throw "Invalid #root HTML element!";

const Layout = (props: ParentProps) => (
  <>
    <Navigation />
    {props.children}
    <Footer />
  </>
);

const AppRouter = () => (
  <Router root={Layout}>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/art" component={Art} />
    <Route path="*404" component={NotFound} />
  </Router>
);

render(AppRouter, root);
