import { CheckCheck, Filter, LucideStar, RefreshCcw, Stars } from "lucide-react"
import { Outlet, useParams } from "react-router-dom"

import { API } from "@api/api"
import Dropdown from "@components/common/Dropdown/Dropdown"
import { Edge, Side } from "@components/common/Dropdown/Dropdown.types"
import Topbar, { TopbarPropsAction } from "@components/common/Topbar"
import { useRouter } from "@hooks/useRouter"
import RouteLayout from "@layouts/RouteLayout"
import { Manip } from "@utils/manip"
import { classNames } from "@utils/ui"
import { makeStore, useBoundValue } from "common-react-toolkit"
import { useMemo, useState } from "react"
import { inboxStore, useInbox, userStore, useUser } from "src/lib/state"
import { Thread } from "src/lib/types/models/thread"

const [uiStore, useUI] = makeStore<{
   categoryID: string
   filter: {
      date_start: number
      date_end: number
      priorities: string[]
      categories: string[]
      star: boolean
      labels: string[]
      fromDate: number
      toDate: number
   }
   searchResults: Thread[]
   searchQuery: string
}>(
   {
      categoryID: "",
      filter: {
         date_start: 0,
         date_end: 0,
         priorities: [],
         categories: [],
         star: false,
         labels: [],
         fromDate: Date.now(),
         toDate: Date.now(),
      },
      searchResults: [],
      searchQuery: "",
   },
   {},
   { storeID: "inbox_route_ui", disableComparison: true }
)

namespace Components {
   export function Header() {
      const inbox = useInbox()
      const categoryID = useUI((x) => x.categoryID)

      const categoryActions = useMemo(() => {
         if (!inbox) return []

         const result: Record<string, TopbarPropsAction> = {}
         for (const [name, category] of Object.entries(inbox?.categories ?? {})) {
            result[name] = {
               name: name,
               badge: category.unreadCount ? category.unreadCount.toString() : undefined,
               onClick: () => uiStore.merge({ categoryID: name }),
               active: name === categoryID,
            }
         }

         return inbox.categoryOrder.map((x) => result[x])
      }, [inbox, categoryID])

      return (
         <Topbar
            settings
            actions={categoryActions}
            search={{
               placeholder: "Search in emails",
               onSearch: (query) => {
                  if (query) return
                  uiStore.merge({ searchQuery: query })
               },
               onKeyUp: (e) =>
                  e.key === "Enter" &&
                  (async (query) => {
                     uiStore.merge({ searchQuery: query })
                     const [response] = await API.request({
                        method: "GET",
                        url: API.buildURL("/api/thread/search", { query }),
                     })

                     uiStore.merge({ searchResults: response?.data ?? [] })
                  })((e.target as any).value),
            }}
            secondaryActions={[
               { name: "Ask AI", icon: <Stars size={18} />, onClick: () => alert("Refresh") },
               // { name: "Anonymous mode", icon: <VenetianMask size={20} />, onClick: () => alert("More") },
            ]}
         />
      )
   }

