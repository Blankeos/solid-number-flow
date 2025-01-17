import {
  type Data,
  define,
  type Format,
  formatToData,
  NumberFlowLite,
  type Props,
  renderInnerHTML,
  type Value,
} from 'number-flow';
import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  FlowProps,
  onCleanup,
  onMount,
  splitProps,
  useContext,
  VoidProps,
} from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import { Dynamic } from 'solid-js/web';
export type { Format, Trend, Value } from 'number-flow';

// Can't wait to not have to do this in React 19:
const OBSERVED_ATTRIBUTES = ['data', 'digits'] as const;
type ObservedAttribute = (typeof OBSERVED_ATTRIBUTES)[number];
export class NumberFlowElement extends NumberFlowLite {
  static observedAttributes = OBSERVED_ATTRIBUTES;
  attributeChangedCallback(_attr: ObservedAttribute, _oldValue: string, _newValue: string) {
    // this[attr] = JSON.parse(newValue); This has errors, but it works without it, So I did not fix this anymore.
  }
}

define('number-flow', NumberFlowElement);

type BaseProps = JSX.HTMLAttributes<NumberFlowElement> &
  Partial<Props> & {
    isolate?: boolean;
    willChange?: boolean;
    onAnimationsStart?: (e: CustomEvent<undefined>) => void;
    onAnimationsFinish?: (e: CustomEvent<undefined>) => void;
  };

type NumberFlowImplProps = BaseProps & {
  innerRef: NumberFlowElement | undefined;
  group: Accessor<GroupContext | undefined>;
  data: Accessor<Data | undefined>;
};

// You're supposed to cache these between uses:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
// Serialize to strings b/c React:
const formatters: Record<string, Intl.NumberFormat> = {};

// ===========================================================================
// IMPLEMENTATION (Equivalent to the React Class Component)
// ===========================================================================
/** Used for `prevProps` because accessing signals always gives "latest" values, we don't want that. */
type NumberFlowImplProps_NoSignals = Omit<NumberFlowImplProps, 'parts'> & {
  group: GroupContext | undefined;
  data: Data | undefined;
};

function NumberFlowImpl(props: VoidProps<NumberFlowImplProps>) {
  let el: NumberFlowElement | undefined;

  const updateProperties = (prevProps?: NumberFlowImplProps_NoSignals) => {
    if (!el) return;

    // // el.manual = !props.isolate; (Not sure why but this breaks the animations, so isolate might not work right now. I personally think it has a very niche usecase though).
    if (props.transformTiming)
      el.transformTiming ?? NumberFlowElement.defaultProps['transformTiming'];
    if (props.spinTiming) el.spinTiming ?? NumberFlowElement.defaultProps['spinTiming'];
    if (props.opacityTiming) el.opacityTiming ?? NumberFlowElement.defaultProps['opacityTiming'];
    if (props.animated != null) el.animated = props.animated;
    if (props.respectMotionPreference != null)
      el.respectMotionPreference = props.respectMotionPreference;
    if (props.trend != null) el.trend = props.trend;
    if (props.plugins != null) el.plugins = props.plugins;

    // eslint-disable-next-line solid/reactivity
    if (prevProps?.onAnimationsStart)
      // eslint-disable-next-line solid/reactivity
      el.removeEventListener('onanimationsstart', prevProps.onAnimationsStart as EventListener);
    if (props.onAnimationsStart)
      el.addEventListener('animationsstart', props.onAnimationsStart as EventListener);

    // eslint-disable-next-line solid/reactivity
    if (prevProps?.onAnimationsFinish)
      // eslint-disable-next-line solid/reactivity
      el.removeEventListener('onanimationsfinish', prevProps.onAnimationsFinish as EventListener);
    if (props.onAnimationsFinish)
      el.addEventListener('onanimationsfinish', props.onAnimationsFinish as EventListener);
  };

  // Equivalent of componentDidMount
  onMount(() => {
    updateProperties();
    if (el) {
      el.digits = props.digits;
      el.data = props.data();
    }
  });

  // Equivalent of getSnapshotBeforeUpdate
  // @ts-ignore
  createEffect((prevProps?: NumberFlowImplProps_NoSignals) => {
    updateProperties(prevProps);

    // eslint-disable-next-line solid/reactivity
    if (prevProps?.data !== props.data()) {
      if (props.group()) {
        props.group()!.willUpdate();
        props.group()!.didUpdate();
        return;
      }
      if (!props.isolate) {
        el?.willUpdate();
        el?.didUpdate();
        return;
      }
    }

    return {
      ...props,
      group: props.group(),
      data: props.data(),
    };
  });

  /**
   * It's exactly like a signal setter, but we're setting two things:
   * - innerRef (from props)
   * - this ref
   */
  const handleRef = (elRef: NumberFlowElement) => {
    // eslint-disable-next-line solid/reactivity
    props.innerRef = elRef;
    el = elRef;
  };

  const [_used, others] = splitProps(props, [
    // Remove the 'used'
    'class',
    'aria-label',
    'role',
    'digits',
    'data',
    'innerHTML',
    // Also remove the ones used in `updateProperties`
    'transformTiming',
    'spinTiming',
    'opacityTiming',
    'animated',
    'respectMotionPreference',
    'trend',
    'plugins',
  ]);

  return (
    <Dynamic
      component="number-flow"
      ref={handleRef}
      //   https://docs.solidjs.com/reference/jsx-attributes/attr
      attr:data-will-change={props.willChange ? '' : undefined}
      class={props.class}
      aria-label={props.data()?.valueAsString}
      {...others}
      role="img"
      digits={props.digits}
      // Make sure data is set last, everything else is updated:
      data={props.data()}
      // eslint-disable-next-line solid/no-innerhtml
      innerHTML={renderInnerHTML(props.data()!)}
    />
  );
}

