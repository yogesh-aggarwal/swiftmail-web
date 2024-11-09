/**
 * Type representing the telemetry data.
 */
export type TelemetryData = {
   /** Geolocation coordinates */
   geo: [number, number] | null

   /** Browser information */
   browser: {
      /** User agent string */
      ua: string

      /** Language code */
      lang: string

      /** Whether the browser is in incognito mode */
      incognito: boolean
   }

   /** User permissions */
   perms: {
      /** Geolocation permission */
      geo: PermissionState

      /** Notification permission */
      notif: PermissionState
   }

   /** Network information */
   net: {
      conn: string
   }

   /** Performance */
   perf: {
      /** Time to first byte in milliseconds */
      ttfb: number | -1

      /** Time to first paint in milliseconds */
      ttfp: number | -1

      /** Time to interactive in milliseconds */
      tti: number | -1
   }

   /** Device hardware information */
   device: {
      /** Number of CPU cores */
      cpu: number | -1

      /** Amount of RAM in GB */
      ram: number | -1

      /** Amount of storage in GB */
      storage: number | -1

      /** Screen size in pixels */
      screen: [number, number] | [-1, -1]
   }
}

/**
 * Interface representing a telemetry service.
 */
export interface ITelemetry {
   /**
    * Method responsible to collect the telemetry data.
    */
   collect(): Promise<TelemetryData>
}
