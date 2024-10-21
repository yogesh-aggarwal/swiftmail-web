import { ResizableHandle } from "@components/ui/resizable"

import MailView from "../../common/mail-view"
import InboxSidebar from "./components/sidebar"

export default function InboxPage() {
   return (
      <>
         <InboxSidebar />
         <ResizableHandle withHandle />
         <MailView meta={null} />
      </>
   )
}
