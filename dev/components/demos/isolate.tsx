import Demo, { DemoSwitch, type DemoProps } from "dev/components/demos/base-demo"
import { MDXContent } from "dev/components/mdx-content"
import { createSignal } from "solid-js"
import NumberFlow from "src"

export default function IsolateDemo(props: Omit<DemoProps, "children" | "code">) {
  const [increased, setIncreased] = createSignal(false)
  const [isolate, setIsolate] = createSignal(false)

  const code = `
\`\`\`tsx
<NumberFlow
  isolate={${isolate()}}
  value={${increased() ? 1.2423 : 0.4175}}
  format={{ style: 'percent' }}
/>
\`\`\`
`

  return (
    <Demo
      {...props}
      code={<MDXContent code={code} />}
      title={
        <DemoSwitch checked={isolate()} onChange={setIsolate}>
          <code class="font-semibold">isolate</code>
        </DemoSwitch>
      }
      onClick={() => setIncreased((o) => !o)}
    >
      <div class="~text-3xl/4xl flex items-center gap-4">
        {increased() && <div class="bg-zinc-200 dark:bg-zinc-800 ~w-20/40 h-[1em] rounded-sm" />}
        <NumberFlow
          locales="en-US"
          isolate={isolate()}
          style={{ "--number-flow-char-height": "0.85em" }}
          value={increased() ? 1.2423 : 0.4175}
          format={{ style: "percent" }}
          class="font-semibold text-4xl"
        />
      </div>
    </Demo>
  )
}
