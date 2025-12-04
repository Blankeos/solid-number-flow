// Tabs
import { Tabs } from "@kobalte/core/tabs"
import { useClipboard } from "bagon-hooks"
import { clsx } from "clsx"
import {
  type ComponentProps,
  children,
  createSignal,
  type FlowProps,
  type JSX,
  mergeProps,
  onCleanup,
  onMount,
  Show,
  splitProps,
} from "solid-js"
import { MDXContent } from "@/components/mdx-content"
import { cn } from "@/utils/cn"

// TODO: Dropdown (use @kobalte)
// Dropdown
// import {
// 	Menu,
// 	MenuButton,
// 	MenuItem,
// 	MenuItems,
// 	Switch,
// 	Field,
// 	Label,
// 	type SwitchProps,
// 	type MenuButtonProps,
// 	type MenuItemProps,
// 	type MenuItemsProps,
// 	type MenuProps
// } from '@headlessui/react'

type TabValue = "preview" | "code"

// Switch
import { Switch } from "@kobalte/core/switch"

// ===========================================================================
// UI
// ===========================================================================

export type DemoProps = {
  ref?: HTMLDivElement
  children: JSX.Element
  class?: string
  defaultValue?: TabValue
  code?: string
  minHeight?: string
  title?: JSX.Element
}

type Props = DemoProps & { onClick?: () => void }

