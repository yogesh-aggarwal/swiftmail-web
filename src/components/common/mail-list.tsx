import { Mail_t } from "@/lib/models/mail"
import { Badge } from "@ui/badge"
import { ScrollArea } from "@ui/scroll-area"
import { cn } from "@utils/shadcn"
import { formatDistanceToNow } from "date-fns"

export default function MailList(props: {
   items: { isActive: boolean; mail: Mail_t; onClick: () => any }[]
   highlightedLabels: string[]
}) {
   return (
      <ScrollArea className="h-screen">
         <div className="flex flex-col gap-2 p-4 pt-0">
            {props.items.map((item) => (
               <button
                  key={item.mail.id}
                  onClick={item.onClick}
                  className={cn(
                     "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                     item.isActive && "bg-muted"
                  )}
               >
                  <div className="flex w-full flex-col gap-1">
                     <div className="flex items-center">
                        <div className="flex items-center gap-2">
                           <div className="font-semibold">{item.mail.name}</div>
                           {!item.mail.read && <span className="flex h-2 w-2 rounded-full bg-blue-600" />}
                        </div>
                        <div
                           className={cn(
                              "ml-auto text-xs",
                              item.isActive ? "text-foreground" : "text-muted-foreground"
                           )}
                        >
                           {formatDistanceToNow(new Date(item.mail.date), {
                              addSuffix: true,
                           })}
                        </div>
                     </div>
                     <div className="text-xs font-medium">{item.mail.subject}</div>
                  </div>
                  <div className="line-clamp-2 text-xs text-muted-foreground">
                     {item.mail.text.substring(0, 300)}
                  </div>
                  {item.mail.labels.length ? (
                     <div className="flex items-center gap-2">
                        {item.mail.labels.map((label) => (
                           <Badge
                              key={label}
                              variant={props.highlightedLabels.includes(label) ? "default" : "secondary"}
                           >
                              {label}
                           </Badge>
                        ))}
                     </div>
                  ) : null}
               </button>
            ))}
         </div>
      </ScrollArea>
   )
}
