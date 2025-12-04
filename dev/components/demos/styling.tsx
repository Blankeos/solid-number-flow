import Demo, { type DemoProps } from "dev/components/demos/base-demo"
import { MDXContent } from "dev/components/mdx-content"
import { useCycle } from "dev/hooks/use-cycle"
import NumberFlow, { type Value } from "src"

const NUMBERS: Value[] = [3, 15, 50]

export default function StylingDemo(props: Omit<DemoProps, "children" | "code">) {
  const [value, cycleValue] = useCycle(NUMBERS)

  const code = `
\`\`\`css
number-flow::part(suffix) {
  margin-left: .0625em;
  font-weight: normal;
  font-size: 0.75em;
  color: var(--muted);
}
\`\`\`
`

  return (
    <Demo {...props} code={<MDXContent code={code} />} onClick={cycleValue}>
      <NumberFlow
        locales="en-US"
        value={value()}
        format={{ style: "currency", currency: "USD", trailingZeroDisplay: "stripIfInteger" }}
        suffix="/mo"
        class="~text-3xl/4xl font-semibold text-4xl part-[suffix]:font-normal part-[suffix]:text-muted part-[suffix]:text-[0.75em] part-[suffix]:ml-[0.0625em]"
        style={{ "--number-flow-char-height": "0.85em" }}
      />
    </Demo>
  )
}
