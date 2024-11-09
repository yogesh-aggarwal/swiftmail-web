import { CRT, makeStore } from "common-react-toolkit"

import { User } from "./models/user"

/* Configure state management */
CRT.Config({
   application: "foundation",
   dbVersion: 1,
   selfRecovery: true,
   storage: localStorage,
})

/* ------------------------------------------------------------------------------------------------------- */

export const [authStore, useAuth] = makeStore<boolean>(
   !!localStorage.getItem("authToken"),
   {},
   { storeID: "auth" }
)

/* ------------------------------------------------------------------------------------------------------- */

/** Current user */
export const [userStore, useUser] = makeStore<User | null>(null, {}, { storeID: "user" })

/* ------------------------------------------------------------------------------------------------------- */
