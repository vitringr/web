import { A } from "@solidjs/router";

export const Guides = () => {
  return (
    <div>
      <p>Guides page text.</p>
      <A href="/guides/value-noise">Value Noise</A>
      <A href="/guides/perlin-noise">Perlin Noise</A>
      <A href="/guides/simplex-noise">Simplex Noise</A>
    </div>
  );
};
