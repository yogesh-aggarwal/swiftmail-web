import { makeIDBDatabaseStore } from "common-react-toolkit"

import { Mail_t } from "../models/mail"

export const [mailStore, useMails] = makeIDBDatabaseStore<Mail_t>({
   key: "id",
   version: 1,
   name: "mails",
})