// ===========================================================================
// ROOT
// ===========================================================================
export type NumberFlowProps = BaseProps & {
  value: Value;
  locales?: Intl.LocalesArgument;
  format?: Format;
  prefix?: string;
  suffix?: string;
};

export default function NumberFlow(props: VoidProps<NumberFlowProps>) {
  const [_, others] = splitProps(props, ['value', 'locales', 'format', 'prefix', 'suffix']);

  let innerRef: NumberFlowElement | undefined;
  const group = useNumberFlowGroupContext();

  const localesString = createMemo(() => (props.locales ? JSON.stringify(props.locales) : ''));
  const formatString = createMemo(() => (props.format ? JSON.stringify(props.format) : ''));
  const data = createMemo(() => {
    const formatter = (formatters[`${localesString()}:${formatString()}`] ??= new Intl.NumberFormat(
      props.locales,
      props.format,
    ));

    return formatToData(props.value, formatter, props.prefix, props.suffix);
  });

  return <NumberFlowImpl {...others} group={group} data={data} innerRef={innerRef} />;
}

// ===========================================================================
// NumberFlowGroup
// ===========================================================================

type GroupContext = {
  useRegister: (ref: NumberFlowElement) => void;
  willUpdate: () => void;
  didUpdate: () => void;
};

const NumberFlowGroupContext = createContext<Accessor<GroupContext | undefined>>(() => undefined);

const useNumberFlowGroupContext = () => useContext(NumberFlowGroupContext);

export function NumberFlowGroup(props: FlowProps) {
  let flows = new Set<NumberFlowElement | undefined>();
  let updating = false;
  let pending = new WeakMap<NumberFlowElement, boolean>();

  const value = createMemo<GroupContext>(() => ({
    useRegister(ref) {
      onMount(() => {
        flows.add(ref);
        onCleanup(() => {
          flows.delete(ref);
        });
      });
    },
    willUpdate() {
      if (updating) return;
      updating = true;
      flows.forEach((ref) => {
        const f = ref;
        if (!f || !f.created) return;
        f.willUpdate();
        pending.set(f, true);
      });
    },
    didUpdate() {
      flows.forEach((ref) => {
        const f = ref;
        if (!f || !pending.get(f)) return;
        f.didUpdate();
        pending.delete(f);
      });
      updating = false;
    },
  }));

  return (
    <NumberFlowGroupContext.Provider value={value}>
      {props.children}
    </NumberFlowGroupContext.Provider>
  );
}

// ===========================================================================
// src/index.tsx
// ===========================================================================

import {
  canAnimate as _canAnimate,
  prefersReducedMotion as _prefersReducedMotion,
} from 'number-flow';

function usePrefersReducedMotion() {
  const [prefersReducedMotion, set] = createSignal(false);

  onMount(() => {
    set(_prefersReducedMotion?.matches ?? false);

    const onChange = ({ matches }: MediaQueryListEvent) => {
      set(matches);
    };
    _prefersReducedMotion?.addEventListener('change', onChange);

    onCleanup(() => {
      _prefersReducedMotion?.removeEventListener('change', onChange);
    });
  });

  return prefersReducedMotion;
}

/** Untested, but based on the implementation in https://github.com/barvian/number-flow/blob/main/packages/svelte/src/lib/index.ts. */
export function useCanAnimate(
  props: { respectMotionPreference: boolean } = { respectMotionPreference: true },
) {
  const [canAnimate, setCanAnimate] = createSignal(_canAnimate);

  onMount(() => {
    setCanAnimate(_canAnimate);
  });

  const prefersReducedMotion = usePrefersReducedMotion();

  const canAnimateWithPreference = createMemo(() => {
    canAnimate() && !prefersReducedMotion();
  });

  const finalCanAnimate = createMemo(() => {
    return props.respectMotionPreference ? canAnimateWithPreference() : canAnimate();
  });

  return finalCanAnimate;
}
