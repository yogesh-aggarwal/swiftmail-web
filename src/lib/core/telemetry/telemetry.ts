import { ITelemetry, TelemetryData } from "./telemetry.types"

/**
 * Class representing telemetry data collection.
 * Implements the ITelemetry interface.
 */
export class Telemetry implements ITelemetry {
   /**
    * Retrieves the user agent string from the browser.
    * @returns The user agent string.
    */
   private getUserAgent(): string {
      return navigator.userAgent
   }

   /**
    * Retrieves the screen size of the device.
    * @returns A tuple containing the width and height of the screen.
    */
   private getScreenSize(): [number, number] {
      return [window.screen.width, window.screen.height]
   }

   /**
    * Retrieves the connection type of the device.
    * @returns The effective connection type or "unknown" if not available.
    */
   private getConnectionType(): string {
      const connection = (navigator as any).connection || {}
      return connection.effectiveType || "unknown"
   }

   /**
    * Retrieves the geolocation of the device.
    * @returns A promise that resolves to a tuple containing the latitude and longitude, or null if not available.
    */
   private async getGeoLocation(): Promise<[number, number] | null> {
      return new Promise((resolve) => {
         if ("permissions" in navigator && "geolocation" in navigator) {
            ;(navigator as any).permissions.query({ name: "geolocation" }).then((result: any) => {
               if (result.state === "granted") {
                  navigator.geolocation.getCurrentPosition(
                     (position) => {
                        resolve([position.coords.latitude, position.coords.longitude])
                     },
                     (error) => {
                        console.warn("Geolocation access denied or unavailable:", error)
                        resolve(null)
                     }
                  )
               } else {
                  console.warn("Geolocation permission not granted.")
                  resolve(null)
               }
            })
         } else {
            console.warn("Geolocation or Permissions API is not supported by this browser.")
            resolve(null)
         }
      })
   }

   /**
    * Helper method to get CPU cores, RAM, and storage information.
    * @returns A promise that resolves to an object containing CPU cores, RAM, storage in GB, and screen size.
    */
   private async getDevice(): Promise<{
      cpu: number
      ram: number
      storage: number
      screen: [number, number]
   }> {
      const cpuCores = navigator.hardwareConcurrency || -1
      const ramInGB = ("deviceMemory" in navigator ? navigator.deviceMemory : -1) as number

      const storageInBytes = (await navigator.storage?.estimate?.()).quota || -1
      const storageInGB = storageInBytes ? Math.floor(storageInBytes / 1024 ** 3) : 0

      return { cpu: cpuCores, ram: ramInGB, storage: storageInGB, screen: this.getScreenSize() }
   }

   /**
    * Retrieves the device's language setting.
    *
    * @returns The language setting of the device. If the language cannot be determined,
    *          it defaults to "en-US".
    */
   private getDeviceLanguage(): string {
      return navigator.language || (navigator as any).userLanguage || "en-US"
   }

   /**
    * Determines if the browser is in incognito mode.
    *
    * This method checks if the `performance.memory` API is available and compares
    * the JavaScript heap size limit to the storage quota. If the heap size limit
    * is greater than the storage quota, it is likely that the browser is in incognito mode.
    *
    * @returns A promise that resolves to a boolean indicating whether the browser is in incognito mode.
    */
   private async isIncognito(): Promise<boolean> {
      if ("memory" in performance) {
         const heap = (performance as any).memory.jsHeapSizeLimit as number
         const quota = (await navigator.storage.estimate()).quota as number

         return heap > quota
      }

      return false
   }

   /**
    * Retrieves performance metrics including Time to First Byte (TTFB),
    * Time to First Paint (TTFP), and Time to Interactive (TTI).
    *
    * @returns An object containing the performance metrics:
    * - `ttfb`: Time to First Byte
    * - `ttfp`: Time to First Paint
    * - `tti`: Time to Interactive
    *
    * If the Performance API is not supported in the browser, logs an error message
    * and returns default values of -1 for all metrics.
    */
   private getPerformance() {
      // Initialize metrics object
      const performanceMetrics = {
         ttfb: -1, // Time to First Byte
         ttfp: -1, // Time to First Paint
         tti: -1, // Time to Interactive
      }

      if (window.performance) {
         const navigationEntries = performance.getEntriesByType("navigation")

         if (navigationEntries.length > 0) {
            const entry = navigationEntries[0] as any

            // Calculate Time to First Byte (TTFB)
            if (entry.responseStart && entry.requestStart) {
               performanceMetrics.ttfb = entry.responseStart - entry.requestStart
            }

            // Calculate Time to First Paint (TTFP)
            const paintEntries = performance.getEntriesByType("paint")
            if (paintEntries.length > 0) {
               performanceMetrics.ttfp = paintEntries[0].startTime
            }

            // Calculate Time to Interactive (TTI)
            performanceMetrics.tti = entry.domInteractive - entry.startTime // TTI calculation
         }
      } else {
         console.error("Performance API not supported in this browser.")
      }

      return performanceMetrics
   }

   /**
    * Retrieves the current permissions state for geolocation and notifications.
    *
    * @returns A promise that resolves to an object containing the permissions state for geolocation and notifications.
    *          The possible states are "granted", "denied", or "prompt".
    *
    * @remarks
    * If the `permissions` API is not available in the navigator, the function will return default states of "prompt" for both geolocation and notifications.
    *
    * @example
    * ```typescript
    * const permissions = await getPermissions();
    * console.log(permissions.geo); // "granted" | "denied" | "prompt"
    * console.log(permissions.notif); // "granted" | "denied" | "prompt"
    * ```
    */
   private async getPermissions(): Promise<TelemetryData["perms"]> {
      if (!("permissions" in navigator)) {
         return { geo: "prompt", notif: "prompt" }
      }

      const geo = await navigator.permissions.query({ name: "geolocation" })
      const notif = await navigator.permissions.query({ name: "notifications" })

      return { geo: geo.state, notif: notif.state }
   }

   /**
    * Collects telemetry data from the device.
    * @returns A promise that resolves to an object containing user agent, geolocation, connection type, and device information.
    */
   public async collect(): Promise<TelemetryData> {
      const [ua, lang, incognito, geoLocation, perms, connectionType, deviceInfo, performance] =
         await Promise.all([
            this.getUserAgent(),
            this.getDeviceLanguage(),
            this.isIncognito(),
            this.getGeoLocation(),
            this.getPermissions(),
            this.getConnectionType(),
            this.getDevice(),
            this.getPerformance(),
         ])

      const data: TelemetryData = {
         geo: geoLocation,
         perms: perms,
         browser: {
            ua: ua,
            lang: lang,
            incognito: incognito,
         },
         net: {
            conn: connectionType,
         },
         perf: performance,
         device: {
            cpu: deviceInfo.cpu,
            ram: deviceInfo.ram,
            storage: deviceInfo.storage,
            screen: deviceInfo.screen,
         },
      }

      return data
   }
}
