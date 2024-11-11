import { CRT, makeIDBDatabaseStore, makeStore } from "common-react-toolkit"

import { Digest } from "@models/digest"
import { Message } from "@models/message"
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
export const [userStore, useUser] = makeStore<User | null>(
   {
      id: "yogeshdevaggarwal@gmail.com",
   },
   {},
   { storeID: "user" }
)

/* ------------------------------------------------------------------------------------------------------- */

export const [digestsStore, useDigests] = makeIDBDatabaseStore<Digest>({
   key: "id",
   name: "digests",
   version: 1,
})

/* ------------------------------------------------------------------------------------------------------- */

export const [messagesStore, useMessages] = makeIDBDatabaseStore<Message>({
   key: "id",
   name: "messages",
   version: 1,
})

/* ------------------------------------------------------------------------------------------------------- */
