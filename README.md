<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-number-flow&background=tiles&project=%20" alt="solid-number-flow">
</p>

# solid-number-flow

<div align="center">
<img src="_docs/demo.gif" alt="Demo"  />
</div>

<div align="center">
  <img src="https://img.shields.io/badge/maintained%20with-bun-cc00ff.svg?style=for-the-badge&logo=bun)](https://bun.sh/" alt="Bun"></img>
  <a href="https://www.npmjs.com/package/solid-number-flow" target="_blank">
  <img src="https://img.shields.io/npm/dw/solid-number-flow?style=for-the-badge" alt="NPM Downloads"></img></a>
  <img src="https://img.shields.io/npm/l/solid-number-flow?style=for-the-badge" alt="NPM License"></img>
  <img src="https://img.shields.io/bundlephobia/minzip/solid-number-flow?style=for-the-badge" alt="NPM Bundle Size" ></img>
</div>

A SolidJS component to transition, format, and localize numbers. Forked from [@barvian/number-flow](https://github.com/barvian/number-flow).

## Quick start

Install it:

```bash
npm i solid-number-flow
# or
yarn add solid-number-flow
# or
pnpm add solid-number-flow
# or
bun add solid-number-flow
```

Use it:

```tsx
import solid-number-flow from 'solid-number-flow'

export default function Page() {
  const [value, setValue] = createSignal(398.43);

  return (
    <>
      <button onClick={() => setValue(Math.random() * 1000)}>Random</button>
      <NumberFlow value={value()} />
    </>
  )
}

```
