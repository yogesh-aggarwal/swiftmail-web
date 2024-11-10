import { HTMLAttributes, ReactNode } from "react"

export default function RouteLayout(
   props: { topbar: ReactNode; children?: ReactNode } & HTMLAttributes<HTMLDivElement>
) {
   return (
      <div
         {...props}
         className={`grid h-screen grid-rows-[min-content,1fr] overflow-auto ${props.className}`}
      >
         {props.topbar}
         <div className="h-full overflow-auto">{props.children}</div>
      </div>
   )
}
