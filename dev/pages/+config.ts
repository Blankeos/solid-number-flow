import type { Config } from "vike/types"
import config from "vike-solid/config"

// Default config (can be overridden by pages)
export default {
  extends: [config],
  ssr: true,
} satisfies Config
