import Demo, { type DemoProps, DemoSwitch } from "dev/components/demos/base-demo"
import { MDXContent } from "dev/components/mdx-content"
import { useCycle } from "dev/hooks/use-cycle"
import { continuous } from "number-flow/plugins"
import { createSignal } from "solid-js"
import NumberFlow from "src"

const NUMBERS = [120, 140]

export default function ContinuousDemo(props: Omit<DemoProps, "children" | "code">) {
  const [value, cycleValue] = useCycle(NUMBERS)
  const [isContinuous, setContinuous] = createSignal(true)

  const code = `
\`\`\`tsx
import NumberFlow, { continuous } from '@number-flow/solid'

<NumberFlow
  plugins={[continuous]}
  value={value}
/>
\`\`\`
`

  return (
    <Demo
      {...props}
      code={<MDXContent code={code} />}
      title={
        <DemoSwitch checked={isContinuous()} onChange={setContinuous}>
          <code class="font-semibold">continuous</code>
        </DemoSwitch>
      }
      onClick={cycleValue}
    >
      <div class="~text-3xl/4xl flex items-center gap-4">
        <NumberFlow
          locales="en-US"
          plugins={isContinuous() ? [continuous] : undefined}
          style={{ "--number-flow-char-height": "0.85em" }}
          value={value()}
          class="font-semibold text-4xl"
        />
      </div>
    </Demo>
  )
}
