import Demo, { type DemoProps } from "dev/components/demos/base-demo"
import { useCycle } from "dev/hooks/use-cycle"
import NumberFlow, { type Value } from "src"

const NUMBERS: Value[] = [3, 15, 50]

export default function SuffixDemo(props: Omit<DemoProps, "children" | "code">) {
  const [value, cycleValue] = useCycle(NUMBERS)

  const code = `
\`\`\`tsx
<NumberFlow
  value={value}
  format={{ style: 'currency', currency: 'USD', trailingZeroDisplay: 'stripIfInteger' }}
  suffix="/mo"
/>
\`\`\`
`

  return (
    <Demo {...props} code={code} onClick={cycleValue}>
      <NumberFlow
        locales="en-US"
        value={value()}
        format={{ style: "currency", currency: "USD", trailingZeroDisplay: "stripIfInteger" }}
        suffix="/mo"
        class="~text-3xl/4xl font-semibold text-4xl"
        style={{ "--number-flow-char-height": "0.85em" }}
      />
    </Demo>
  )
}
