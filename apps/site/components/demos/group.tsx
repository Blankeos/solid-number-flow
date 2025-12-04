import NumberFlow, { NumberFlowGroup } from "solid-number-flow"
import Demo, { type DemoProps } from "@/components/demos/base-demo"
import Code from "@/components/demos/snippets/group.mdx"
import { useCycle } from "@/hooks/use-cycle"
import { cn } from "@/utils/cn"

const DATA = [
  { value: 124.23, diff: 0.0564 },
  { value: 2125.95, diff: 0.0029 },
  { value: 41.75, diff: -0.3912 },
]

export default function GroupDemo(props: Omit<DemoProps, "children" | "code">) {
  const [data, cycleData] = useCycle(DATA)

  return (
    <Demo {...props} code={Code} onClick={cycleData}>
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
              data().diff < 0 ? "text-red-500" : "text-emerald-500"
            )}
          />
        </div>
      </NumberFlowGroup>
    </Demo>
  )
}
