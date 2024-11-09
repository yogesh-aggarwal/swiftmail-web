import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { Logger } from "./logger"

describe("Logger", () => {
   let logger: Logger

   beforeEach(() => {
      logger = new Logger("TestLogger")
      vi.spyOn(console, "log").mockImplementation(() => {})
      vi.spyOn(console, "warn").mockImplementation(() => {})
      vi.spyOn(console, "trace").mockImplementation(() => {})
   })

   afterEach(() => {
      vi.restoreAllMocks()
   })

   it("should log info messages correctly", () => {
      logger.info("This is an info message")
      expect(console.log).toHaveBeenCalledWith(
         "%c[ℹ️ TestLogger]",
         "color: #2196f3; font-weight: 400;",
         "This is an info message"
      )
   })

   it("should log error messages correctly", () => {
      logger.error("This is an error message")
      expect(console.trace).toHaveBeenCalledWith(
         "%c[🏮 TestLogger]",
         "color: #ff4b4b; font-weight: 600;",
         "This is an error message"
      )
   })

   it("should log success messages correctly", () => {
      logger.success("This is a success message")
      expect(console.log).toHaveBeenCalledWith(
         "%c[✅ TestLogger]",
         "color: #00b97f; font-weight: 500;",
         "This is a success message"
      )
   })

   it("should log warn messages correctly", () => {
      logger.warn("This is a warn message")
      expect(console.warn).toHaveBeenCalledWith(
         "%c[⚠️ TestLogger]",
         "color: #ffeb3b; font-weight: 600;",
         "This is a warn message"
      )
   })

   it("should log debug messages correctly", () => {
      logger.debug("This is a debug message")
      expect(console.log).toHaveBeenCalledWith(
         "%c[🐞 TestLogger]",
         "color: #ff9800; font-weight: 400;",
         "This is a debug message"
      )
   })
})
