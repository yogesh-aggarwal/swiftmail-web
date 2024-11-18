import { digestsStore, inboxStore, userStore } from "src/lib/state"
import { WSClient } from "./client"

export const WS = WSClient.getInstance({
   reconnection: true,
   reconnectionAttempts: 3,
   reconnectionDelay: 5000,

   onConnect: () => console.log("Connected to the websocket server"),
   onDisconnect: () => console.log("Disconnected from the websocket server"),

   bindEvents: (socket) => {
      socket.on("user", (data: any) => {
         console.log(data)
         userStore.set(data)
      })
      socket.on("inbox", (data: any) => {
         console.log(data)
         inboxStore.set(data)
      })
      socket.on("digests", (data: any) => {
         console.log(data)
         digestsStore.set(data)
      })

      socket.emit("inbox")
      socket.emit("user")
      socket.emit("digests")
   },
})
