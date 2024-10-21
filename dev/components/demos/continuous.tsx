import Demo, { DemoSwitch, type DemoProps } from 'dev/components/demos/base-demo';

import { useCycle } from 'dev/hooks/use-cycle';
import { createSignal } from 'solid-js';
import NumberFlow from 'src';

const NUMBERS = [120, 140];

export default function ContinuousDemo(props: Omit<DemoProps, 'children' | 'code'>) {
  const [value, cycleValue] = useCycle(NUMBERS);
  const [continuous, setContinuous] = createSignal(false);

  return (
    <>
      <Demo
        {...props}
        title={
          <DemoSwitch checked={continuous()} onChange={setContinuous}>
            <code class="font-semibold">continuous</code>
          </DemoSwitch>
        }
        onClick={cycleValue}
      >
        <div class="~text-xl/4xl flex items-center gap-4">
          <NumberFlow
            continuous={continuous()}
            style={{ '--number-flow-char-height': '0.85em' }}
            value={value()}
            class="text-4xl font-semibold"
          />
        </div>
      </Demo>
    </>
  );
}