import { useMemo } from "react"

import Topbar from "@components/common/Topbar"
import RouteLayout from "@layouts/RouteLayout"
import { Stars, VenetianMask } from "lucide-react"

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

   return <RouteLayout topbar={topbar}>
      <div className=""></div>
   </RouteLayout>
}
