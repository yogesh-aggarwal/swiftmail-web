import { API } from "@api/api"
import { VAPID_PUBLIC_KEY } from "@core/constants"
import { Manip } from "./manip"

export class PushNotificationManager {
   /**
    * Registers a service worker if the browser supports it.
    *
    * This method checks if the `serviceWorker` property exists in the `navigator` object.
    * If it does, it attempts to register a service worker located at `/sw.js`.
    * If the registration fails, an error message is logged to the console.
    *
    * @returns A promise that resolves when the service worker is registered,
    * or immediately if the browser does not support service workers.
    *
    * @example
    * ```typescript
    * await registerServiceWorker();
    * ```
    */
   static async registerServiceWorker(): Promise<void> {
      if (!("serviceWorker" in navigator)) return

      try {
         await navigator.serviceWorker.register("/sw.js")
      } catch (error) {
         console.error("Failed to register service worker:", error)
      }
   }

   /**
    * Retrieves the current permission status for displaying notifications.
    *
    * @returns A promise that resolves to the current notification permission status.
    * Possible values are `"granted"`, `"denied"`, or `"default"`.
    *
    * @example
    * ```typescript
    * const permission = await getPermissionStatus();
    * console.log("Notification permission status:", permission);
    * ```
    */
   static async getPermissionStatus(): Promise<NotificationPermission> {
      return Notification.permission
   }

   /**
    * Requests permission from the user to display notifications.
    *
    * @throws Will throw an error if the user does not grant permission for notifications.
    * @returns A promise that resolves when the permission request is complete.
    *
    * @example
    * ```typescript
    * try {
    *    await askUserPermission();
    *    console.log("User granted permission for notifications.");
    * } catch (error) {
    *    console.error("User denied permission for notifications:", error);
    * }
    * ```
    */
   static async askUserPermission(): Promise<void> {
      const permission = await this.getPermissionStatus()
      if (permission === "granted") return

      const newPermission = await Notification.requestPermission()
      if (newPermission !== "granted") {
         throw new Error("User denied permission")
      }
   }

   /**
    * Subscribes the user to push notifications.
    *
    * This function waits for the service worker to be ready, then subscribes the user to push notifications
    * using the provided VAPID public key. It sends the subscription details to the server for registration.
    *
    * @returns A promise that resolves when the subscription process is complete.
    *
    * @throws If the subscription or server registration fails.
    *
    * @example
    * ```typescript
    * try {
    *    await subscribeUserToPush();
    *    console.log("User subscribed to push notifications successfully.");
    * } catch (error) {
    *    console.error("Failed to subscribe user to push notifications:", error);
    * }
    * ```
    */
   static async subscribe(): Promise<void> {
      // Wait for service worker to be ready
      const registration = await navigator.serviceWorker.ready

      // Get the existing subscription
      let subscription = await registration.pushManager.getSubscription()
      if (subscription) {
         // Get the subscription key as a Uint8Array
         const subscriptionKey = subscription.options.applicationServerKey
         if (!subscriptionKey) return
         const subscriptionKeyBytes = new Uint8Array(subscriptionKey)

         // Get the current VAPID key as a Uint8Array
         const currentKeyBytes = Manip.urlB64ToUint8Array(VAPID_PUBLIC_KEY)

         // Check if the existing subscription has the same key as the current VAPID key
         if (!Manip.compareUInt8Arrays(subscriptionKeyBytes, currentKeyBytes)) {
            await subscription.unsubscribe()
            subscription = null
         }
      }

      // If there is no existing subscription, subscribe the user
      if (!subscription) {
         subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: Manip.urlB64ToUint8Array(VAPID_PUBLIC_KEY),
         })
      }

      // Get the subscription
      const subscriptionDetails = JSON.parse(JSON.stringify(subscription))

      // Send subscription details to your server

      const body = {
         endpoint: subscriptionDetails.endpoint,
         p256dh: subscriptionDetails.keys.p256dh,
         auth: subscriptionDetails.keys.auth,
      }

      const [success, error] = await API.request({
         url: API.buildURL("/notification/subscribe", {}),
         method: "POST",
         body: body,
      })

      if (!success) {
         console.error("Failed to send subscription to server:", error!.message)
      }
   }
}
