import { useMemo } from "react"

import Topbar from "@components/common/Topbar"
import RouteLayout from "@layouts/RouteLayout"

export default function Inbox() {
   const topbar = useMemo(
      () => (
         <Topbar
            actions={[
               { name: "Primary", badge: "3", onClick: () => alert("Primary"), active: true },
               { name: "Social", badge: "3", onClick: () => alert("Social") },
               { name: "Promotional", badge: "3", onClick: () => alert("Promotional") },
               { name: "Updates", badge: "3", onClick: () => alert("Updates") },
            ]}
         />
      ),
      []
   )

   return <RouteLayout topbar={topbar}></RouteLayout>
}
