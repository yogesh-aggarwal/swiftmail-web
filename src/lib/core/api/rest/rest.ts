import { Logger } from "@logging/logger"
import { ILogger } from "@logging/logger.types"
import { IRest, RestError, RestHeaders, RestRequest, RestResponse } from "./rest.types"

/**
 * A class to handle REST API requests with optional logging and base headers.
 *
 * `RestAPI` simplifies HTTP request handling with a unified configuration approach for base URIs and headers.
 * It also provides options for consistent logging and handles various HTTP status responses gracefully.
 */
export class RestAPI implements IRest {
   private readonly logger: ILogger
   private readonly baseURI: string
   private readonly baseHeaders: () => Promise<RestHeaders>

   /**
    * Initializes a new instance of the `RestAPI`.
    *
    * @param data - An object containing configuration data.
    * @param data.baseURI - The base URI for all requests.
    * @param data.logger - An optional `ILogger` instance for logging. If not provided, a default logger is created.
    * @param data.baseHeaders - Optional default headers for all requests, either as an object or a function returning headers.
    */
   constructor(data: {
      baseURI: string
      logger?: ILogger
      baseHeaders?: (() => Promise<RestHeaders>) | RestHeaders
   }) {
      this.baseURI = data.baseURI
      this.logger = data.logger ?? new Logger("RestAPI")

      // Assigns base headers; uses an empty function if none provided.
      if (typeof data.baseHeaders === "object") {
         this.baseHeaders = () => Promise.resolve(data.baseHeaders as RestHeaders)
      } else {
         this.baseHeaders = data.baseHeaders ?? (() => Promise.resolve({}))
      }
   }

   /**
    * Constructs a full URL with specified path and query parameters.
    *
    * @param path - The path to append to the base URI.
    * @param params - A record of query parameters to append to the URL.
    * @returns A complete `URL` object containing the full request path and query parameters.
    */
   buildURL(path: string, params?: Record<string, any>): URL {
      const url = new URL(path, this.baseURI)
      for (const [key, value] of Object.entries(params ?? {})) {
         url.searchParams.append(key, value)
      }
      return url
   }

   /**
    * Executes an HTTP request and returns a response or an error.
    *
    * The `request` method supports specifying headers, request body, and HTTP method.
    * If both `Authorization` header and `authHeader` are provided, it prioritizes `Authorization`.
    *
    * @typeParam RT - The expected response data type.
    * @typeParam ET - The expected error data type.
    * @param req - A `RestRequest` containing request details, including URL, method, headers, and body.
    * @returns A tuple where the first item is the `RestResponse` on success or `null` on failure,
    * and the second item is `RestError` on failure or `null` on success.
    */
   async request<RT = any, ET = any>(
      req: RestRequest
   ): Promise<[RestResponse<RT> | null, RestError<ET> | null]> {
      if ((req.additionalHeaders || {})["Authorization"] && req.authHeader) {
         this.logger.warn(
            "Both 'Authorization' header and 'authHeader' provided. Prioritizing 'Authorization' header."
         )
      }

      const baseHeaders = await this.baseHeaders()

      const finalHeaders = {
         ...baseHeaders,
         ...req.additionalHeaders,
         Authorization:
            baseHeaders.Authorization || req.additionalHeaders?.Authorization || req.authHeader || "",
      }

      try {
         const response = await fetch(req.url, {
            method: req.method || "GET",
            headers: finalHeaders,
            body: JSON.stringify(req.body),
         })

         if (response.status === 204) {
            return [{ data: null, status: 204, message: "No Content" }, null]
         }

         let data = null
         try {
            data = (await response.json()) as RT & { message?: string }
         } catch {
            return [null, { data: null, status: 500, message: "Failed to parse JSON" }]
         }

         const result: RestResponse<any> = {
            data: data,
            status: response.status,
            message: data["message"] || response.statusText,
         }

         if ("data" in data && "message" in data) {
            delete data["message"]
            result.data = Object.keys(data).length ? data["data"] : null
         }

         if (response.ok) {
            return [result, null]
         } else {
            this.logger.error(`API request failed: ${result.message}`)
            return [null, result]
         }
      } catch (e) {
         this.logger.error(`API request failed: ${e}`)
         return [null, { data: null, status: 503, message: "Network error" }]
      }
   }
}
