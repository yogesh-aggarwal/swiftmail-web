import Dropdown from "@components/common/Dropdown/Dropdown"
import { Edge, Side } from "@components/common/Dropdown/Dropdown.types"
import { settingsStore } from "@components/common/Settings"
import { auth } from "@core/db/firebase"
import { useRouter } from "@hooks/useRouter"
import { Bell, ChartArea, Edit2, Inbox, LogOut, Rss, Settings, Signature } from "lucide-react"
import { useLocation } from "react-router-dom"
import { useUser } from "src/lib/state"

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

   export function UserDropdown() {
      const user = useUser()

      const handleLogout = async () => {
         await auth.signOut()
         localStorage.removeItem("authToken")

         location.reload()
      }

      const handleSettings = () => {
         settingsStore.set(true)
      }

      return (
         <div className="min-w-[200px] rounded-lg bg-white p-2 shadow-lg">
            <div className="mb-2 border-b pb-2">
               <div className="px-3 py-2">
                  <div className="font-medium">{user?.email}</div>
                  <div className="text-sm opacity-60">Signed in</div>
               </div>
            </div>

            <div className="space-y-1">
               <button
                  onClick={handleSettings}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
               >
                  <Settings size={16} />
                  Settings
               </button>

               <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
               >
                  <LogOut size={16} />
                  Sign Out
               </button>
            </div>
         </div>
      )
   }

   export function UserAvatar() {
      const user = useUser()
      const route = useLocation().pathname.split("/")[1]
      const isActive = route === ""

      const initials = user?.email?.split("@")[0]?.slice(0, 2)?.toUpperCase() || "??"

      return (
         <Dropdown
            id="user-dropdown"
            placement={{
               triggerEdge: Edge.Top,
               expansionEdge: Edge.Bottom,
               expansionSide: Side.Left,
            }}
            expansion={<UserDropdown />}
         >
            {(expanded) => (
               <div
                  className={`flex aspect-square w-full cursor-pointer items-center justify-center rounded-full text-sm font-medium ${
                     expanded || isActive ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
               >
                  {initials}
               </div>
            )}
         </Dropdown>
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
            <Components.ActionButton icon={<Edit2 size={18} />} onClick={() => {}} />
         </Components.Section>
         <Components.Section>
            <Components.Route icon={<Signature size={18} />} route="/templates" />
            <Components.Route icon={<Bell size={18} />} route="/notifications" />
            <Components.UserAvatar />
         </Components.Section>
      </header>
   )
}
