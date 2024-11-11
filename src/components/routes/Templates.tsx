import RouteLayout from "@layouts/RouteLayout"
import { classNames } from "@utils/ui"
import { Signature } from "lucide-react"
import { Outlet } from "react-router-dom"

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
                  <Signature size={16} />
                  <div className="text-[1rem] font-medium">Template</div>
               </div>
            </div>
            <div className="pt-[2px] text-[.85rem] opacity-55">Subject of the mail</div>
         </div>
      )
   }
}

export default function Templates() {
   return (
      <RouteLayout topbar={<div className="mt-2"></div>} className="grid grid-cols-[min-content,1fr] gap-2">
         <div className="grid h-full w-[400px] grid-rows-[min-content,1fr] overflow-y-auto rounded-[1.6rem] bg-white">
            <div className="flex h-[72px] items-center justify-between px-5">
               <div className="text-[1.5rem] font-medium">Templates</div>
               <div className="flex aspect-square w-[36px] items-center justify-center rounded-full bg-gray-bg text-[.84rem]">
                  3
               </div>
            </div>
            <div className="flex h-full flex-col gap-1 overflow-y-auto p-2 pt-0">
               {[1, 2].map((i) => (
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