   function Card(props: { meta: Thread }) {
      const id = (useParams().id as string) ?? ""
      const router = useRouter()

      return (
         <div
            onClick={() => router(`/inbox/${props.meta.id}`)}
            className={classNames(
               "cursor-pointer rounded-xl p-3",
               id == props.meta.id ? "bg-purple-bg hover:bg-purple-bg" : "hover:bg-gray-bg"
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
            <div className="pt-[2px] text-[.85rem] opacity-75">{props.meta.title}</div>
            <div className="mt-2 flex items-center gap-2">
               <div className="rounded-lg bg-green-bg px-2 py-1 text-[.7rem]">
                  <span className="opacity-70">{Manip.toTitleCase(props.meta.priority)} priority</span>
               </div>
            </div>
         </div>
      )
   }

   export function SearchResults() {
      const searchResults = useUI((x) => x.searchResults ?? [])

      return (
         <div>
            {searchResults.map((x) => (
               <Card key={x.id} meta={x} />
            ))}
         </div>
      )
   }

   export function Subcategories() {
      const selectedCategory = useUI((x) => x.categoryID)
      const sections = useInbox((x) => x?.categories?.[selectedCategory]?.subcategories, [selectedCategory])

      if (!sections) return <div className="flex h-full items-center justify-center">No messages</div>

      return (
         <div className="flex h-full flex-col gap-1 overflow-y-auto p-2 pt-0">
            {Object.entries(sections).map(
               ([name, threads]) =>
                  threads.length > 0 && (
                     <div key={name} className="mb-4">
                        <div className="mb-2 flex h-[48px] items-center rounded-xl bg-gray-100 px-3 text-[1rem] font-medium opacity-80">
                           {name}
                        </div>
                        {threads.map((x) => (
                           <Card key={x.id} meta={x} />
                        ))}
                     </div>
                  )
            )}
            <div className="flex min-h-[52px] items-center justify-center text-sm opacity-30">
               You have reached the end
            </div>
         </div>
      )
   }

   export function Messages() {
      const searchQuery = useUI((x) => x.searchQuery)

      console.log(searchQuery)

      return searchQuery ? <Components.SearchResults /> : <Components.Subcategories />
   }
}

function FilterDropdown() {
   const filter = useUI((x) => x.filter)
   const availableLabels = useUser((x) => x?.data?.preferences?.inbox?.labels ?? [])

   // Format date to YYYY-MM-DD for input value
   const formatDateForInput = (timestamp: number) => {
      return new Date(timestamp).toISOString().split("T")[0]
   }

   // Initialize fromDate and toDate with values from store
   const [fromDate, setFromDate] = useState(formatDateForInput(filter.fromDate))
   const [toDate, setToDate] = useState(formatDateForInput(filter.toDate))

   const handleDateChange = (type: "from" | "to", value: string) => {
      const timestamp = value ? new Date(value).getTime() : Date.now()

      if (type === "from") {
         setFromDate(value)
         uiStore.merge({
            filter: {
               ...filter,
               fromDate: timestamp,
            },
         })
      } else {
         setToDate(value)
         uiStore.merge({
            filter: {
               ...filter,
               toDate: timestamp,
            },
         })
      }
   }

   return (
      <div className="min-w-[300px] rounded-lg bg-white p-4">
         <div className="mb-6 text-[1.1rem] text-sm font-medium">Filter Messages</div>

         <div className="space-y-4">
            {/* Date Range */}
            <div className="space-y-2">
               <div className="text-xs opacity-70">Date Range</div>
               <div className="grid grid-cols-2 gap-2">
                  <input
                     type="date"
                     value={fromDate}
                     onChange={(e) => handleDateChange("from", e.target.value)}
                     className="rounded-lg bg-gray-50 p-2 text-sm"
                  />
                  <input
                     type="date"
                     value={toDate}
                     onChange={(e) => handleDateChange("to", e.target.value)}
                     className="rounded-lg bg-gray-50 p-2 text-sm"
                  />
               </div>
            </div>

            {/* Star Filter */}
            <div className="flex items-center gap-2">
               <input
                  type="checkbox"
                  checked={filter.star}
                  onChange={(e) => uiStore.merge({ filter: { ...filter, star: e.target.checked } })}
                  className="rounded"
               />
               <span className="text-sm">Starred only</span>
            </div>

            {/* Labels */}
            <div className="space-y-2">
               <div className="text-xs opacity-70">Labels</div>
               <div className="space-y-1">
                  {availableLabels.map((label) => (
                     <div key={label} className="flex items-center gap-2">
                        <input
                           type="checkbox"
                           checked={filter.labels.includes(label)}
                           onChange={(e) => {
                              const newLabels = e.target.checked
                                 ? [...filter.labels, label]
                                 : filter.labels.filter((l) => l !== label)
                              uiStore.merge({ filter: { ...filter, labels: newLabels } })
                           }}
                           className="rounded"
                        />
                        <span className="text-sm">{label}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   )
}

export default function Inbox() {
   const userID = userStore.value()?.id
   if (!userID) return

   const isLoading = false
   const unreadCount = useInbox((x) => x?.unreadCount ?? 0)

   /* If no category is selected, select the first one */
   useBoundValue(() => {
      const { categoryID } = uiStore.value()
      if (categoryID) return

      const categories = userStore.value()?.data?.preferences?.inbox?.categories ?? []
      if (categories.length === 0) return

      uiStore.merge({ categoryID: categories[0] })
   }, [userStore, uiStore])

   const handleMarkAllRead = async () => {
      const selectedCategory = uiStore.value().categoryID
      if (!selectedCategory) return

      const inbox = inboxStore.value()
      if (!inbox?.categories[selectedCategory]) return

      try {
         // Get all threads from the selected category's subcategories
         const threads = Object.values(inbox.categories[selectedCategory].subcategories)
            .flat()
            .filter((thread) => !thread.flags.is_read)

         // Mark each thread as read
         await Promise.all(
            threads.map((thread) =>
               API.request({
                  method: "PATCH",
                  url: API.buildURL(`/api/thread/${thread.id}/read`),
               })
            )
         )

         // Refresh inbox data after marking all as read
         await API.request({
            method: "GET",
            url: API.buildURL("/api/inbox"),
         })
      } catch (err) {
         console.error("Failed to mark all as read:", err)
      }
   }

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
                        <div
                           onClick={handleMarkAllRead}
                           className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem] hover:bg-gray-200"
                        >
                           <CheckCheck size={16} />
                        </div>
                     )}
                     <Dropdown
                        id="filter-dropdown"
                        placement={{
                           triggerEdge: Edge.Bottom,
                           expansionEdge: Edge.Top,
                           expansionSide: Side.Right,
                        }}
                        expansion={<FilterDropdown />}
                     >
                        {(expanded) => (
                           <div
                              className={`flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full ${expanded ? "bg-purple-bg" : "bg-gray-bg"} text-[.84rem]`}
                           >
                              <Filter size={16} />
                           </div>
                        )}
                     </Dropdown>
                  </div>
               </div>
            </div>
            <Components.Messages />
         </div>
         <div className="h-full w-full overflow-y-auto rounded-[1.6rem] bg-white">
            <Outlet />
         </div>
      </RouteLayout>
   )
}
