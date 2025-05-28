import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [glsl()],
});

// ------------------------
// -- Single file config --
// ------------------------

// import { defineConfig } from "vite";
// import { viteSingleFile } from "vite-plugin-singlefile";
// import glsl from "vite-plugin-glsl";
//
// export default defineConfig({
//   plugins: [viteSingleFile(), glsl()],
// });
