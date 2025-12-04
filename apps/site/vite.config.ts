import tailwindcss from "@tailwindcss/vite"
import vike from "vike/plugin"
// Vike
import vikeSolid from "vike-solid/vite"
import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    vike({
      prerender: true,
    }),
    vikeSolid(),
    tailwindcss(),
  ],
  server: { port: 3000 },
  build: { target: "esnext" },
})
