export interface ILogger {
   info(...message: any[]): void
   error(...message: any[]): void
   success(...message: any[]): void
   warn(...message: any[]): void
}
