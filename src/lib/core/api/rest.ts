import { ILogger } from "../logging/logger.types"
import { RestHeaders, RestRequest, RestResponse } from "./rest.types"

export class RestAPI {
   private readonly logger: ILogger
   private readonly baseURI: string
   private readonly baseHeaders: Record<string, string>

   constructor(baseURI: string, baseHeaders: RestHeaders = {}, logger: ILogger) {
      this.baseURI = baseURI
      this.baseHeaders = baseHeaders
      this.logger = logger
   }

   buildURL(path: string, params: Record<string, any>): URL {
      const url = new URL(path, this.baseURI)
      for (const [key, value] of Object.entries(params)) {
         url.searchParams.append(key, value)
      }
      return url
   }

   async request<T = any>(req: RestRequest): Promise<[RestResponse<T> | null, RestResponse<null> | null]> {
      if ((req.additionalHeaders || {})["Authorization"] && req.authHeader) {
         this.logger.warn(
            "Both 'Authorization' header and 'authHeader' provided. Using 'Authorization' header."
         )
      }

      try {
         const response = await fetch(req.url, {
            method: req.method || "GET",
            headers: {
               ...this.baseHeaders,
               ...req.additionalHeaders,
               Authorization: req.additionalHeaders?.Authorization || req.authHeader || "",
            },
            body: JSON.stringify(req.body),
         })

         const data = (await response.json()) as T & { message?: string }

         const result: RestResponse<any> = {
            data: data,
            status: response.status,
            message: data["message"] || response.statusText,
         }
         if ("data" in data && "message" in data) {
            result.data = data["data"]
         }

         if (response.ok) {
            return [result, null]
         } else {
            this.logger.error(`API request failed: ${result.message}`)
            return [null, result]
         }
      } catch {
         return [null, { data: null, status: 503, message: "Network error" }]
      }
   }
}
