import RouteLayout from "@layouts/RouteLayout"
import { classNames } from "@utils/ui"
import { ArrowUp, Edit, Save, Signature, Trash2 } from "lucide-react"
import { useCallback } from "react"

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

   export function Header() {
      return (
         <div className="flex h-[72px] items-center justify-between px-5">
            <div className="flex items-center gap-4">
               <div className="text-lg font-medium">Engineering role cold mail</div>
               <Edit size={16} className="cursor-pointer" />
            </div>
            <div className="flex items-center gap-2">
               <div
                  onClick={() => {}}
                  className={classNames(
                     "flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-[1rem] px-4",
                     false
                        ? "cursor-pointer bg-black text-white hover:bg-gray-800"
                        : "cursor-wait bg-background text-gray-500"
                  )}
               >
                  <Save size={16} />
                  <span className="text-[.95rem]">Save</span>
               </div>
               <div
                  onClick={() => {}}
                  className={classNames(
                     "flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-[1rem] px-4",
                     false
                        ? "cursor-pointer bg-black text-white hover:bg-gray-800"
                        : "cursor-wait bg-background text-gray-500"
                  )}
               >
                  <Trash2 size={16} />
               </div>
            </div>
         </div>
      )
   }

   export function Preview() {
      return <div className="px-5">Preview</div>
   }

   export function PromptEditor() {
      const handleSubmit = useCallback(() => {}, [])

      return (
         <div className="h-[150px] p-4">
            <div className="flex h-full w-full items-end gap-2 rounded-[1.3rem] border border-gray-200 focus-within:border-gray-300">
               <textarea
                  className="h-full w-full resize-none rounded-[inherit] p-4 text-[.9rem] outline-none"
                  placeholder="Describe the template you want ..."
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
               ></textarea>
               <div className="p-4 pl-0">
                  <div
                     onClick={handleSubmit}
                     className={classNames(
                        "flex aspect-[1] h-[42px] items-center justify-center gap-4 rounded-[1rem]",
                        true
                           ? "cursor-pointer bg-black text-white hover:bg-gray-800"
                           : "cursor-wait bg-background text-gray-500"
                     )}
                  >
                     <ArrowUp size={20} />
                  </div>
               </div>
            </div>
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
            <div className="grid h-full w-full grid-rows-[min-content,1fr,min-content]">
               <Components.Header />
               <Components.Preview />
               <Components.PromptEditor />
            </div>
         </div>
      </RouteLayout>
   )
}
