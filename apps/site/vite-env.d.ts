/// <reference types="vite/client" />

declare module "*.mdx" {
  import type { Component } from "solid-js"
  const Component: Component
  export default Component
}

declare module "*.md" {
  import type { Component } from "solid-js"
  const Component: Component
  export default Component
}
