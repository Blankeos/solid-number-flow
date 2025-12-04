import Demo, { type DemoProps } from "dev/components/demos/base-demo"
import { useCycle } from "dev/hooks/use-cycle"
import { cn } from "dev/utils/cn"
import NumberFlow, { NumberFlowGroup } from "src"

const DATA = [
  { value: 124.23, diff: 0.0564 },
  { value: 2125.95, diff: 0.0029 },
  { value: 41.75, diff: -0.3912 },
]

export default function GroupDemo(props: Omit<DemoProps, "children" | "code">) {
  const [data, cycleData] = useCycle(DATA)

  const code = `
\`\`\`tsx
import NumberFlow, { NumberFlowGroup } from 'solid-number-flow'

<NumberFlowGroup>
  <div
    style={{ "--number-flow-char-height": "0.85em" }}
    class="flex items-center gap-4 font-semibold"
  >
    <NumberFlow
      value={value}
      locales="en-US"
      format={{ style: 'currency', currency: 'USD' }}
      class="~text-2xl/4xl"
    />
    <NumberFlow
      value={diff}
      locales="en-US"
      format={{ style: 'percent', maximumFractionDigits: 2, signDisplay: 'always' }}
      class={cn(
        "~text-lg/2xl transition-colors duration-300",
        diff < 0 ? "text-red-500" : "text-emerald-500"
      )}
    />
  </div>
</NumberFlowGroup>
\`\`\`
`

  return (
    <Demo {...props} code={code} onClick={cycleData}>
      <NumberFlowGroup>
        <div
          style={{ "--number-flow-char-height": "0.85em" }}
          class="flex items-center gap-4 font-semibold"
        >
          <NumberFlow
            value={data().value}
            locales="en-US"
            format={{ style: "currency", currency: "USD" }}
            class="text-4xl"
          />
          <NumberFlow
            value={data().diff}
            locales="en-US"
            format={{ style: "percent", maximumFractionDigits: 2, signDisplay: "always" }}
            class={cn(
              "text-2xl transition-colors duration-300",
              data().diff < 0 ? "text-red-500" : "text-emerald-500",
            )}
          />
        </div>
      </NumberFlowGroup>
    </Demo>
  )
}
