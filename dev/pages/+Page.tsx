import ContinuousDemo from "dev/components/demos/continuous"
import IsolateDemo from "dev/components/demos/isolate"
import StylingDemo from "dev/components/demos/styling"
import SuffixDemo from "dev/components/demos/suffix"
import TabularNumsDemo from "dev/components/demos/tabular-nums"
import TimingsDemo from "dev/components/demos/timings"
import TrendDemo from "dev/components/demos/trend"
import { useCycle } from "dev/hooks/use-cycle"
import type { Format } from "number-flow"
import NumberFlow from "src"
import pkgJSON from "src/../package.json"
import { IconGithub } from "../icons/github"
import { IconShuffle } from "../icons/shuffle"
import { IconSolidJS } from "../icons/solidjs"

const NUMBERS = [321, -3243.6, 42, 398.43, -3243.5, 1435237.2, 12348.43, -3243.6, 54323.2]
const LOCALES = ["fr-FR", "en-US", "fr-FR", "en-US", "en-US", "zh-CN", "en-US", "en-US", "fr-FR"]
const FORMATS = [
  {
    // style: "unit",
    // unit: "meter",
    // notation: "compact",
    // signDisplay: "never",
  },
  {
    style: "currency",
    currency: "USD",
    currencySign: "accounting",
    signDisplay: "always",
  },
  {},
  {
    style: "percent",
    signDisplay: "always",
  },
  {},
  {
    style: "unit",
    unit: "meter",
    notation: "compact",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "never",
  },
  {
    style: "currency",
    currency: "USD",
  },
  {},
  {
    // style: "percent",
    signDisplay: "always",
  },
] as Format[]

export default function HomePage() {
  const [value, cycleValue] = useCycle(NUMBERS)
  const [locale, cycleLocale] = useCycle(LOCALES)
  const [format, cycleFormat] = useCycle(FORMATS)

  function cycle() {
    cycleValue()
    cycleLocale()
    cycleFormat()
  }
  return (
    <div class="min-h-screen bg-zinc-950 font-sans text-white">
      <div class="mx-auto flex w-full max-w-4xl flex-col items-center gap-y-5 px-8 py-20">
        <div class="container inline-flex items-center justify-center whitespace-nowrap text-center">
          <h1 class="font-medium">
            <a class="group/link font-medium" href="/">
              NumberFlow
            </a>
          </h1>
          &nbsp;<span class="text-muted text-zinc-500">for</span>&nbsp;
          <button
            class="btn-secondary group inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-2 py-1 pr-1.5 font-medium text-primary transition duration-[.16s] ease-out hover:bg-zinc-800"
            type="button"
            aria-haspopup="menu"
            aria-expanded="false"
          >
            <IconSolidJS class="size-6" />
            Solid
          </button>
          <span class="ml-2 text-sm text-zinc-400">v{pkgJSON.version}</span>
        </div>
        <NumberFlow
          class="font-semibold text-6xl"
          isolate={false}
          value={value()}
          locales={locale()}
          format={format()}
        />

        <div class="mt-4 flex items-center gap-x-3">
          <button
            class="flex items-center gap-x-2 rounded-full bg-neutral-900 px-6 py-3 transition hover:bg-neutral-800 active:scale-95"
            onClick={cycle}
          >
            <IconShuffle />
            Shuffle
          </button>

          <a
            href="https://github.com/blankeos/solid-number-flow"
            target="_blank"
            class="rounded-full border border-zinc-700 p-3 transition hover:bg-zinc-800 active:scale-95"
            rel="noopener"
          >
            <IconGithub class="h-5 w-5" />
          </a>
        </div>

        <p class="~text-base/lg prose prose-muted dark:prose-invert mt-4 max-w-md text-balance text-center text-zinc-400">
          An animated number component for Solid. Dependency-free. Accessible. Customizable.
        </p>

        <p class="text-sm text-zinc-500">
          Ported from{" "}
          <a href="https://number-flow.barvian.me" class="underline hover:text-zinc-300">
            number-flow.barvian.me
          </a>
        </p>
      </div>

      <div class="mx-auto flex w-full max-w-xl flex-col gap-y-24 px-5 pb-32">
        <section>
          <h2 class="mb-4 font-semibold text-2xl">Continuous</h2>
          <p class="mb-6 text-zinc-400">
            The continuous plugin makes the number transitions appear to pass through in-between
            numbers.
          </p>
          <ContinuousDemo />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-2xl">Trend</h2>
          <p class="mb-6 text-zinc-400">Controls the direction of the digits.</p>
          <TrendDemo />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-2xl">Timings</h2>
          <p class="mb-6 text-zinc-400">
            Customize animation timings for transforms, spins, and opacity.
          </p>
          <TimingsDemo />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-2xl">Suffix & Prefix</h2>
          <p class="mb-6 text-zinc-400">Add custom prefix or suffix to the number.</p>
          <SuffixDemo />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-2xl">Isolate</h2>
          <p class="mb-6 text-zinc-400">Isolate transitions from layout changes.</p>
          <IsolateDemo />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-2xl">Styling</h2>
          <p class="mb-6 text-zinc-400">Style specific parts of the component using CSS ::part.</p>
          <StylingDemo />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-2xl">Tabular Nums</h2>
          <p class="mb-6 text-zinc-400">
            Ensure all numbers are the same width to prevent shifting.
          </p>
          <TabularNumsDemo />
        </section>
      </div>
    </div>
  )
}
