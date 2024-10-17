import NumberFlow, { useCanAnimate } from '../../src';

// @ts-ignore
import Usage from '../markdown/usage.md';
// @ts-ignore
import NPMInstall from '../markdown/npm-install.md';

export default function HomePage() {
  const [value, cycle] = useCycle([398.43, -3243.5, 1435237]);

  return (
    <div class="min-h-screen bg-zinc-950 text-white">
      <div class="mx-auto flex w-full max-w-4xl flex-col items-center gap-y-5 px-8 py-20">
        <span class="flex items-center gap-x-1.5 text-base">
          <IconSolidJS class="h-6 w-6" /> NumberFlow{' '}
          <span class="text-sm text-zinc-400">v0.3.0</span>
        </span>
        <NumberFlow class="text-6xl" value={value()} />

        <div class="flex items-center gap-x-3">
          <button
            class="flex items-center gap-x-2 rounded-full bg-neutral-900 px-6 py-3 transition active:scale-95"
            onClick={() => {
              cycle();
            }}
          >
            <IconShuffle />
            Shuffle
          </button>

          <a
            href="https://github.com/blankeos/solid-number-flow"
            target="_blank"
            class="rounded-full border border-white p-2 transition hover:bg-neutral-50/20 active:scale-95"
          >
            <IconGithub class="h-5 w-5" />
          </a>
        </div>

        <p class="max-w-xl text-center text-zinc-300">
          A Solid component to transition, localize, and format numbers. Dependency-free.
          Accessible. Customizable.
        </p>

        <p class="text-zinc-400">
          Ported from{' '}
          <a href="https://github.com/barvian/number-flow" class="hover:underline" target="_blank">
            barvian/number-flow
          </a>
        </p>

        <div class="w-full max-w-xl overflow-hidden rounded-md border border-zinc-500 bg-[#121212] p-5">
          <Markdown children={<NPMInstall />} />
        </div>

        <div class="w-full max-w-xl overflow-hidden rounded-md border border-zinc-500 bg-[#121212] p-5">
          <Markdown children={<Usage />} />
        </div>
      </div>
    </div>
  );
}

import { createMemo, createSignal } from 'solid-js';
import { IconShuffle } from '../icons/shuffle';
import { IconSolidJS } from '../icons/solidjs';
import { Markdown } from '../markdown';
import { IconGithub } from '../icons/github';

/**
 * A hook that toggles between two or multiple values (by implementing a common state pattern).
 *
 * Forked from https://github.com/Blankeos/bagon-hooks/blob/main/src/use-toggle/use-toggle.ts
 */
function useCycle<T = boolean>(options: readonly T[] = [false, true] as any) {
  const [_options, _setOptions] = createSignal<typeof options>(options);

  function toggle() {
    const value = _options()[0]!;
    const index = Math.abs(_options()!.indexOf(value));

    _setOptions(
      _options()!
        .slice(index + 1)
        .concat(value),
    );
  }

  const currentOption = createMemo(() => _options()[0]!);

  return [currentOption, toggle] as const;
}
