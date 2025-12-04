import { compile, compileSync, run, runSync } from "@mdx-js/mdx"
import theme from "dev/highlighter-theme.json"
import { getSingletonHighlighter } from "shiki"
import { createEffect, createRenderEffect, createSignal, type JSX, Show } from "solid-js"
import { Dynamic } from "solid-js/web"
import * as runtime from "solid-jsx"


import rehypeShiki from "@shikijs/rehype"

interface MDXProps {
  code: string
  components?: Record<string, any>
}

let highlighterPromise: ReturnType<typeof getSingletonHighlighter> | null = null

function getGlobalHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = getSingletonHighlighter({
      themes: [theme as any],
      langs: ["tsx", "jsx", "html", "css", "vue", "svelte"],
    })
  }
  return highlighterPromise
}

const Code = (props: any) => {
  const [ref, setRef] = createSignal<HTMLDivElement>()

  createEffect(() => {
    const el = ref()
    const content = props.children

    if (!el || !content) return

    const className = props.class || props.className || ""
    const match = /language-(\w+)/.exec(className)
    const lang = match ? match[1] : null

    if (!lang) return

    getGlobalHighlighter().then((hl) => {
      try {
        // Ensure content is string
        const codeString = String(content).trim()
        const html = hl.codeToHtml(codeString, {
          lang,
          theme: "Lambda Studio — Blackout",
        })
        // Check if element is still mounted/valid
        if (el && document.contains(el)) {
          el.innerHTML = html
        } else if (el) {
          // Even if not in doc, we can set it?
          // Solid might reuse elements. Safer to check.
          el.innerHTML = html
        }
      } catch (e) {
        console.warn("Highlighting failed:", e)
      }
    })
  })

  return (
    <div ref={setRef}>
      <code {...props} />
    </div>
  )
}

const Pre = (props: any) => {
  return <>{props.children}</>
}

const mdxComponents = {
  pre: Pre,
  code: Code,
}

export const MDXContent = (props: MDXProps): JSX.Element => {
  const [mdxModule, setMdxModule] = createSignal<any>()

  createRenderEffect(() => {
    ;(async () => {
      try {
        const compiled = await compile(props.code, {
          outputFormat: "function-body",
          development: false,
          rehypePlugins: [
            [
              rehypeShiki, // Adds syntax-highlighting for code blocks.
              { theme: theme }
            ]
          ]
        })
        setMdxModule(await run(String(compiled), { ...(runtime as any), baseUrl: import.meta.url }))
      } catch (e) {
        console.error("MDX compilation failed", e)
      }
    })()
  })

  // return (
  //   <Show when={mdxModule()?.default}>
  //     <Dynamic
  //       component={mdxModule().default}
  //       components={{ ...mdxComponents, ...props.components }}
  //     />
  //   </Show>
  // )
  const Content = () => mdxModule()?.default || (() => null)

  return Content as unknown as JSX.Element

}

// export const MDXContent = (props: MDXProps): JSX.Element => {
//   const [mdxModule, setMdxModule] = createSignal<any>()

//   createRenderEffect(() => {
//     ;(async () => {
//       setMdxModule(await run(props.code, { ...(runtime as any), baseUrl: import.meta.url }))
//     })()
//   })

//   const Content = () => mdxModule()?.default || (() => null)

//   return Content as unknown as JSX.Element
// }


export const MDXContentStatic = (props: MDXProps): JSX.Element => {
  try {
    const compiled = compileSync(props.code, {
      outputFormat: "function-body",
      development: false,
    })
    const mdxModule = runSync(String(compiled), { ...(runtime as any), baseUrl: import.meta.url })

    const Component = mdxModule.default
    if (!Component) return <></>

    return <Component components={{ ...mdxComponents, ...props.components }} />
  } catch (e) {
    console.error("MDX static compilation failed", e)
    return <pre>{props.code}</pre>
  }
}
