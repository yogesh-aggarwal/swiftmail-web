import Topbar from "@components/common/Topbar"
import { db } from "@core/db/firebase"
import RouteLayout from "@layouts/RouteLayout"
import { DigestDB } from "@models/digest"
import { Message } from "@models/message"
import { classNames } from "@utils/ui"
import { makeStore, useBoundValue } from "common-react-toolkit"
import { collection, query, where } from "firebase/firestore"
import { Edit2, LucideStar, PlusCircle, Stars } from "lucide-react"
import { Outlet } from "react-router-dom"
import { digestsStore, messagesStore } from "src/lib/state"

const [uiStore, useUI] = makeStore<{
   digestID: string
   unreadCount: number
   digests: { id: string; name: string; unreadCount: number }[]
   messages: Message[]
   filter: {
      date_start: number
      date_end: number
      priorities: string[]
      categories: string[]
   }
}>(
   {
      digestID: "",
      unreadCount: 0,
      digests: [],
      messages: [],
      filter: {
         date_start: 0,
         date_end: 0,
         priorities: [],
         categories: [],
      },
   },
   {},
   { storeID: "digest_route_ui", disableComparison: true }
)

namespace Components {
   export function Header() {
      const { digestID } = uiStore.value()
      const digests = useUI((x) => x.digests)

      return (
         <Topbar
            actions={digests.map((x) => ({
               name: x.name,
               badge: x.unreadCount.toString(),
               onClick: () => uiStore.merge({ digestID: x.id }),
               active: x.id === digestID,
            }))}
            search={{
               placeholder: "Search in emails",
               onSearch: (query) => console.log(query),
               onKeyUp: (e) => e.key === "Enter" && console.log("Search"),
            }}
            secondaryActions={[
               { name: "Ask AI", icon: <Stars size={18} />, onClick: () => alert("Refresh") },
               {
                  name: "Create new digest",
                  icon: <PlusCircle size={20} />,
                  onClick: () => alert("More"),
                  active: true,
               },
            ]}
         />
      )
   }

   function Card() {
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
               <div className="text-[.75rem] opacity-55">20:32</div>
            </div>
            <div className="pt-[2px] text-[.85rem] opacity-75">Subject of the mail</div>
            <div className="pt-[2px] text-[.85rem] opacity-55">Subject of the mail</div>
            <div className="mt-2 flex items-center gap-2">
               <div className="rounded-lg bg-green-bg px-2 py-1 text-[.7rem]">
                  <span className="opacity-70">High priority</span>
               </div>
               <div className="rounded-lg bg-green-bg px-2 py-1 text-[.7rem]">
                  <span className="opacity-70">High priority</span>
               </div>
            </div>
         </div>
      )
   }

   export function Messages() {
      const messages = useUI((x) => x.messages)

      return (
         <>
            {messages.map((x) => (
               <Card key={x.id} />
            ))}
         </>
      )
   }
}

export default function DigestRoute() {
   useUI(({ digestID }) => {
      DigestDB.ListenDocsByQuery(
         query(collection(db, DigestDB.collection), where("digests", "array-contains", digestID))
      )
   })

   /* If no digest is selected, select the first one */
   useBoundValue(() => {
      const { digestID } = uiStore.value()
      if (digestID) return

      const digests = Object.values(digestsStore.value())
      if (digests.length === 0) return

      uiStore.merge({ digestID: digests[0].id })
   }, [digestsStore, uiStore])

   /* Calculate the unread count */
   useBoundValue(() => {
      const messages = messagesStore.value()

      /* Count unreads */
      const messageDistribution: Record<string, string[]> = {}
      for (const message of Object.values(messages)) {
         for (const digest of message.digests) {
            if (!messageDistribution[digest]) messageDistribution[digest] = []
            messageDistribution[digest].push(message.id)
         }
      }
      const digests = Object.values(digestsStore.value()).map((x) => ({
         id: x.id,
         name: x.title,
         unreadCount: messageDistribution[x.id]?.filter((x) => !messages[x].flags.is_read).length || 0,
      }))

      /* Update the store */
      uiStore.merge({ digests: digests })
   }, [digestsStore, messagesStore])

   useBoundValue(() => {
      /* Filter out messages */
      const digestID = uiStore.value().digestID
      const messages = Object.values(messagesStore.value()).filter((x) => x.digests.includes(digestID))
      const unreadCount = messages.filter((x) => !x.flags.is_read).length

      /* Update the store */
      uiStore.merge({ unreadCount: unreadCount, messages: messages })
   }, [uiStore, messagesStore])

   const { unreadCount } = useUI()

   return (
      <RouteLayout topbar={<Components.Header />} className="grid grid-cols-[min-content,1fr] gap-2">
         <div className="grid h-full w-[400px] grid-rows-[min-content,1fr] overflow-y-auto rounded-[1.6rem] bg-white">
            <div className="flex h-[72px] items-center justify-between px-5">
               {/* <div className="flex aspect-square w-[36px] items-center justify-center rounded-full bg-gray-bg text-[.84rem]">
                  3
               </div> */}
               <div>{unreadCount} unread</div>
               <div className="flex items-center gap-2">
                  <div className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]">
                     <Edit2 size={16} />
                  </div>
               </div>
            </div>
            <div className="flex h-full flex-col gap-1 overflow-y-auto p-2 pt-0">
               <Components.Messages />
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
