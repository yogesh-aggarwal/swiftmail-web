/**
 * ILogger interface specifying methods for various log levels.
 * Each method logs messages with distinct levels of importance.
 */
export interface ILogger {
   /**
    * Logs an informational message.
    *
    * @param message - The message(s) to be logged, providing general information.
    */
   info(...message: any[]): void

   /**
    * Logs an error message, typically used for reporting failures or issues.
    *
    * @param message - The message(s) to be logged, detailing the error context.
    */
   error(...message: any[]): void

   /**
    * Logs a success message, indicating successful completion of an operation.
    *
    * @param message - The message(s) to be logged, representing a positive outcome.
    */
   success(...message: any[]): void

   /**
    * Logs a warning message, used for highlighting potential issues or non-critical concerns.
    *
    * @param message - The message(s) to be logged, calling attention to cautionary information.
    */
   warn(...message: any[]): void

   /**
    * Logs a debug message, primarily for development and debugging purposes.
    *
    * @param message - The message(s) to be logged, aiding in debugging by providing detailed information.
    */
   debug(...message: any[]): void
}
