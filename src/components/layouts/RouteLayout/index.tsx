import { HTMLAttributes, ReactNode } from "react"

export default function RouteLayout(
   props: { topbar: ReactNode; children?: ReactNode } & HTMLAttributes<HTMLDivElement>
) {
   return (
      <div className="grid h-screen grid-rows-[min-content,1fr] overflow-auto">
         {props.topbar}
         <div {...props} className={`h-full overflow-auto ${props.className}`}>
            {props.children}
         </div>
      </div>
   )
}
