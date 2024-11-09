import { ILogger } from "@logging/logger.types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { RestAPI } from "./rest"
import { RestBody, RestHeaders, RestRequest, RestResponse } from "./rest.types"

// Mock implementation of ILogger
class MockLogger implements ILogger {
   info = vi.fn()
   error = vi.fn()
   success = vi.fn()
   warn = vi.fn()
   debug = vi.fn()
}

// Mock headers
const mockHeaders: RestHeaders = { "Content-Type": "application/json" }

// Mock body
const mockBody: RestBody = { name: "Test" }

describe("RestAPI", () => {
   let mockLogger: MockLogger

   beforeEach(() => {
      mockLogger = new MockLogger()
   })

   // Test constructor logic
   describe("constructor", () => {
      it("should initialize with default logger when none is provided", () => {
         const api = new RestAPI({ baseURI: "https://example.com" })
         expect(api).toBeInstanceOf(RestAPI)
      })

      it("should use the provided logger if passed", () => {
         const api = new RestAPI({
            baseURI: "https://example.com",
            logger: mockLogger,
         })
         expect(api["logger"]).toBe(mockLogger)
      })

      it("should set baseHeaders to an empty object if none is provided", () => {
         const api = new RestAPI({
            baseURI: "https://example.com",
         })
         expect(api["baseHeaders"]()).toEqual({})
      })
   })

   // Test buildURL
   describe("buildURL", () => {
      it("should append query parameters to the URL correctly", () => {
         const api = new RestAPI({ baseURI: "https://example.com" })
         const url = api.buildURL("/test", { key1: "value1", key2: "value2" })
         expect(url.toString()).toBe("https://example.com/test?key1=value1&key2=value2")
      })

      it("should encode query parameters correctly", () => {
         const api = new RestAPI({ baseURI: "https://example.com" })
         const url = api.buildURL("test", { "special param": "value with space" })
         expect(url.toString()).toBe("https://example.com/test?special+param=value+with+space")
      })

      it("should handle undefined and empty query parameters", () => {
         const api = new RestAPI({ baseURI: "https://example.com" })
         const url = api.buildURL("/test", {})
         expect(url.toString()).toBe("https://example.com/test")

         const emptyUrl = api.buildURL("/test", {})
         expect(emptyUrl.toString()).toBe("https://example.com/test")
      })
   })

   // Mock setup for request handling
   global.fetch = vi.fn()

   // Test request method
   describe("request", () => {
      afterEach(() => {
         vi.clearAllMocks()
      })

      it("should make a successful GET request", async () => {
         const mockResponse = { message: "Success", data: { id: 1 } }
         ;(global.fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse),
            status: 200,
            statusText: "OK",
         })

         const api = new RestAPI({ baseURI: "https://example.com" })
         const request: RestRequest = {
            url: new URL("https://example.com/test"),
            method: "GET",
            additionalHeaders: {},
         }
         const [response, error] = await api.request(request)

         expect((response as RestResponse<any>)?.data).toEqual({ id: 1 })
         expect((response as RestResponse<any>)?.status).toBe(200)
         expect((response as RestResponse<any>)?.message).toBe("Success")
         expect(error).toBeNull()
      })

      it("should handle empty response body", async () => {
         ;(global.fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(null),
            status: 204,
            statusText: "No Content",
         })

         const api = new RestAPI({ baseURI: "https://example.com" })
         const request: RestRequest = {
            url: new URL("https://example.com/test"),
            method: "GET",
            additionalHeaders: {},
         }
         const [response, error] = await api.request(request)

         expect(response?.data).toBeNull()
         expect(response?.status).toBe(204)
         expect(response?.message).toBe("No Content")
         expect(error).toBeNull()
      })

      it("should make a POST request with a body", async () => {
         const mockResponse = { message: "Created", data: { id: 1 } }
         ;(global.fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse),
            status: 201,
            statusText: "Created",
         })

         const api = new RestAPI({ baseURI: "https://example.com" })
         const request: RestRequest = {
            url: new URL("https://example.com/test"),
            method: "POST",
            additionalHeaders: {},
            body: mockBody,
         }
         const [response, error] = await api.request(request)

         expect((response as RestResponse<any>)?.data).toEqual({ id: 1 })
         expect((response as RestResponse<any>)?.status).toBe(201)
         expect((response as RestResponse<any>)?.message).toBe("Created")
         expect(error).toBeNull()
      })

      it("should handle JSON parsing error", async () => {
         ;(global.fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.reject(new Error("Invalid JSON")),
            status: 200,
            statusText: "OK",
         })

         const api = new RestAPI({ baseURI: "https://example.com" })
         const request: RestRequest = {
            url: new URL("https://example.com/test"),
            method: "GET",
            additionalHeaders: {},
         }
         const [response, error] = await api.request(request)

         expect(response).toBeNull()
         expect(error?.status).toBe(500)
         expect(error?.message).toBe("Failed to parse JSON")
      })

      it("should handle request timeout", async () => {
         ;(global.fetch as any).mockRejectedValue(new Error("Timeout"))

         const api = new RestAPI({ baseURI: "https://example.com" })
         const request: RestRequest = {
            url: new URL("https://example.com/test"),
            method: "GET",
            additionalHeaders: {},
         }
         const [response, error] = await api.request(request)

         expect(response).toBeNull()
         expect(error?.status).toBe(503)
         expect(error?.message).toBe("Network error")
      })

      it("should handle 4XX errors gracefully", async () => {
         const mockResponse = { message: "Invalid request" }
         ;(global.fetch as any).mockResolvedValue({
            ok: false,
            json: () => Promise.resolve(mockResponse),
            status: 400,
            statusText: "Bad Request",
         })

         const api = new RestAPI({ baseURI: "https://example.com", logger: mockLogger })
         const request: RestRequest = {
            url: new URL("https://example.com/test"),
            method: "GET",
            additionalHeaders: {},
         }
         const [response, error] = await api.request(request)

         expect(response).toBeNull()
         expect(error?.status).toBe(400)
         expect(error?.message).toBe("Invalid request")
         expect(mockLogger.error).toHaveBeenCalledWith("API request failed: Invalid request")
      })

      it("should handle network failures and return appropriate error", async () => {
         ;(global.fetch as any).mockRejectedValue(new Error("Network Error"))

         const api = new RestAPI({ baseURI: "https://example.com" })
         const request: RestRequest = {
            url: new URL("https://example.com/test"),
            method: "GET",
            additionalHeaders: {},
         }
         const [response, error] = await api.request(request)

         expect(response).toBeNull()
         expect(error?.status).toBe(503)
         expect(error?.message).toBe("Network error")
      })

      it("should handle request with custom headers", async () => {
         const mockResponse = { message: "Success", data: { id: 1 } }
         ;(global.fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse),
            status: 200,
            statusText: "OK",
         })

         const api = new RestAPI({ baseURI: "https://example.com", baseHeaders: mockHeaders })
         const request: RestRequest = {
            url: new URL("https://example.com/test"),
            method: "GET",
            additionalHeaders: { Authorization: "Bearer token" },
         }
         const [response, error] = await api.request(request)

         expect((response as RestResponse<any>)?.data).toEqual({ id: 1 })
         expect(global.fetch).toHaveBeenCalledWith(new URL("https://example.com/test"), {
            method: "GET",
            headers: {
               ...mockHeaders,
               Authorization: "Bearer token",
            },
            body: undefined,
         })
         expect(error).toBeNull()
      })
   })
})
