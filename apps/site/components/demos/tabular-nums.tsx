import { createSignal } from "solid-js"
import NumberFlow from "solid-number-flow"
import Demo, { type DemoProps, DemoSwitch } from "@/components/demos/base-demo"

export default function TabularNumsDemo(props: Omit<DemoProps, "children" | "code">) {
  const [value, setValue] = createSignal(10)
  const [tabularNums, setTabularNums] = createSignal(false)

  const code = `
\`\`\`tsx
<NumberFlow
  style={{
    fontVariantNumeric: ${tabularNums() ? "'tabular-nums'" : "undefined"}
  }}
  value={value}
/>
\`\`\`
`

  return (
    <Demo
      {...props}
      code={code}
      title={
        <DemoSwitch checked={tabularNums()} onChange={setTabularNums}>
          <code class="font-semibold">tabular-nums</code>
        </DemoSwitch>
      }
      onClick={() => setValue((v) => v + 1)}
    >
      <div class="~text-3xl/4xl flex items-center gap-4">
        <NumberFlow
          locales="en-US"
          style={{
            "font-variant-numeric": tabularNums() ? "tabular-nums" : undefined,
            "--number-flow-char-height": "0.85em",
          }}
          value={value()}
          class="font-semibold text-4xl"
        />
      </div>
    </Demo>
  )
}