function Demo(props: FlowProps<Props>) {
  const _props = mergeProps(
    {
      defaultValue: "preview",
      minHeight: "min-h-[20rem]",
      children: undefined,
      renderTitle: false,
    },
    props
  )

  const [knowsToClick, setKnowsToClick] = createSignal(false)
  const [active, setActive] = createSignal(_props.defaultValue)

  const { copy, copied } = useClipboard()

  function handleClick() {
    if (!_props.onClick) return

    setKnowsToClick(true)
    _props?.onClick?.()
  }

  const handleMouseDown: JSX.EventHandler<HTMLElement, MouseEvent> = (event) => {
    if (!_props.onClick) return

    // Prevent selection of text:
    // https://stackoverflow.com/a/43321596
    if (event.detail > 1) {
      event.preventDefault()
    }
  }

  /** Prevent doublle-render when using it in <Show /> https://github.com/solidjs/solid/issues/2345#issuecomment-2427189199 */
  const renderedTitle = children(() => _props.title)

  return (
    <Tabs
      ref={_props.ref}
      class={clsx("Demo not-prose relative flex flex-col text-primary")} // reset text color if inside prose
      value={active()}
      onChange={(val) => setActive(val as TabValue)}
      // onValueChange={(val) => setActive(val as TabValue)}
    >
      <Show when={_props.code}>
        {/* <MotionConfig transition={{ layout: { type: 'spring', duration: 0.25, bounce: 0 } }}> */}
        <Tabs.List class="absolute top-3 right-3 z-10 flex gap-1 rounded-full bg-black/60 p-1 backdrop-blur-lg">
          <Tabs.Trigger
            value="preview"
            class={clsx(
              active() !== "preview" && "hover:transition-[color]",
              "relative px-2 py-1 font-medium text-muted text-xs/4 hover:text-primary aria-selected:text-primary"
            )}
          >
            <Show when={active() === "preview"}>
              {/* // Motion.div */}
              <div
                class="-z-10 absolute inset-0 size-full rounded-full bg-white/25 shadow-sm"
                style={{ "border-radius": "999" }}
                // layout
                // layoutId={`${id}active`}
              />
            </Show>
            Preview
          </Tabs.Trigger>
          <Tabs.Trigger
            value="code"
            class={clsx(
              active() !== "code" && "hover:transition-[color]",
              "relative px-2 py-1 font-medium text-muted text-xs/4 hover:text-primary aria-selected:text-primary"
            )}
          >
            <Show when={active() === "code"}>
              {/* // Motion.div */}
              <div
                class="-z-10 absolute inset-0 size-full rounded-full bg-white/25 shadow-sm"
                style={{ "border-radius": "999" }}
                // layout
                // layoutId={`${id}active`}
              />
            </Show>
            Code
          </Tabs.Trigger>
        </Tabs.List>
        {/* </MotionConfig> */}
      </Show>
      <Collapsible
        open={true}
        containerClass={cn("rounded-lg border border-faint", active() === "code" && "bg-[#18181B]")}
      >
        <Show when={active() === "preview"}>
          <Tabs.Content value="preview" class={clsx(_props.class, "relative")}>
            <Show when={renderedTitle()}>
              <div class="absolute top-3 left-3">{renderedTitle()}</div>
            </Show>

            <div
              class={clsx(_props.minHeight, "flex flex-col items-center justify-center p-5 pb-6")}
              onClick={handleClick}
              onMouseDown={handleMouseDown}
            >
              {_props.children}
              {_props?.onClick && (
                <span
                  class={clsx(
                    "absolute bottom-5 left-0 w-full text-center text-sm text-zinc-400 transition-opacity duration-200 ease-out",
                    knowsToClick() && "opacity-0"
                  )}
                >
                  Click anywhere to change numbers
                </span>
              )}
            </div>
          </Tabs.Content>
        </Show>
        <Show when={active() === "code" && _props.code}>
          <Tabs.Content value="code" class="relative overflow-hidden p-3 text-sm">
            <MDXContent code={_props.code!} />
            <button
              onClick={() => {
                const code = _props.code || ""
                const trimmedCode = code
                  .replace(/^\s*```tsx\s*\n?/, "") // Remove ```tsx from beginning
                  .replace(/\n?\s*```\s*$/, "") // Remove ``` from end
                copy(trimmedCode)
              }}
              class="absolute right-2 bottom-2 animate-fadeIn rounded-md bg-white/10 p-1 transition-colors hover:bg-white/20"
            >
              <Show
                when={!copied()}
                fallback={
                  <svg
                    class="h-4 w-4 animate-scale-in text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                }
              >
                <svg
                  class="h-4 w-4 animate-scale-in text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
              </Show>
            </button>
          </Tabs.Content>
        </Show>
      </Collapsible>
    </Tabs>
  )
}

export default Demo

export function DemoTitle(props: JSX.IntrinsicElements["span"] & { children: string }) {
  const [_props, other] = splitProps(props, ["class", "children"])

  return (
    <span {...other} class={clsx(props.class, "px-2 py-1.5 text-sm")}>
      {props.children}
    </span>
  )
}

// export function DemoMenu(props: MenuProps) {
// 	return <Menu {...props} />
// }

// export function DemoMenuButton({
// 	children,
// 	class,
// 	...props
// }: MenuButtonProps & { children: JSX.Element }) {
// 	return (
// 		<MenuButton
// 			{...props}
// 			class={clsx(
// 				class,
// 				'group flex h-8 items-center rounded-full px-3 text-xs shadow-sm ring ring-black/8 dark:shadow-none dark:ring-white/10'
// 			)}
// 		>
// 			{children}
// 			<ChevronDown
// 				class="spring-bounce-0 spring-duration-150 ml-1 size-4 shrink-0 group-data-[active]:rotate-180"
// 				strokeWidth={2}
// 			/>
// 		</MenuButton>
// 	)
// }

// export function DemoMenuItems({ class, ...props }: MenuItemsProps) {
// 	return (
// 		<MenuItems
// 			{...props}
// 			class={clsx(
// 				class,
// 				'animate-pop-in dark:ring-white/12.5 absolute left-0 top-full mt-2 min-w-full origin-top-left rounded-xl bg-white/90 p-1.5 shadow-sm ring ring-inset ring-black/8 backdrop-blur-xl backdrop-saturate-140 dark:bg-zinc-950/90 dark:shadow-none'
// 			)}
// 		/>
// 	)
// }

// export function DemoMenuItem({
// 	class,
// 	children,
// 	...props
// }: MenuItemProps<'button'> & { children: JSX.Element }) {
// 	return (
// 		<MenuItem
// 			{...props}
// 			as="button"
// 			class={clsx(
// 				class,
// 				props.disabled ? 'pr-2' : 'pr-4',
// 				'dark:data-focus:bg-white/12.5 flex w-full items-center gap-2 rounded-lg py-2 pl-2 text-xs font-medium data-disabled:cursor-default data-focus:bg-black/5'
// 			)}
// 		>
// 			{children}
// 			{props.disabled && <Check class="ml-auto h-4 w-4" />}
// 		</MenuItem>
// 	)
// }

export function DemoSwitch(props: ComponentProps<typeof Switch>) {
  const [_props, other] = splitProps(props, ["class", "children"])

  return (
    <Switch {...other} class="flex items-center gap-x-2">
      <Switch.Control
        class={clsx(
          props.class,
          "group relative flex h-6 w-11 cursor-pointer rounded-full bg-zinc-800 p-0.5 transition-colors duration-200 ease-in-out focus:outline-none data-checked:bg-zinc-50 data-focus:outline-2 data-focus:outline-blue-500"
        )}
      >
        <Switch.Thumb class="spring-bounce-0 spring-duration-200 pointer-events-none inline-block size-5 rounded-full bg-zinc-950 shadow-lg ring-0 transition-transform group-data-checked:translate-x-5" />
      </Switch.Control>
      <Switch.Label class="text-xs">{props.children as any}</Switch.Label>
    </Switch>
  )
}

// NOT A SOLID-UI / SHADCN COMPONENT. CUSTOM BY CARLO
// A11Y NOTES ----------------------------------------------------
// - The extra divs here (outer animating wrapper + inner measure div)
//   are **not** exposed to the a11y tree because:
//     – we don't add any semantic roles
//     – we don't add any labelling attributes
//   So screen-readers will only “see” the real interactive controls
//   that compose this component (buttons, links, inputs, etc.).
//   Multiple layout divs are therefore “noise-free”.
// - The collapsing action itself should be announced by whatever
//   trigger toggles the `open` prop (e.g. the parent button should
//   have `aria-expanded` and `aria-controls`).
// - If this component is ever used as a disclosure region directly,
//   add `id`, `role="region"` and `aria-labelledby` (or `aria-label`)
//   on the outer div so assistive tech can associate it with the
//   controlling button.
// - `overflow:hidden` on the outer div prevents keyboard focus from
//   landing on off-screen descendants when closed, but double-check
//   that no forced-focus logic circumvents that.
// - Prefer `prefers-reduced-motion` in consumer code to disable
//   the `transition-all` class when the user has requested it.
// - HIDING CONTENT FROM SR WHEN CLOSED:  Yes, this is the usual,
//   expected pattern.  When a disclosure widget is closed we remove
//   its descendants from the a11y tree with `aria-hidden` so users
//   cannot read/traverse it.  (aria-expanded=false already implies
//   invisibility for SR users; aria-hidden just makes it official.)
//   When open we drop aria-hidden so the region is discoverable again.
// - External trigger a11y docs - added.
// ----------------------------------------------------------------

export interface CollapsibleProps extends JSX.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  /**
   * Applied to the collapsing wrapper div (the element whose height changes). Generally no need to touch this besides changing the transition duration.
   */
  containerClass?: string
  /**
   * Applied to the content div (the measured inner wrapper)
   */
  class?: string
  children: JSX.Element
}

/*
 * Fluid height collapsible built on native resize events.
 * Uses transition-* utilities (duration/ease) – the root parent gets
 * a changing style.height that the utility class animates.
 * Works exactly like an Accordion panel but without any trigger
 * baggage; state is 100% parent-controlled via open={bool}.
 *
 * A11y Notes for external triggers (Just a minor trade-off from not using an Accordion component).
 * If an external button/link controls this panel you should:
 *   1. Pass a unique `id` to Collapsible (e.g. id="faq-panel-3").
 *   2. On the trigger element, add:
 *        aria-expanded={open}
 *        aria-controls="faq-panel-3"
 *      where `open` is the same boolean you pass to Collapsible.
 *   3. Optionally set the `role="region"` prop on Collapsible so
 *      screen-reader users hear "region" when entering the panel.
 *   4. If you want a visible label, add `aria-labelledby`
 *      to the trigger button (not Collapsible) pointing
 *      to the ID of the heading that names the panel.
 *      Example:
 *        <h3 id="faq-title">Shipping options</h3>
 *        <button aria-expanded={open} aria-controls="faq-panel-3" aria-labelledby="faq-title">
 *          …
 *        </button>
 */
export function Collapsible(props: CollapsibleProps) {
  let innerRef: HTMLDivElement | undefined
  let lastHeight = 0

  const [local, others] = splitProps(props, ["open", "containerClass", "class", "children"])
  const [height, setHeight] = createSignal<number | string>("auto")

  // Observe the *inner* element’s size so any content change is reflected
  const resizeHandler = () => {
    if (innerRef) {
      lastHeight = innerRef.scrollHeight
      setHeight(lastHeight) // keep latest value when open
    }
  }

  let ro: ResizeObserver
  onMount(() => {
    if (!innerRef) return
    ro = new ResizeObserver(resizeHandler)
    ro.observe(innerRef)
    resizeHandler() // ensure initial read
  })

  onCleanup(() => ro?.disconnect())

  // Select what to render based on open state
  // (invoke children here once so ResizeObserver sees static children of inner)
  const content = children(() => local.children)

  const heightStyle = () => (local.open ? `${height()}px` : "0px")
  return (
    <div
      style={{ height: heightStyle() }}
      class={cn("overflow-hidden transition-[width,height] duration-400", local.containerClass)}
      aria-hidden={!local.open}
      {...others}
    >
      {/* inner wrapper we measure */}
      <div ref={innerRef} class={cn(local.class, "w-full")}>
        {content()}
      </div>
    </div>
  )
}
