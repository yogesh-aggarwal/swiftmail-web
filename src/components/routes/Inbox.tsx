import { CheckCheck, Filter, LucideStar, RefreshCcw, Stars, VenetianMask } from "lucide-react"
import { Outlet } from "react-router-dom"

import Topbar from "@components/common/Topbar"
import RouteLayout from "@layouts/RouteLayout"
import { Message } from "@models/message"
import { Manip } from "@utils/manip"
import { classNames } from "@utils/ui"
import { makeStore, useBoundValue } from "common-react-toolkit"
import { messagesStore, userStore } from "src/lib/state"

const [uiStore, useUI] = makeStore<{
   categoryID: string
   unreadCount: number
   categories: { id: string; name: string; unreadCount: number }[]
   messages: Record<string, Message[]>
   filter: {
      date_start: number
      date_end: number
      priorities: string[]
      categories: string[]
   }
}>(
   {
      categoryID: "",
      unreadCount: 0,
      categories: [],
      messages: {},
      filter: {
         date_start: 0,
         date_end: 0,
         priorities: [],
         categories: [],
      },
   },
   {},
   { storeID: "inbox_route_ui", disableComparison: true }
)

namespace Components {
   export function Header() {
      const categoryID = useUI((x) => x.categoryID)
      const categories = useUI((x) => x.categories)

      return (
         <Topbar
            settings
            actions={categories.map((x) => ({
               name: x.name,
               badge: x.unreadCount ? x.unreadCount.toString() : undefined,
               onClick: () => uiStore.merge({ categoryID: x.id }),
               active: x.id === categoryID,
            }))}
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
      )
   }

   function Card(props: { meta: Message }) {
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

   export function Messages() {
      const sections = useUI((x) => x.messages)

      return (
         <>
            {Object.entries(sections).map(([name, messages]) => (
               <div key={name} className="mb-4">
                  <div className="mb-2 flex h-[48px] items-center rounded-xl bg-gray-100 px-3 text-[1rem] font-medium opacity-80">
                     {name}
                  </div>
                  {messages.map((x) => (
                     <Card key={x.id} meta={x} />
                  ))}
               </div>
            ))}
            <div className="flex min-h-[52px] items-center justify-center text-sm opacity-30">
               You have reached the end
            </div>
         </>
      )
   }
}

export default function Inbox() {
   const userID = userStore.value()?.id
   if (!userID) return

   const unreadCount = useUI((x) => x.unreadCount)

   /* If no category is selected, select the first one */
   useBoundValue(() => {
      const { categoryID } = uiStore.value()
      if (categoryID) return

      const categories = userStore.value()?.data?.preferences?.inbox?.categories ?? []
      if (categories.length === 0) return

      uiStore.merge({ categoryID: categories[0] })
   }, [userStore, uiStore])

   /* Calculate the unread count */
   useBoundValue(() => {
      const messages = messagesStore.value()

      /* Count unreads */
      const messageDistribution: Record<string, string[]> = {}
      for (const message of Object.values(messages)) {
         for (const category of message.categories) {
            if (!messageDistribution[category]) messageDistribution[category] = []
            messageDistribution[category].push(message.id)
         }
      }
      const categories = (userStore.value()?.data?.preferences?.inbox?.categories ?? []).map((x) => ({
         id: x,
         name: x,
         unreadCount: messageDistribution[x]?.filter((x) => !messages[x].flags.is_read).length || 0,
      }))

      /* Update the store */
      uiStore.merge({ categories: categories })
   }, [userStore, messagesStore])

   /* Update the messages */
   useBoundValue(() => {
      /* Filter out messages */
      const categoryID = uiStore.value().categoryID
      const unreadCount = Object.values(messagesStore.value()).filter((x) => !x.flags.is_read).length
      const messages = Object.values(messagesStore.value()).filter((x) => x.categories.includes(categoryID))

      const sections: Record<string, Message[]> = {
         Unread: [],
         "Everything else": [],
      }
      for (const message of messages) {
         if (message.flags.is_read) {
            sections["Everything else"].push(message)
         } else {
            sections["Unread"].push(message)
         }
      }

      /* Update the store */
      uiStore.merge({ unreadCount: unreadCount, messages: sections })
   }, [uiStore, messagesStore])

   const isLoading = false

   return (
      <RouteLayout topbar={<Components.Header />} className="grid grid-cols-[min-content,1fr] gap-2">
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
                     {unreadCount > 0 && (
                        <div className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]">
                           <CheckCheck size={16} />
                        </div>
                     )}
                     <div className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]">
                        <Filter size={16} />
                     </div>
                  </div>
               </div>
               {/* <div className="flex items-center gap-1 px-5 pb-2">
                  <div className="flex h-[34px] cursor-pointer items-center justify-center rounded-lg bg-gray-bg px-3 text-[.85rem]">
                     Unread
                  </div>
                  <div className="flex h-[34px] cursor-pointer items-center justify-center rounded-lg bg-gray-bg px-3 text-[.85rem]">
                     Urgent
                  </div>
               </div> */}
            </div>
            <div className="flex h-full flex-col gap-1 overflow-y-auto p-2 pt-0">
               <Components.Messages />
            </div>
         </div>
         <div className="h-full w-full overflow-y-auto rounded-[1.6rem] bg-white">
            <Outlet />
         </div>
      </RouteLayout>
   )
}
