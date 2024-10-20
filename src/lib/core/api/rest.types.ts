export type RestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
export type RestHeaders = Record<string, string>
export type RestBody = Record<string, any>

export type RestRequest = {
   // Basic
   url: URL
   method?: RestMethod
   // Request Content
   body?: RestBody
   authHeader?: string
   additionalHeaders?: RestHeaders
}

export type RestResponse<T> = {
   // Status
   status: number
   message: string
   // Data
   data: T
}
