import { CRT, makeStore } from "common-react-toolkit"

import { User } from "./types/models/user"
import { Inbox } from "./types/ui/inbox"

/* Configure state management */
CRT.Config({
   application: "foundation",
   dbVersion: 1,
   selfRecovery: true,
   storage: localStorage,
})

/* ------------------------------------------------------------------------------------------------------- */

/** Authentication */
export const [authStore, useAuth] = makeStore<boolean>(
   !!localStorage.getItem("authToken"),
   {},
   { storeID: "auth" }
)

/* ------------------------------------------------------------------------------------------------------- */

/** Current user */
export const [userStore, useUser] = makeStore<User | null>(null, {}, { storeID: "user" })

/* ------------------------------------------------------------------------------------------------------- */

/** Inbox */
export const [inboxStore, useInbox] = makeStore<Inbox | null>(null, {}, { storeID: "inbox" })

/* ------------------------------------------------------------------------------------------------------- */
