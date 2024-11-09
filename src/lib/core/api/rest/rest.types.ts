/**
 * Allowed HTTP methods for REST API requests.
 */
export type RestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

/**
 * A record representing HTTP headers, where each key is a header name and each value is a string.
 */
export type RestHeaders = Record<string, string>

/**
 * Represents the body content of a REST API request.
 */
export type RestBody = Record<string, any>

/**
 * Type representing a REST API request with optional method, headers, and body.
 */
export type RestRequest = {
   /** The full URL to which the request is made. */
   url: URL
   /** The HTTP method to use, defaults to "GET" if unspecified. */
   method?: RestMethod
   /** The body of the request, usually for POST, PUT, and PATCH methods. */
   body?: RestBody
   /** A custom authorization header, which may be overridden by `additionalHeaders` if both are present. */
   authHeader?: string
   /** Additional headers to include in the request. */
   additionalHeaders?: RestHeaders
}

/**
 * Represents a successful REST API response.
 *
 * @typeParam T - The type of data expected in the response.
 */
export type RestResponse<T> = {
   /** The HTTP status code of the response (e.g., 200 for success). */
   status: number
   /** A message indicating the result or status of the response. */
   message: string
   /** The response data of type `T`, or `null` if no data is returned. */
   data: T | null
}

/**
 * Represents an error response from a REST API request.
 *
 * @typeParam T - The type of error data expected.
 */
export type RestError<T> = {
   /** The HTTP status code associated with the error (e.g., 400 for client error). */
   status: number
   /** A message describing the error. */
   message: string
   /** The error data of type `T`, or `null` if no additional data is available. */
   data: T | null
}

/**
 * Interface defining the structure of a REST API client.
 */
export interface IRest {
   /**
    * Constructs a URL based on a path and a set of query parameters.
    *
    * @param path - The path to append to the base URI.
    * @param params - A dictionary of query parameters to add to the URL.
    * @returns A URL object with the specified path and query parameters.
    */
   buildURL(path: string, params?: Record<string, any>): URL

   /**
    * Makes a REST API request and handles the response, returning either data or an error.
    *
    * @typeParam RT - The type of the response data.
    * @typeParam ET - The type of error data if the request fails.
    * @param req - A `RestRequest` object containing details of the request.
    * @returns A promise that resolves to a tuple with either a `RestResponse` (on success) or a `RestError` (on failure).
    */
   request<RT = any, ET = any>(req: RestRequest): Promise<[RestResponse<RT> | null, RestError<ET> | null]>
}
