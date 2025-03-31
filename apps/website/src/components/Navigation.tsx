import { A } from "@solidjs/router";

export const Navigation = () => {
  return (
    <nav>
      <A href="/" activeClass="" inactiveClass="">Home</A>
      <A href="/about">About</A>
      <A href="/kek">Kek</A>
    </nav>
  );
};
