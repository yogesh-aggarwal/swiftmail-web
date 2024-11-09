import { API_REST_BASE_URI } from "@core/constants"
import { Logger } from "@logging/logger"

import { RestAPI } from "./rest/rest"

// ----------------------------------------------------------------------------------------------------------

export const API = new RestAPI({
   baseURI: API_REST_BASE_URI,
   logger: new Logger("REST"),
   baseHeaders: async () => {
      await firebaseAuthToken = await 
      return {
         "Content-Type": "application/json",
         Accept: "application/json",
         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      }
   },
})

// ----------------------------------------------------------------------------------------------------------
