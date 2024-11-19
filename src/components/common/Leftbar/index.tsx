import { useRouter } from "@hooks/useRouter"
import { Bell, ChartArea, Edit2, Inbox, Rss, Signature, User } from "lucide-react"
import { useLocation } from "react-router-dom"

namespace Components {
   export function Section(props: { children?: React.ReactNode }) {
      return <div className="flex w-full flex-col gap-1 rounded-full bg-white p-1">{props.children}</div>
   }

   function SectionButton(props: {
      children?: React.ReactNode
      onClick?: () => void
      highlight?: boolean
      active?: boolean
   }) {
      return (
         <div
            className={
               "flex aspect-square w-full cursor-pointer items-center justify-center rounded-full " +
               (props.active ? "bg-black text-white" : "") +
               (props.highlight ? "bg-primary" : "")
            }
            onClick={props.onClick}
         >
            {props.children}
         </div>
      )
   }

   export function Route(props: { icon: React.ReactNode; route: string; highlight?: boolean }) {
      const router = useRouter()
      const route = useLocation().pathname.split("/")[1]
      const isActive = !!route && props.route.startsWith("/" + route)

      return (
         <SectionButton onClick={() => router(props.route)} active={isActive} highlight={props.highlight}>
            {props.icon}
         </SectionButton>
      )
   }

   export function ActionButton(props: { icon: React.ReactNode; onClick: () => void }) {
      return (
         <SectionButton highlight onClick={props.onClick}>
            {props.icon}
         </SectionButton>
      )
   }
}

export default function Leftbar() {
   return (
      <header className="flex w-[70px] flex-col justify-between gap-2 p-2">
         <Components.Section>
            <Components.Route icon={<ChartArea size={18} />} route="/dashboard" />
            <Components.Route icon={<Inbox size={18} />} route="/inbox" />
            <Components.Route icon={<Rss size={18} />} route="/digest" />
            {/* <Components.Route icon={<Paperclip size={18} />} route="/attachments" /> */}
            {/* <Components.Route icon={<Contact size={18} />} route="/contacts" /> */}
            <Components.ActionButton icon={<Edit2 size={18} />} onClick={() => {}} />
         </Components.Section>
         <Components.Section>
            <Components.Route icon={<Signature size={18} />} route="/templates" />
            <Components.Route icon={<Bell size={18} />} route="/notifications" />
            <Components.Route icon={<User size={18} />} route="/" />
         </Components.Section>
      </header>
   )
}
