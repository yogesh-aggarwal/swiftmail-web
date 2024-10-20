import { ILogger } from "./logger.types"

export class Logger implements ILogger {
   name: string

   constructor(name: string) {
      this.name = name
   }

   protected log(tag: string, color: string, fontWeight: number, ...message: any[]): void {
      console.info(
         `%c[${tag} ${this.name} API]`,
         `color: ${color}; font-weight: ${fontWeight};`,
         "\n",
         ...message
      )
   }

   info(...message: any[]): void {
      this.log("💁", "#2196f3", 400, message)
   }

   error(...message: any[]): void {
      this.log("🏮", "#ff4b4b", 600, message)
   }

   success(...message: any[]): void {
      this.log("✅", "#00b97f", 500, message)
   }

   warn(...message: any[]): void {
      this.log("⚠️", "#ffeb3b", 600, message)
   }
}
