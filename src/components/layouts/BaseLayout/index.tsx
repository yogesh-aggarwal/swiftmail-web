import Leftbar from "@components/common/Leftbar"

export default function BaseLayout(props: { children: React.ReactNode }) {
   return (
      <div className="grid grid-cols-[min-content,1fr] h-screen overflow-auto">
         <Leftbar />
         <div className="h-full overflow-auto">{props.children}</div>
      </div>
   )
}
