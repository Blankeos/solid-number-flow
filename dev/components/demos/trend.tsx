import Demo, { type DemoProps } from "dev/components/demos/base-demo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "dev/components/ui/dropdown-menu"
import { MDXContent } from "dev/components/mdx-content"
import { useCycle } from "dev/hooks/use-cycle"
import type { Trend } from "number-flow"
import { createSignal, For } from "solid-js"
import NumberFlow from "src"

const NUMBERS = [20, 19]

const TRENDS: Record<string, Trend | undefined> = {
  default: undefined,
  "+1": 1,
  "0": 0,
  "-1": -1,
}

export default function TrendDemo(props: Omit<DemoProps, "children" | "code">) {
  const [value, cycleValue] = useCycle(NUMBERS)
  const [option, setOption] = createSignal<keyof typeof TRENDS>("default")
  const trend = () => TRENDS[option()]

  const code = `
\`\`\`tsx
<NumberFlow
  trend={${trend() ?? "undefined"}}
  value={value}
/>
\`\`\`
`

  return (
    <Demo
      {...props}
      code={<MDXContent code={code} />}
      title={
        <DropdownMenu>
          <DropdownMenuTrigger class="flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors outline-none">
            <code class="text-muted text-zinc-500">trend:</code>
            <code class="font-semibold">{option()}</code>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="ml-0.5 size-3.5 text-muted-foreground opacity-50"
            >
              <path d="M6 9l6 6l6 -6" />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={option()} onChange={(v) => setOption(v as keyof typeof TRENDS)}>
              <For each={Object.keys(TRENDS)}>
                {(key) => (
                  <DropdownMenuRadioItem value={key}>
                    <code class="font-semibold">{key}</code>
                  </DropdownMenuRadioItem>
                )}
              </For>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      }
      onClick={cycleValue}
    >
      <div class="~text-3xl/4xl flex items-center gap-4">
        <NumberFlow
          locales="en-US"
          trend={trend()}
          style={{ "--number-flow-char-height": "0.85em" }}
          value={value()}
          class="font-semibold text-4xl text-primary"
        />
      </div>
    </Demo>
  )
}
