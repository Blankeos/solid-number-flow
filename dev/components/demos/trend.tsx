import Demo, { type DemoProps } from 'dev/components/demos/base-demo';

import { useCycle } from 'dev/hooks/use-cycle';
import { Trend } from 'number-flow';
import NumberFlow from 'src';

const NUMBERS = [19, 20];

export default function TrendDemo(props: Omit<DemoProps, 'children' | 'code'>) {
  const [value, cycleValue] = useCycle(NUMBERS);
  const [trend, cycleTrend] = useCycle([true, false, 'increasing', 'decreasing'] as Trend[]);

  return (
    <>
      <Demo
        {...props}
        title={
          <button class="transition active:scale-95" onClick={cycleTrend}>
            <code class="text-xs font-semibold">trend: {JSON.stringify(trend())}</code>
          </button>
        }
        onClick={cycleValue}
      >
        <div class="~text-xl/4xl flex items-center gap-4">
          <NumberFlow
            trend={trend()}
            style={{ '--number-flow-char-height': '0.85em' }}
            value={value()}
            class="text-4xl font-semibold"
          />
        </div>
      </Demo>
    </>
  );
}
