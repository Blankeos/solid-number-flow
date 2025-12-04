import Demo, { type DemoProps, DemoSwitch } from "dev/components/demos/base-demo"
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
      code={code}
      title={
        <DemoSwitch checked={isolate()} onChange={setIsolate}>
          <code class="font-semibold">isolate</code>
        </DemoSwitch>
      }
      onClick={() => setIncreased((o) => !o)}
    >
      <div class="~text-3xl/4xl flex items-center gap-4">
        {increased() && <div class="~w-20/40 h-[1em] rounded-sm bg-zinc-800" />}
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
