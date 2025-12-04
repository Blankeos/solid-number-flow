import type { FlowProps } from "solid-js"
import "../styles.css"
import { useMetadata } from "vike-metadata-solid"
import { MarkdownContextProvider } from "@/components/markdown.context"

useMetadata.setGlobalDefaults({
  title: "Solid Number Flow",
  description:
    "A SolidJS component to transition, format, and localize numbers. Forked from @barvian/number-flow.",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@carlo_taleon",
  },
  otherJSX: () => {
    return (
      <>
        <link rel="icon" href="/favicon.ico" />
      </>
    )
  },
})

export default function Layout(props: FlowProps) {
  return <MarkdownContextProvider>{props.children}</MarkdownContextProvider>
}
