import { API_REST_BASE_URI } from "@core/constants"
import { Logger } from "@logging/logger"
import { getIdToken } from "firebase/auth"

import { auth } from "@core/db/firebase"
import { RestAPI } from "./rest/rest"

// ----------------------------------------------------------------------------------------------------------

export const API = new RestAPI({
   baseURI: API_REST_BASE_URI,
   logger: new Logger("REST"),
   baseHeaders: async () => {
      const firebaseAuthToken = auth.currentUser ? await getIdToken(auth.currentUser) : ""

      return {
         "Content-Type": "application/json",
         Accept: "application/json",
         Authorization: `Bearer ${firebaseAuthToken}`,
      }
   },
})

// ----------------------------------------------------------------------------------------------------------
