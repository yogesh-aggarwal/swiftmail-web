import { useMemo } from "react"

import Topbar from "@components/common/Topbar"
import RouteLayout from "@layouts/RouteLayout"

export default function Templates() {
   const topbar = useMemo(() => <Topbar actions={[]} />, [])

   return <RouteLayout topbar={topbar}></RouteLayout>
}
