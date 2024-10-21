import { Search } from "lucide-react"

import MailList from "@components/common/mail-list"
import { Input } from "@ui/input"
import { ResizablePanel } from "@ui/resizable"
import { Separator } from "@ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs"

namespace Components {
   export function AllMails() {
      return <MailList highlightedLabels={[]} items={[]} />
   }

   export function UnreadMails() {
      return <MailList highlightedLabels={[]} items={[]} />
   }
}

export default function InboxSidebar() {
   return (
      <ResizablePanel defaultSize={32} minSize={30}>
         <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
               <h1 className="text-xl font-bold">Inbox</h1>
               <TabsList className="ml-auto">
                  <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
                     All mail
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">
                     Unread
                  </TabsTrigger>
               </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
               <form>
                  <div className="relative">
                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input placeholder="Search" className="pl-8" />
                  </div>
               </form>
            </div>
            <TabsContent value="all" className="m-0">
               <Components.AllMails />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
               <Components.UnreadMails />
            </TabsContent>
         </Tabs>
      </ResizablePanel>
   )
}
