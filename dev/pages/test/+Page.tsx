import { createSignal, onMount } from 'solid-js';
import NumberFlow from 'src';

export default function Page() {
  const [value1, setValue1] = createSignal(123);
  const [value2, setValue2] = createSignal(0);
  const [value3, setValue3] = createSignal(123);
  const [value4, setValue4] = createSignal(0);

  onMount(() => {
    setTimeout(() => {
      setValue1(500);
    }, 500);
    setTimeout(() => {
      setValue2(1.42);
    }, 800);
    setTimeout(() => {
      setValue3(7298);
    }, 1000);
    setTimeout(() => {
      setValue4(1_500_540);
    }, 1500);
  });

  return (
    <div class="flex min-h-screen flex-col items-center justify-center gap-y-3 bg-zinc-950 text-white">
      <NumberFlow value={value1()} locales="en-US" />
      <NumberFlow
        value={value2()}
        locales="en-US"
        format={{
          style: 'percent',
        }}
      />
      <NumberFlow value={value3()} locales="en-US" />
      <NumberFlow
        value={value4()}
        locales="en-US"
        format={{
          style: 'currency',
          currency: 'USD',
        }}
      />
      <a href="/">Back /</a>
    </div>
  );
}
