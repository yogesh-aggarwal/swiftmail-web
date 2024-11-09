import { WS_API } from "@api/api"
import { Telemetry } from "@telemetry/telemetry"

// Ensure that telemetry is only sent once per session
let alreadySent = false

/**
 * Hook to collect and send telemetry data.
 *
 * This hook ensures that telemetry data is collected and sent only once.
 * It initializes a new instance of the `Telemetry` class, collects the data,
 * and sends it to the server using the `WS_API.sendOne` method.
 *
 * @remarks
 * The function uses a flag `alreadySent` to ensure that the telemetry data
 * is not collected and sent multiple times.
 *
 * @example
 * ```typescript
 * useCollectTelemetry();
 * ```
 */
export function useCollectTelemetry() {
   if (alreadySent) return
   alreadySent = true

   const t = new Telemetry()
   t.collect().then((data) => WS_API.sendOne("TELEMETRY", data))
}
