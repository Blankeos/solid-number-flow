import tailwindcss from "@tailwindcss/vite"
import vike from "vike/plugin"
// Vike
import vikeSolid from "vike-solid/vite"
import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"
import mdx from "@mdx-js/rollup"
import rehypeShiki from "@shikijs/rehype"
import theme from "./highlighter-theme.json"

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    vike({
      prerender: true,
    }),
    mdx({
      jsxImportSource: "solid-jsx",
      providerImportSource: "solid-jsx",
      rehypePlugins: [[rehypeShiki, { theme }]],
    }),
    vikeSolid(),
    tailwindcss(),
  ],
  server: { port: 3000 },
  build: { target: "esnext" },
})
