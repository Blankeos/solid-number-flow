import type { Component } from "solid-js"
import { Dynamic } from "solid-js/web"
import { useMDXComponents } from "solid-jsx"

export const MDXContent = (props: { code: any }) => {
  const components: any = useMDXComponents({})
  // return <Dynamic component={props.code}  />
  return <props.code components={components} />
}
