import { Filter, LucideStar, RefreshCcw, Stars, VenetianMask } from "lucide-react"
import { useMemo } from "react"
import { Outlet } from "react-router-dom"

import Topbar from "@components/common/Topbar"
import { db } from "@core/db/firebase"
import RouteLayout from "@layouts/RouteLayout"
import { Message } from "@models/message"
import { useFirestoreQuery } from "@react-query-firebase/firestore"
import { Manip } from "@utils/manip"
import { classNames } from "@utils/ui"
import { collection, limit, query, where } from "firebase/firestore"
import { userStore } from "src/lib/state"

namespace Components {
   export function Card(props: { meta: Message }) {
      return (
         <div
            className={classNames(
               "cursor-pointer rounded-xl p-3",
               false ? "bg-purple-bg hover:bg-purple-bg" : "hover:bg-gray-bg"
            )}
         >
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <LucideStar size={16} />
                  <div className="text-[1rem] font-medium">Sender</div>
               </div>
               <div className="text-[.75rem] opacity-55">
                  {Intl.DateTimeFormat("en-US", {
                     month: "short",
                     day: "numeric",
                     hour: "numeric",
                     minute: "numeric",
                  }).format(props.meta.date_updated)}
               </div>
            </div>
            <div className="pt-[2px] text-[.85rem] opacity-75">{props.meta.email_data.subject}</div>
            <div className="pt-[2px] text-[.85rem] opacity-55">{props.meta.email_data.html_content}</div>
            <div className="mt-2 flex items-center gap-2">
               <div className="rounded-lg bg-green-bg px-2 py-1 text-[.7rem]">
                  <span className="opacity-70">
                     {Manip.toTitleCase(props.meta.priorities.at(-1)!)} priority
                  </span>
               </div>
            </div>
         </div>
      )
   }
}

export default function Inbox() {
   const userID = userStore.value()?.id
   if (!userID) return

   const ref = query(collection(db, "messages"), limit(10), where("user_id", "==", userID))

   const { isLoading, data } = useFirestoreQuery(["messages"], ref)

   const messages = (data?.docs ?? []).map((doc) => doc.data() as Message)
   console.log(messages)

   const topbar = useMemo(
      () => (
         <Topbar
            settings
            actions={[
               { name: "Primary", badge: "3", onClick: () => alert("Primary"), active: true },
               { name: "Social", badge: "3", onClick: () => alert("Social") },
               { name: "Promotional", badge: "3", onClick: () => alert("Promotional") },
               { name: "Updates", badge: "3", onClick: () => alert("Updates") },
            ]}
            search={{
               placeholder: "Search in emails",
               onSearch: (query) => console.log(query),
               onKeyUp: (e) => e.key === "Enter" && console.log("Search"),
            }}
            secondaryActions={[
               { name: "Ask AI", icon: <Stars size={18} />, onClick: () => alert("Refresh") },
               { name: "Anonymous mode", icon: <VenetianMask size={20} />, onClick: () => alert("More") },
            ]}
         />
      ),
      []
   )

   return (
      <RouteLayout topbar={topbar} className="grid grid-cols-[min-content,1fr] gap-2">
         <div className="grid h-full w-[400px] grid-rows-[min-content,1fr] overflow-y-auto rounded-[1.6rem] bg-white">
            <div>
               <div className="flex h-[72px] items-center justify-between px-5">
                  <div className="text-[1.5rem] font-medium">Inbox</div>
                  <div className="flex items-center gap-2">
                     {isLoading && (
                        <div className="flex aspect-square w-[40px] animate-spin cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]">
                           <RefreshCcw size={16} />
                        </div>
                     )}
                     <div className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]">
                        <Filter size={16} />
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-1 px-5 pb-2">
                  <div className="flex h-[34px] cursor-pointer items-center justify-center rounded-lg bg-gray-bg px-3 text-[.85rem]">
                     Unread
                  </div>
                  <div className="flex h-[34px] cursor-pointer items-center justify-center rounded-lg bg-gray-bg px-3 text-[.85rem]">
                     Urgent
                  </div>
               </div>
            </div>
            <div className="flex h-full flex-col gap-1 overflow-y-auto p-2 pt-0">
               {messages.map((x) => (
                  <Components.Card key={x.id} meta={x} />
               ))}
               <div className="flex min-h-[52px] items-center justify-center text-sm opacity-30">
                  You have reached the end
               </div>
            </div>
         </div>
         <div className="h-full w-full overflow-y-auto rounded-[1.6rem] bg-white">
            <Outlet />
         </div>
      </RouteLayout>
   )
}
