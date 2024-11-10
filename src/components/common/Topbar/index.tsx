import { Search, Settings, Stars, VenetianMask } from "lucide-react"

export default function Topbar(props: {
   actions: { name: string; badge: string; active?: boolean; onClick: () => any }[]
}) {
   return (
      <header className="grid grid-cols-[min-content,1fr,2fr] gap-2 p-2 pr-0">
         <div className="flex items-center gap-[.4rem]">
            {props.actions.map((action) => (
               <div
                  key={action.name}
                  onClick={action.onClick}
                  className={
                     "flex h-[48px] cursor-pointer items-center justify-center rounded-[1.3rem] px-5 " +
                     (action.active ? "bg-primary" : "bg-white")
                  }
               >
                  <div className="items-top flex gap-2">
                     <span className="whitespace-nowrap text-[.95rem] font-medium">{action.name}</span>
                     {action.badge && <span className="text-[12px]">{action.badge}</span>}
                  </div>
               </div>
            ))}
         </div>
         <div></div>
         <div className="flex items-center gap-[.4rem]">
            <div className="flex h-[48px] w-full items-center gap-4 rounded-[1.3rem] bg-white px-5">
               <input type="text" className="w-full outline-none" placeholder="Search" />
               <Search size={18} />
            </div>
            <div className="flex aspect-[1.1] h-[48px] cursor-pointer items-center justify-center gap-4 rounded-[1.3rem] bg-white">
               <VenetianMask size={20} />
            </div>
            <div className="flex aspect-[1.1] h-[48px] cursor-pointer items-center justify-center gap-4 rounded-[1.3rem] bg-white">
               <Stars size={18} />
            </div>
            <div className="flex aspect-[1.1] h-[48px] cursor-pointer items-center justify-center gap-4 rounded-[1.3rem] rounded-br-none rounded-tr-none bg-black text-white">
               <Settings size={20} />
            </div>
         </div>
      </header>
   )
}
