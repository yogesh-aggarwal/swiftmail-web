import { io, Socket } from "socket.io-client"
import { IWSClient, WSClientOptions, WSClientPayload } from "./client.types"

export class WSClient implements IWSClient {
   private static instance: WSClient

   private socket: Socket | null
   private options: WSClientOptions

   private constructor(options: WSClientOptions) {
      this.socket = null
      this.options = options
   }

   public static getInstance(options: WSClientOptions): WSClient {
      if (!WSClient.instance) {
         WSClient.instance = new WSClient(options)
      }

      return WSClient.instance
   }

   public connect(payload: WSClientPayload) {
      // Disconnect the old socket connection if exists
      if (this.socket) this.socket.disconnect()

      // Connect to the server with the token
      this.socket = io("http://localhost:3000", {
         path: "/ws",
         query: payload,
         reconnection: this.options.reconnection,
         reconnectionAttempts: this.options.reconnectionAttempts,
         reconnectionDelay: this.options.reconnectionDelay,
      })

      // Set the event listeners
      this.socket.on("connect", () => this.options.onConnect?.(this.socket!))
      this.socket.on("disconnect", () => this.options.onDisconnect?.())

      this.options.bindEvents(this.socket)
   }

   public disconnect() {
      if (this.socket) this.socket.disconnect()
   }
}
