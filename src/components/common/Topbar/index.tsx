import { classNames } from "@utils/ui"
import { Search, Settings } from "lucide-react"
import { ReactNode } from "react"

export default function Topbar(props: {
   settings?: boolean
   search?: {
      placeholder: string
      onSearch: (query: string) => any
      onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => any
   }
   actions: { name: string; badge: string; active?: boolean; onClick: () => any }[]
   secondaryActions?: { name: string; icon: ReactNode; active?: boolean; onClick: () => any }[]
}) {
   return (
      <header
         className={classNames("grid grid-cols-[min-content,1fr,2fr] gap-2 p-2", {
            "pr-0": props.settings,
         })}
      >
         <div className="flex items-center gap-[.4rem]">
            {props.actions.map((action) => (
               <div
                  key={action.name}
                  onClick={action.onClick}
                  className={classNames(
                     "flex h-[48px] cursor-pointer items-center justify-center rounded-[1.3rem] px-5",
                     action.active ? "bg-primary" : "bg-white"
                  )}
               >
                  <div className="items-top flex gap-2">
                     <span className="whitespace-nowrap text-[.95rem] font-medium">{action.name}</span>
                     {action.badge && <span className="text-[12px]">{action.badge}</span>}
                  </div>
               </div>
            ))}
         </div>
         <div></div>
         <div className="flex items-center justify-end gap-[.4rem]">
            {props.search && (
               <div className="flex h-[48px] w-full items-center gap-4 rounded-[1.3rem] bg-white px-5">
                  <input
                     type="text"
                     className="w-full outline-none"
                     placeholder={props.search.placeholder}
                     onKeyUp={(e) => props.search!.onKeyUp?.(e)}
                     onChange={(e) => props.search!.onSearch(e.target.value)}
                  />
                  <Search size={18} />
               </div>
            )}
            {props.secondaryActions?.map((action) => (
               <div
                  key={action.name}
                  title={action.name}
                  onClick={action.onClick}
                  className={classNames(
                     "flex aspect-[1.1] h-[48px] cursor-pointer items-center justify-center gap-4 rounded-[1.3rem] bg-white",
                     { "bg-black": action.active }
                  )}
               >
                  {action.icon}
               </div>
            ))}
            {props.settings && (
               <div className="flex aspect-[1.1] h-[48px] cursor-pointer items-center justify-center gap-4 rounded-[1.3rem] rounded-br-none rounded-tr-none bg-black text-white">
                  <Settings size={20} />
               </div>
            )}
         </div>
      </header>
   )
}
