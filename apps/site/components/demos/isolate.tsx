import { createSignal } from "solid-js"
import NumberFlow from "solid-number-flow"
import Demo, { type DemoProps, DemoSwitch } from "@/components/demos/base-demo"
import Code from "@/components/demos/snippets/isolate.mdx"

export default function IsolateDemo(props: Omit<DemoProps, "children" | "code">) {
  const [increased, setIncreased] = createSignal(false)
  const [isolate, setIsolate] = createSignal(false)

  return (
    <Demo
      {...props}
      code={Code}
      title={
        <DemoSwitch checked={isolate()} onChange={setIsolate}>
          <code class="font-semibold">isolate</code>
        </DemoSwitch>
      }
      onClick={() => setIncreased((o) => !o)}
    >
      <div class="~text-3xl/4xl flex items-center gap-4">
        {increased() && <div class="h-[1em] w-40 rounded-sm bg-green-500"></div>}
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
