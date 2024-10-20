import { API_REST_BASE_URI } from "@core/constants"
import { Logger } from "@logging/logger"

import { RestAPI } from "./rest"

// ----------------------------------------------------------------------------

export const API = new RestAPI(
   API_REST_BASE_URI,
   {
      "Content-Type": "application/json",
      Accept: "application/json",
   },
   new Logger("API")
)

// ----------------------------------------------------------------------------
