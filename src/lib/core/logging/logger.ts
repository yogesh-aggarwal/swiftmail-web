import { ILogger } from "./logger.types"

/**
 * Logger class implementing the ILogger interface.
 * Provides logging methods with customized styles for different log levels.
 */
export class Logger implements ILogger {
   /** The name or context label for the logger instance, included in log messages. */
   name: string

   /**
    * Creates a new instance of Logger.
    * @param name - The label associated with this logger instance, used to identify log messages by context.
    */
   constructor(name: string) {
      this.name = name
   }

   /**
    * Formats arguments for console messages with a specific style.
    *
    * @param tag - The emoji or symbol representing the log level.
    * @param color - The color to apply to the log level tag.
    * @param fontWeight - The weight of the font for the log level tag.
    * @param message - The actual message(s) to be logged.
    * @returns An array of formatted arguments, ready for styled logging.
    */
   protected makeArguments(tag: string, color: string, fontWeight: number, message: any[]): any[] {
      return [`%c[${tag} ${this.name}]`, `color: ${color}; font-weight: ${fontWeight};`, ...message]
   }

   /**
    * Logs an informational message to the console with a blue info icon.
    *
    * @param message - The message(s) to be logged.
    */
   info(...message: any[]): void {
      console.log(...this.makeArguments("ℹ️", "#2196f3", 400, message))
   }

   /**
    * Logs an error message with a red icon and includes a stack trace.
    *
    * @param message - The message(s) to be logged.
    */
   error(...message: any[]): void {
      console.trace(...this.makeArguments("🏮", "#ff4b4b", 600, message))
   }

   /**
    * Logs a success message to the console with a green check mark.
    *
    * @param message - The message(s) to be logged.
    */
   success(...message: any[]): void {
      console.log(...this.makeArguments("✅", "#00b97f", 500, message))
   }

   /**
    * Logs a warning message with a yellow icon.
    *
    * @param message - The message(s) to be logged.
    */
   warn(...message: any[]): void {
      console.warn(...this.makeArguments("⚠️", "#ffeb3b", 600, message))
   }

   /**
    * Logs a debug message to the console with an orange debug icon.
    *
    * @param message - The message(s) to be logged.
    */
   debug(...message: any[]): void {
      console.log(...this.makeArguments("🐞", "#ff9800", 400, message))
   }
}
