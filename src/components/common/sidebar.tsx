import {
   AlertCircle,
   Archive,
   ArchiveX,
   File,
   Inbox,
   LucideIcon,
   MessagesSquare,
   Send,
   ShoppingCart,
   Trash2,
   Users2,
} from "lucide-react"

import { ResizablePanel } from "@components/ui/resizable"
import { buttonVariants } from "@ui/button"
import { Separator } from "@ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip"
import { cn } from "@utils/shadcn"
import { Fragment, useState } from "react"

import { useNavigate } from "react-router-dom"
import { AccountSwitcher } from "./account-switcher"

type SidebarRoute_t = {
   title: string
   icon: LucideIcon
   label?: string
   route: string
}

namespace Components {
   export function Section(props: { links: SidebarRoute_t[]; isCollapsed: boolean }) {
      const navigate = useNavigate()
      const currentRoute = `/${window.location.pathname.split("/")[1]}`

      return (
         <div
            data-collapsed={props.isCollapsed}
            className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
         >
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
               {props.links.map((link, index) =>
                  props.isCollapsed ? (
                     <Tooltip key={index} delayDuration={0}>
                        <TooltipTrigger asChild>
                           <div
                              onClick={() => navigate(link.route)}
                              className={cn(
                                 buttonVariants({
                                    variant: link.route == currentRoute ? "default" : "ghost",
                                    size: "icon",
                                 }),
                                 "h-9 w-9 cursor-pointer",
                                 link.route == currentRoute &&
                                    "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                              )}
                           >
                              <link.icon className="h-4 w-4" />
                              <span className="sr-only">{link.title}</span>
                           </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-4">
                           {link.title}
                           {link.label && <span className="ml-auto text-muted-foreground">{link.label}</span>}
                        </TooltipContent>
                     </Tooltip>
                  ) : (
                     <div
                        key={index}
                        onClick={() => navigate(link.route)}
                        className={cn(
                           buttonVariants({
                              variant: link.route == currentRoute ? "default" : "ghost",
                              size: "sm",
                           }),
                           link.route == currentRoute &&
                              "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                           "justify-start cursor-pointer"
                        )}
                     >
                        <link.icon className="mr-2 h-4 w-4" />
                        {link.title}
                        {link.label && (
                           <span
                              className={cn(
                                 "ml-auto",
                                 link.route == currentRoute && "text-background dark:text-white"
                              )}
                           >
                              {link.label}
                           </span>
                        )}
                     </div>
                  )
               )}
            </nav>
         </div>
      )
   }
}

export function Sidebar() {
   const [isCollapsed, setIsCollapsed] = useState(false)
   const routes: SidebarRoute_t[][] = [
      [
         { title: "Inbox", label: "128", icon: Inbox, route: "/inbox" },
         { title: "Drafts", label: "9", icon: File, route: "/drafts" },
         { title: "Sent", label: "", icon: Send, route: "/sent" },
         { title: "Junk", label: "23", icon: ArchiveX, route: "/junk" },
         { title: "Trash", label: "", icon: Trash2, route: "/trash" },
         { title: "Archive", label: "", icon: Archive, route: "/archive" },
      ],
      [
         { title: "Social", label: "972", icon: Users2, route: "/social" },
         { title: "Updates", label: "342", icon: AlertCircle, route: "/updates" },
         { title: "Forums", label: "128", icon: MessagesSquare, route: "/forums" },
         { title: "Shopping", label: "8", icon: ShoppingCart, route: "/shopping" },
         { title: "Promotions", label: "21", icon: Archive, route: "/promotions" },
      ],
   ]

   return (
      <ResizablePanel
         defaultSize={20}
         collapsedSize={0.5}
         collapsible={true}
         minSize={15}
         maxSize={20}
         onCollapse={() => {
            setIsCollapsed(true)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`
         }}
         onResize={() => {
            setIsCollapsed(false)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`
         }}
         className={cn(isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
      >
         <div className={cn("flex h-[52px] items-center justify-center", isCollapsed ? "h-[52px]" : "px-2")}>
            <AccountSwitcher isCollapsed={isCollapsed} accounts={[]} />
         </div>
         {routes.map((section, index) => (
            <Fragment key={index}>
               <Separator />
               <Components.Section key={index} links={section} isCollapsed={isCollapsed} />
            </Fragment>
         ))}
      </ResizablePanel>
   )
}
