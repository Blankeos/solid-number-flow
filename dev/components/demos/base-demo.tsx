// Tabs
import { Tabs } from "@kobalte/core/tabs"
import { clsx } from "clsx"
import {
  type ComponentProps,
  children,
  createSignal,
  type FlowProps,
  type JSX,
  mergeProps,
  Show,
  splitProps,
} from "solid-js"

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
  code?: JSX.Element
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
      class={clsx(active() === "code" && "dark", "Demo not-prose relative isolate text-primary")} // reset text color if inside prose
      value={active()}
      onChange={(val) => setActive(val as TabValue)}
      // onValueChange={(val) => setActive(val as TabValue)}
    >
      <Show when={_props.code}>
        {/* <MotionConfig transition={{ layout: { type: 'spring', duration: 0.25, bounce: 0 } }}> */}
        <Tabs.List class="absolute top-3 right-3 z-10 flex gap-1 rounded-full bg-zinc-150/90 p-1 backdrop-blur-lg dark:bg-black/60">
          <Tabs.Trigger
            value="preview"
            class={clsx(
              active() !== "preview" && "hover:transition-[color]",
              "relative px-2 py-1 font-medium text-xs/4 text-zinc-600 hover:text-primary aria-selected:text-primary dark:text-muted"
            )}
          >
            <Show when={active() === "preview"}>
              {/* // Motion.div */}
              <div
                class="prefers-dark:!bg-white/15 -z-10 absolute inset-0 size-full bg-white shadow-sm dark:bg-white/25"
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
              "relative px-2 py-1 font-medium text-xs/4 text-zinc-600 hover:text-primary aria-selected:text-primary dark:text-muted"
            )}
          >
            <Show when={active() === "code"}>
              {/* // Motion.div */}
              <div
                class="prefers-dark:!bg-white/15 -z-10 absolute inset-0 size-full bg-white shadow-sm dark:bg-white/25"
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
      <Tabs.Content
        value="preview"
        class={clsx(
          _props.class,
          "relative rounded-lg border border-faint data-[state=inactive]:hidden"
        )}
      >
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
      <Show when={_props.code}>
        <Tabs.Content
          value="code"
          class="relative overflow-hidden rounded-lg border border-faint bg-zinc-950 text-sm"
        >
          {_props.code}
        </Tabs.Content>
      </Show>
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
          "group relative flex h-6 w-11 cursor-pointer rounded-full bg-zinc-200 p-0.5 transition-colors duration-200 ease-in-out focus:outline-none data-checked:bg-zinc-950 data-focus:outline-2 data-focus:outline-blue-500 dark:bg-zinc-800 dark:data-checked:bg-zinc-50"
        )}
      >
        <Switch.Thumb class="spring-bounce-0 spring-duration-200 pointer-events-none inline-block size-5 rounded-full bg-white shadow-lg ring-0 transition-transform group-data-checked:translate-x-5 dark:bg-zinc-950" />
      </Switch.Control>
      <Switch.Label class="text-xs">{props.children as any}</Switch.Label>
    </Switch>
  )
}
