import { ReactNode } from "react"

export default function RouteLayout(props: { topbar: ReactNode; children?: ReactNode }) {
   return (
      <div className="grid grid-rows-[min-content,1fr] h-screen overflow-auto">
         {props.topbar}
         <div className="h-full overflow-auto">{props.children}</div>
      </div>
   )
}
