import {
  canAnimate as _canAnimate,
  type Format,
  NumberFlowLite,
  PartitionedParts,
  partitionParts,
  prefersReducedMotion,
  slottedStyles,
  SlottedTag,
  type Value,
} from 'number-flow';
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  splitProps,
  VoidProps,
} from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import { Dynamic } from 'solid-js/web';
export type { Format, Trend, Value } from 'number-flow';

// Can't wait to not have to do this in React 19:
const OBSERVED_ATTRIBUTES = ['parts'] as const;
type ObservedAttribute = (typeof OBSERVED_ATTRIBUTES)[number];
export class NumberFlowElement extends NumberFlowLite {
  static observedAttributes = OBSERVED_ATTRIBUTES;
  attributeChangedCallback(attr: ObservedAttribute, _oldValue: string, newValue: string) {
    this[attr] = JSON.parse(newValue);
  }
}

export type NumberFlowProps = JSX.HTMLAttributes<NumberFlowElement> & {
  value: Value;
  locales?: Intl.LocalesArgument;
  format?: Format;
  isolate?: boolean;
  animated?: boolean;
  respectMotionPreference?: boolean;
  willChange?: boolean;
  onAnimationsStart?: () => void;
  onAnimationsFinish?: () => void;
  trend?: (typeof NumberFlowElement)['prototype']['trend'];
  continuous?: (typeof NumberFlowElement)['prototype']['continuous'];
  opacityTiming?: (typeof NumberFlowElement)['prototype']['opacityTiming'];
  transformTiming?: (typeof NumberFlowElement)['prototype']['transformTiming'];
  spinTiming?: (typeof NumberFlowElement)['prototype']['spinTiming'];
};

// You're supposed to cache these between uses:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
// Serialize to strings b/c React:
const formatters: Record<string, Intl.NumberFormat> = {};

NumberFlowElement.define();

// ===========================================================================
// IMPLEMENTATION (Equivalent to the React Class Component)
// ===========================================================================
type NumberFlowImplProps = Omit<NumberFlowProps, 'value' | 'locales' | 'format'> & {
  innerRef: NumberFlowElement | undefined;
  parts: Accessor<PartitionedParts>;
};

/** Used for `prevProps` because accessing signals always gives "latest" values, we don't want that. */
type NumberFlowImplProps_NoSignals = Omit<NumberFlowImplProps, 'parts'> & {
  parts: PartitionedParts;
};

function NumberFlowImpl(props: VoidProps<NumberFlowImplProps>) {
  let el: NumberFlowElement | undefined;

  const updateNonPartsProps = (prevProps?: NumberFlowImplProps_NoSignals) => {
    if (!el) return;

    // el.manual = !props.isolate; (Not sure why but this breaks the animations, so isolate might not work right now. I personally think it has a very niche usecase though).
    if (props.animated != null) el.animated = props.animated;
    if (props.respectMotionPreference != null)
      el.respectMotionPreference = props.respectMotionPreference;
    if (props.trend != null) el.trend = props.trend;
    if (props.continuous != null) el.continuous = props.continuous;
    if (props.opacityTiming) el.opacityTiming = props.opacityTiming;
    if (props.transformTiming) el.transformTiming = props.transformTiming;
    if (props.spinTiming) el.spinTiming = props.spinTiming;

    if (prevProps?.onAnimationsStart)
      el.removeEventListener('animationsstart', prevProps.onAnimationsStart);
    if (props.onAnimationsStart) el.addEventListener('animationsstart', props.onAnimationsStart);

    if (prevProps?.onAnimationsFinish)
      el.removeEventListener('animationsfinish', prevProps.onAnimationsFinish);
    if (props.onAnimationsFinish) el.addEventListener('animationsfinish', props.onAnimationsFinish);
  };

  onMount(() => {
    updateNonPartsProps();
    if (el) {
      el.parts = props.parts();
    }
  });

  createEffect((prevProps?: NumberFlowImplProps_NoSignals) => {
    updateNonPartsProps(prevProps);
    if (props.isolate) {
      return;
    }
    if (prevProps?.parts === props.parts()) {
      return;
    }
    el?.willUpdate();

    // The returned should not have any signals (because accessing it in the next
    // call will contain the "current" value). We want it to be "previous".
    return {
      ...props,
      parts: props.parts(),
    };
  });

  /**
   * It's exactly like a signal setter, but we're setting two things:
   * - innerRef (from props)
   * - this ref
   */
  const handleRef = (elRef: NumberFlowElement) => {
    props.innerRef = elRef;
    el = elRef;
  };

  const [_used, others] = splitProps(props, [
    'parts',
    // From Impl
    'class',
    'willChange',
    // These are set in updateNonPartsProps, so ignore them here:
    'animated',
    'respectMotionPreference',
    'isolate',
    'trend',
    'continuous',
    'opacityTiming',
    'transformTiming',
    'spinTiming',
  ]);

  // Manual Attribute setter onMount.
  onMount(() => {
    // This is a workaround until this gets fixed: https://github.com/solidjs/solid/issues/2339
    const _parts = el?.getAttribute('attr:parts');
    if (_parts) {
      el?.removeAttribute('attr:parts');
      el?.setAttribute('parts', _parts);
    }
  });

  return (
    <Dynamic
      ref={handleRef}
      component="number-flow"
      class={props.class}
      //   https://docs.solidjs.com/reference/jsx-attributes/attr
      attr:data-will-change={props.willChange ? '' : undefined}
      {...others}
      attr:parts={JSON.stringify(props.parts())}
    >
      <Dynamic component={SlottedTag} style={slottedStyles({ willChange: props.willChange })}>
        {props.parts().formatted}
      </Dynamic>
    </Dynamic>
  );
}

// ===========================================================================
// ROOT
// ===========================================================================
export default function NumberFlow(props: VoidProps<NumberFlowProps>) {
  const localesString = createMemo(
    () => (props.locales ? JSON.stringify(props.locales) : ''),
    [props.locales],
  );
  const [_, others] = splitProps(props, ['value', 'format', 'locales']);

  const formatString = createMemo(() => (props.format ? JSON.stringify(props.format) : ''));
  const parts = createMemo(() => {
    const formatter = (formatters[`${localesString()}:${formatString()}`] ??= new Intl.NumberFormat(
      props.locales,
      props.format,
    ));

    return partitionParts(props.value, formatter);
  });

  let innerRef: NumberFlowElement | undefined;

  return <NumberFlowImpl {...others} innerRef={innerRef} parts={parts} />;
}

// SSR-safe canAnimate
/** Unfinished and untested. */
export function useCanAnimate(
  props: { respectMotionPreference: boolean } = { respectMotionPreference: true },
) {
  const [canAnimate, setCanAnimate] = createSignal(_canAnimate);
  const [reducedMotion, setReducedMotion] = createSignal(false);

  // Handle SSR:
  onMount(() => {
    setCanAnimate(_canAnimate);
    setReducedMotion(prefersReducedMotion?.matches ?? false);
  });

  // Listen for reduced motion changes if needed:
  createEffect(() => {
    if (!props.respectMotionPreference) return;
    const onChange = ({ matches }: MediaQueryListEvent) => {
      setReducedMotion(matches);
    };
    prefersReducedMotion?.addEventListener('change', onChange);
    return () => {
      prefersReducedMotion?.removeEventListener('change', onChange);
    };
  });

  return createMemo<boolean>(() => {
    return canAnimate() && (!props.respectMotionPreference || !reducedMotion);
  });
}
