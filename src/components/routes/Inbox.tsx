import { LucideStar, Stars, VenetianMask } from "lucide-react"
import { useMemo } from "react"
import { Outlet } from "react-router-dom"

import Topbar from "@components/common/Topbar"
import RouteLayout from "@layouts/RouteLayout"
import { classNames } from "@utils/ui"

namespace Components {
   export function Card() {
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
}

export default function Inbox() {
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
            <div className="flex h-[72px] items-center justify-between px-5">
               <div className="text-[1.5rem] font-medium">Inbox</div>
               <div className="flex aspect-square w-[36px] items-center justify-center rounded-full bg-gray-bg text-[.84rem]">
                  3
               </div>
            </div>
            <div className="flex h-full flex-col gap-1 overflow-y-auto p-2 pt-0">
               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <Components.Card key={i} />
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
