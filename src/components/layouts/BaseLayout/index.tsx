import Leftbar from "@components/common/Leftbar"
import Settings from "@components/common/Settings"

export default function BaseLayout(props: { children: React.ReactNode }) {
   return (
      <div className="grid grid-cols-[min-content,1fr] h-screen overflow-auto bg-background">
         <Leftbar />
         <div className="h-full overflow-auto">{props.children}</div>
         <Settings />
      </div>
   )
}
