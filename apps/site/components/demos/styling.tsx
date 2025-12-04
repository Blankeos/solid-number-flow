import NumberFlow, { type Value } from "solid-number-flow"
import Demo, { type DemoProps } from "@/components/demos/base-demo"
import Code from "@/components/demos/snippets/styling.mdx"
import { useCycle } from "@/hooks/use-cycle"

const NUMBERS: Value[] = [3, 15, 50]

export default function StylingDemo(props: Omit<DemoProps, "children" | "code">) {
  const [value, cycleValue] = useCycle(NUMBERS)

  return (
    <Demo {...props} code={Code} onClick={cycleValue}>
      <NumberFlow
        locales="en-US"
        value={value()}
        format={{ style: "currency", currency: "USD", trailingZeroDisplay: "stripIfInteger" }}
        suffix="/mo"
        class="~text-3xl/4xl part-[suffix]:ml-[0.0625em] font-semibold part-[suffix]:font-normal part-[suffix]:text-[0.75em] part-[suffix]:text-muted text-4xl"
        style={{ "--number-flow-char-height": "0.85em" }}
      />
    </Demo>
  )
}
