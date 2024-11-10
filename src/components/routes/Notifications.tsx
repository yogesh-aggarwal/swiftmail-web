import { useMemo } from "react"

import Topbar from "@components/common/Topbar"
import RouteLayout from "@layouts/RouteLayout"

export default function Notifications() {
   const topbar = useMemo(() => <Topbar routes={[]} />, [])

   return <RouteLayout topbar={topbar}></RouteLayout>
}
