import { continuous } from "number-flow/plugins"
import { createSignal, onMount } from "solid-js"
// import { NumberFlow } from 'src/NumberFlow';
import NumberFlow from "solid-number-flow"

export default function Page() {
  const [toggle, setToggle] = createSignal(false)
  const [value1, setValue1] = createSignal(123)
  const [value2, setValue2] = createSignal(0)
  const [value3, setValue3] = createSignal(123)
  const [value4, setValue4] = createSignal(0)
  const [value5, setValue5] = createSignal(0)

  function triggerChange(useAlternateValues: boolean = false) {
    const defaultValues = {
      value1: 500,
      value2: 1.42,
      value3: 500,
      value4: 1_500_540,
      value5: 88,
    }

    const alternateValues = {
      value1: 100,
      value2: 1203,
      value3: 7298,
      value4: 12.1,
      value5: 50,
    }

    const values = useAlternateValues ? alternateValues : defaultValues

    setTimeout(() => {
      setValue1(values.value1)
    }, 500)
    setTimeout(() => {
      setValue2(values.value2)
    }, 800)
    setTimeout(() => {
      setValue3(values.value3)
    }, 1000)
    setTimeout(() => {
      setValue4(values.value4)
    }, 1500)
    setTimeout(() => {
      setValue5(values.value5)
    }, 1500)
  }

  onMount(() => {
    triggerChange()
  })

  return (
    <div class="flex min-h-screen flex-col items-center justify-center gap-y-3 bg-zinc-950 text-white">
      <NumberFlow value={value1()} locales="en-US" plugins={[continuous]} willChange />
      <NumberFlow
        value={value2()}
        locales="en-US"
        format={{
          style: "percent",
        }}
      />
      <NumberFlow value={value3()} locales="en-US" />
      <NumberFlow
        value={value4()}
        locales="en-US"
        format={{
          style: "currency",
          currency: "USD",
        }}
        prefix=""
      />
      <NumberFlow
        value={value5()}
        format={{ style: "currency", currency: "USD", trailingZeroDisplay: "stripIfInteger" }}
        suffix="/mo"
      />

      <button
        onClick={() => {
          setToggle(!toggle())
          triggerChange(toggle())
        }}
      >
        Change
      </button>

      <a href="/">Back to Home</a>
    </div>
  )
}
