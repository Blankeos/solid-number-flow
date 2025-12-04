import * as shikiji from "shikiji"
import {
  createEffect,
  createResource,
  createSignal,
  type FlowProps,
  type JSX,
  Show,
} from "solid-js"
import { Dynamic } from "solid-js/web"
import { MDXProvider } from "solid-marked"

export function Markdown(props: FlowProps) {
  const [highlighter] = createResource(async () =>
    shikiji.getHighlighter({
      langs: ["tsx", "jsx", "md", "mdx", "markdown", "bash", "js", "ts"],
      themes: ["vitesse-dark"],
    })
  )

  return (
    <MDXProvider
      builtins={{
        Heading(props): JSX.Element {
          return (
            <a href={`#${props.id}`}>
              <Dynamic component={`h${props.depth}`} id={props.id}>
                {props.children}
              </Dynamic>
            </a>
          )
        },
        Paragraph(props): JSX.Element {
          return <p>{props.children}</p>
        },
        Root(props): JSX.Element {
          return <div class="">{props.children}</div>
        },
        Blockquote(props): JSX.Element {
          return <blockquote>{props.children}</blockquote>
        },
        Image(props): JSX.Element {
          return <img src={props.url} alt={props.alt ?? props.title ?? undefined} />
        },
        Code(props): JSX.Element {
          const [ref, setRef] = createSignal<HTMLPreElement | undefined>()
          createEffect(() => {
            const current = ref()
            const instance = highlighter()
            const content = props.children
            if (current && instance && content) {
              current.innerHTML = instance.codeToHtml(content, {
                lang: (props.lang ?? undefined) as shikiji.BuiltinLanguage,
                theme: "vitesse-dark",
              })
            }
          })
          return (
            <div ref={setRef} lang={props.lang ?? undefined}>
              {/* Render the code without syntax highlights but less opaque. */}
              <pre class="opacity-40">{props.children}</pre>
            </div>
          )
        },
        InlineCode(props): JSX.Element {
          return <code>{props.children}</code>
        },
        List(props): JSX.Element {
          return (
            <Dynamic component={props.ordered ? "ol" : "ul"} start={props.start ?? undefined}>
              {props.children}
            </Dynamic>
          )
        },
        ListItem(props): JSX.Element {
          return (
            <li>
              <Show when={"checked" in props} fallback={props.children}>
                <input type="checkbox" checked={props.checked ?? undefined} />
                {props.children}
              </Show>
            </li>
          )
        },
        Link(props): JSX.Element {
          return (
            <a href={props.url} title={props.title ?? undefined}>
              {props.children}
            </a>
          )
        },
      }}
    >
      {props.children}
    </MDXProvider>
  )
}
