import { Socket } from "socket.io-client"

export type WSClientPayload = Record<string, any>

export type WSClientOnConnectCallback = (socket: Socket) => void
export type WSClientOnDisconnectCallback = () => void
export type WSClientBindEventsCallback = (socket: Socket) => void
export interface WSClientOptions {
   reconnection: boolean
   reconnectionAttempts: number
   reconnectionDelay: number

   onConnect?: WSClientOnConnectCallback
   onDisconnect?: WSClientOnDisconnectCallback

   bindEvents: WSClientBindEventsCallback
}

export interface IWSClient {
   connect(payload: WSClientPayload, options: WSClientOptions): void
   disconnect(): void
}
