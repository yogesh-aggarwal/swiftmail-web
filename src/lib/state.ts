import { CRT, makeStore } from "common-react-toolkit"

import { User } from "./types/models/user"
import { Dashboard } from "./types/ui/dashboard"
import { Digest } from "./types/ui/digests"
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

/** Digests */
export const [digestsStore, useDigests] = makeStore<Digest | null>(null, {}, { storeID: "digests" })

/* ------------------------------------------------------------------------------------------------------- */

/** Dashboard */
export const [dashboardStore, useDashboard] = makeStore<Dashboard | null>(
   {
      vitals: {
         unreadCount: 42,
         averageDeliveryTime: 1.5,
         emailVolumeChart: {
            data: [
               { timestamp: "2024-03-01", count: 150 },
               { timestamp: "2024-03-02", count: 165 },
               { timestamp: "2024-03-03", count: 143 },
               { timestamp: "2024-03-04", count: 180 },
            ],
            timeRange: "week",
         },
      },
      contentStats: {
         priorityDistribution: {
            high: 25,
            medium: 45,
            low: 30,
         },
         categoryDistribution: [
            { category: "Work", count: 45 },
            { category: "Personal", count: 30 },
            { category: "Updates", count: 15 },
            { category: "Social", count: 10 },
         ],
         labelDistribution: [
            { label: "Important", count: 28 },
            { label: "Follow-up", count: 15 },
            { label: "Urgent", count: 12 },
            { label: "Review", count: 8 },
         ],
         customQuery: {
            query: "label:important AND category:work",
            results: [
               { timestamp: "2024-03-01", count: 12 },
               { timestamp: "2024-03-02", count: 15 },
               { timestamp: "2024-03-03", count: 8 },
               { timestamp: "2024-03-04", count: 14 },
            ],
         },
      },
      peopleStats: [
         { email: "john.doe@example.com", importanceScore: 0.85, emailCount: 42 },
         { email: "jane.smith@example.com", importanceScore: 0.75, emailCount: 35 },
         { email: "bob.wilson@example.com", importanceScore: 0.65, emailCount: 28 },
      ],
   },
   {},
   { storeID: "dashboard_store" }
)

/* ------------------------------------------------------------------------------------------------------- */
