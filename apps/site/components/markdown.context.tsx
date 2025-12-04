import { createSignal, type FlowProps, Show } from "solid-js"
import { MDXProvider } from "solid-jsx"
import { IconCheck } from "../icons/check"
import { IconCopy } from "../icons/copy"

export function createPre(options: {
  copyButtonClass?: string
  copyButtonPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}) {
  return (props: { children?: any; class?: string; className?: string }) => (
    <Pre {...props} copyButtonClass={options.copyButtonClass} copyButtonPosition={options.copyButtonPosition} />
  )
}

const Pre = (props: {
  children?: any
  class?: string
  className?: string
  copyButtonClass?: string
  copyButtonPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}) => {
  const [ref, setRef] = createSignal<HTMLPreElement>()
  const [copied, setCopied] = createSignal(false)

  const onCopy = () => {
    const content = ref()?.textContent
    if (content) {
      navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2'
  }

  return (
    <div class="group relative w-full h-full flex items-center p-3">
      <pre ref={setRef} {...props} class={props.class || props.className}>
        {props.children}
      </pre>

      <button
        class={`absolute rounded bg-neutral-800/50 p-1.5 text-neutral-300 opacity-0 transition-opacity hover:bg-neutral-700/50 hover:text-white group-hover:opacity-100 ${positionClasses[props.copyButtonPosition || 'bottom-right']} ${props.copyButtonClass || ''}`}
        onClick={onCopy}
        aria-label="Copy code"
      >
        <Show when={copied()} fallback={<IconCopy class="size-4 animate-scale-in" />}>
          <IconCheck class="size-4 animate-scale-in" />
        </Show>
      </button>
    </div>
  )
}



const mdComponents = {
  pre: Pre,
}

export function MarkdownContextProvider(props: FlowProps) {
  return <MDXProvider components={mdComponents}>{props.children}</MDXProvider>
}
