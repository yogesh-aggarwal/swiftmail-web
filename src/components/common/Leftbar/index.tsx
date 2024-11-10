import { useRouter } from "@hooks/useRouter"
import {
   Bell,
   CircleGauge,
   Contact,
   HelpCircle,
   Inbox,
   Paperclip,
   Plus,
   Rss,
   Signature,
   User,
} from "lucide-react"
import { useLocation } from "react-router-dom"

namespace Components {
   export function Section(props: { children?: React.ReactNode }) {
      return <div className="rounded-full bg-white w-full p-1 flex gap-1 flex-col">{props.children}</div>
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
               "flex justify-center items-center rounded-full aspect-square w-full cursor-pointer " +
               (props.active ? "bg-black text-white " : "") +
               (props.highlight ? "bg-primary " : "")
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
      const isActive = props.route.startsWith("/" + route)

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
      <header className="w-[70px] p-2 flex gap-2 flex-col justify-between">
         <Components.Section>
            <Components.Route icon={<Inbox size={18} />} route="/inbox" />
            <Components.Route icon={<Rss size={18} />} route="/digest" />
            <Components.Route icon={<Paperclip size={18} />} route="/attachments" />
            <Components.Route icon={<Contact size={18} />} route="/contacts" />
            <Components.Route icon={<CircleGauge size={18} />} route="/dashboard" />
            <Components.Route icon={<Signature size={18} />} route="/templates" />
            <Components.ActionButton icon={<Plus size={18} />} onClick={() => {}} />
         </Components.Section>
         <Components.Section>
            <Components.Route icon={<User size={18} />} route="/" />
            <Components.Route icon={<Bell size={18} />} route="/notifications" />
            <Components.Route icon={<HelpCircle size={18} />} route="/help" />
         </Components.Section>
      </header>
   )
}
