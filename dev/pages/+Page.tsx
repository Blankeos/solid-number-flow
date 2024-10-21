import ContinuousDemo from 'dev/components/demos/continuous';
import TrendDemo from 'dev/components/demos/trend';
import { useCycle } from 'dev/hooks/use-cycle';
import { Format } from 'number-flow';
import NumberFlow from 'src';
import { IconGithub } from '../icons/github';
import { IconShuffle } from '../icons/shuffle';
import { IconSolidJS } from '../icons/solidjs';
import { Markdown } from '../markdown';

// @ts-ignore idk what type I need to override.
import Usage from '../markdown/usage.md';

// @ts-ignore idk what type I need to override.
import NPMInstall from '../markdown/npm-install.md';

const NUMBERS = [321, -3243.6, 42, 398.43, -3243.5, 1435237.2, 12348.43, -3243.6, 54323.2];
const LOCALES = ['fr-FR', 'en-US', 'fr-FR', 'en-US', 'en-US', 'zh-CN', 'en-US', 'en-US', 'fr-FR'];
const FORMATS = [
  {
    // style: "unit",
    // unit: "meter",
    // notation: "compact",
    // signDisplay: "never",
  },
  {
    style: 'currency',
    currency: 'USD',
    currencySign: 'accounting',
    signDisplay: 'always',
  },
  {},
  {
    style: 'percent',
    signDisplay: 'always',
  },
  {},
  {
    style: 'unit',
    unit: 'meter',
    notation: 'compact',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'never',
  },
  {
    style: 'currency',
    currency: 'USD',
  },
  {},
  {
    // style: "percent",
    signDisplay: 'always',
  },
] as Format[];

export default function HomePage() {
  const [value, cycleValue] = useCycle(NUMBERS);
  const [locale, cycleLocale] = useCycle(LOCALES);
  const [format, cycleFormat] = useCycle(FORMATS);

  function cycle() {
    cycleValue();
    cycleLocale();
    cycleFormat();
  }
  return (
    <div class="min-h-screen bg-zinc-950 text-white">
      <div class="mx-auto flex w-full max-w-4xl flex-col items-center gap-y-5 px-8 py-20">
        <span class="flex items-center gap-x-1.5 text-base">
          <IconSolidJS class="h-6 w-6" /> NumberFlow{' '}
          <span class="text-sm text-zinc-400">v0.3.0</span>
        </span>
        <NumberFlow
          class="text-6xl"
          isolate={false}
          value={value()}
          locales={locale()}
          format={format()}
        />

        <div class="flex items-center gap-x-3">
          <button
            class="flex items-center gap-x-2 rounded-full bg-neutral-900 px-6 py-3 transition active:scale-95"
            onClick={cycle}
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
          A Solid component to transition, localize, and format numbers.
          <br />
          Dependency-free. Accessible. Customizable.
        </p>

        <p class="text-zinc-400">
          Ported from{' '}
          <a href="https://github.com/barvian/number-flow" class="hover:underline" target="_blank">
            barvian/number-flow
          </a>
        </p>
      </div>

      <div class="mx-auto flex w-full max-w-xl flex-col gap-y-5 px-5">
        <div class="w-full max-w-xl overflow-hidden rounded-md border border-zinc-500 bg-[#121212] p-5 text-sm">
          <Markdown children={<NPMInstall />} />
        </div>

        <div class="w-full max-w-xl overflow-hidden rounded-md border border-zinc-500 bg-[#121212] p-5 text-sm">
          <Markdown children={<Usage />} />
        </div>
      </div>

      <div class="h-20" />

      <div class="mx-auto flex w-full max-w-xl flex-col gap-y-10 px-5">
        <TrendDemo class="" />
        <ContinuousDemo class="" />
      </div>

      <div class="h-20" />
    </div>
  );
}
