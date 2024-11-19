import { AnimatePresence, motion } from "framer-motion"
import { CheckCheck, Edit2, Filter, LucideStar, PlusCircle, RefreshCcw, X } from "lucide-react"
import { Outlet, useParams } from "react-router-dom"

import Topbar from "@components/common/Topbar"
import { useRouter } from "@hooks/useRouter"
import RouteLayout from "@layouts/RouteLayout"
import { Manip } from "@utils/manip"
import { classNames } from "@utils/ui"
import { makeStore, useBoundValue } from "common-react-toolkit"
import { useEffect, useMemo, useState } from "react"
import { digestsStore, useDigests, userStore } from "src/lib/state"
import { Thread } from "src/lib/types/models/thread"

const [uiStore, useUI] = makeStore<{
   digestID: string
   filter: {
      date_start: number
      date_end: number
      priorities: string[]
      categories: string[]
   }
}>(
   {
      digestID: "",
      filter: {
         date_start: 0,
         date_end: 0,
         priorities: [],
         categories: [],
      },
   },
   {},
   { storeID: "digest_route_ui", disableComparison: true }
)

const [newDigestStore, useNewDigest] = makeStore<boolean>(false, {}, {})
const [editDigestStore, useEditDigest] = makeStore<boolean>(false, {}, {})

namespace Components {
   export function Header() {
      const digest = useDigests()
      const digestID = useUI((x) => x.digestID)

      const digestActions = useMemo(() => {
         if (!digest) return []

         const digests = Object.entries(digest?.digests ?? {}).map(([id, digestData]) => ({
            name: digestData.name,
            badge: digestData.unreadCount ? digestData.unreadCount.toString() : undefined,
            onClick: () => uiStore.merge({ digestID: id }),
            active: id === digestID,
         }))

         return digests
      }, [digest, digestID])

      return (
         <Topbar
            actions={digestActions}
            search={{
               placeholder: "Search in digests",
               onSearch: (query) => console.log(query),
               onKeyUp: (e) => e.key === "Enter" && console.log("Search"),
            }}
            secondaryActions={[
               {
                  name: "New Digest",
                  icon: <PlusCircle size={20} />,
                  onClick: () => newDigestStore.set(true),
               },
            ]}
         />
      )
   }

   function Card(props: { meta: Thread }) {
      const id = (useParams().id as string) ?? ""
      const router = useRouter()

      return (
         <div
            onClick={() => router(`/digest/${props.meta.id}`)}
            className={classNames(
               "cursor-pointer rounded-xl p-3",
               id == props.meta.id ? "bg-purple-bg hover:bg-purple-bg" : "hover:bg-gray-bg"
            )}
         >
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <LucideStar size={16} />
                  <div className="text-[1rem] font-medium">Sender</div>
               </div>
               <div className="text-[.75rem] opacity-55">
                  {Intl.DateTimeFormat("en-US", {
                     month: "short",
                     day: "numeric",
                     hour: "numeric",
                     minute: "numeric",
                  }).format(props.meta.date_updated)}
               </div>
            </div>
            <div className="pt-[2px] text-[.85rem] opacity-75">{props.meta.title}</div>
            <div className="pt-[2px] text-[.85rem] opacity-55">{props.meta.title}</div>
            <div className="mt-2 flex items-center gap-2">
               <div className="rounded-lg bg-green-bg px-2 py-1 text-[.7rem]">
                  <span className="opacity-70">{Manip.toTitleCase(props.meta.priority)} priority</span>
               </div>
            </div>
         </div>
      )
   }

   export function Messages() {
      const selectedDigest = useUI((x) => x.digestID)
      const threads = useDigests((x) => x?.digests?.[selectedDigest]?.threads ?? [], [selectedDigest])

      if (!threads.length) return <div className="flex h-full items-center justify-center">No messages</div>

      return (
         <div className="flex h-full flex-col gap-1 overflow-y-auto p-2 pt-0">
            <div className="mb-4">
               {threads.map((thread) => (
                  <Card key={thread.id} meta={thread} />
               ))}
            </div>
            <div className="flex min-h-[52px] items-center justify-center text-sm opacity-30">
               You have reached the end
            </div>
         </div>
      )
   }

   export function NewDigestModal() {
      const isOpen = useNewDigest()
      const [title, setTitle] = useState("")
      const [description, setDescription] = useState("")
      const [shouldReorganize, setShouldReorganize] = useState(false)

      if (!isOpen) return null

      const handleCreate = () => {
         console.log("Creating new digest...", { title, description, shouldReorganize })
         newDigestStore.set(false)
      }

      return (
         <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
               <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-[500px] overflow-hidden rounded-2xl bg-white shadow-xl"
               >
                  <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
                     <div className="flex items-center justify-between">
                        <div className="text-2xl font-medium">New Digest</div>
                        <div
                           onClick={() => newDigestStore.set(false)}
                           className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
                        >
                           <X size={20} />
                        </div>
                     </div>
                  </div>

                  <div className="p-6">
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Title</label>
                           <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Enter digest title..."
                              className="w-full rounded-lg border px-3 py-2 text-sm"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-sm font-medium">Description</label>
                           <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Enter digest description..."
                              className="h-24 w-full rounded-lg border px-3 py-2 text-sm"
                           />
                        </div>

                        <div className="flex items-center gap-2">
                           <input
                              type="checkbox"
                              id="reorganize"
                              checked={shouldReorganize}
                              onChange={(e) => setShouldReorganize(e.target.checked)}
                              className="rounded border-gray-300"
                           />
                           <label htmlFor="reorganize" className="text-sm">
                              Reorganize inbox messages
                           </label>
                        </div>
                     </div>
                  </div>

                  <div className="sticky bottom-0 border-t bg-white px-6 py-4">
                     <button
                        onClick={handleCreate}
                        className="w-full rounded-lg bg-black py-2 text-white transition-colors hover:bg-black/90"
                     >
                        Create Digest
                     </button>
                  </div>
               </motion.div>
            </div>
         </AnimatePresence>
      )
   }

   export function EditDigestModal() {
      const isOpen = useEditDigest()
      const selectedDigest = useUI((x) => x.digestID)
      const digestData = useDigests((x) => x?.digests?.[selectedDigest])

      const [title, setTitle] = useState("")
      const [description, setDescription] = useState("")

      useEffect(() => {
         if (isOpen && digestData) {
            setTitle(digestData.name)
            setDescription(digestData.description || "")
         }
      }, [isOpen, digestData])

      if (!isOpen) return null

      const handleSave = () => {
         console.log("Updating digest...", { id: selectedDigest, title, description })
         editDigestStore.set(false)
      }

      return (
         <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
               <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-[500px] overflow-hidden rounded-2xl bg-white shadow-xl"
               >
                  <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
                     <div className="flex items-center justify-between">
                        <div className="text-2xl font-medium">Edit Digest</div>
                        <div
                           onClick={() => editDigestStore.set(false)}
                           className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
                        >
                           <X size={20} />
                        </div>
                     </div>
                  </div>

                  <div className="p-6">
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Title</label>
                           <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Enter digest title..."
                              className="w-full rounded-lg border px-3 py-2 text-sm"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-sm font-medium">Description</label>
                           <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Enter digest description..."
                              className="h-24 w-full rounded-lg border px-3 py-2 text-sm"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="sticky bottom-0 border-t bg-white px-6 py-4">
                     <button
                        onClick={handleSave}
                        className="w-full rounded-lg bg-black py-2 text-white transition-colors hover:bg-black/90"
                     >
                        Save Changes
                     </button>
                  </div>
               </motion.div>
            </div>
         </AnimatePresence>
      )
   }
}

export default function DigestRoute() {
   const userID = userStore.value()?.id
   if (!userID) return

   const isLoading = false
   const unreadCount = useDigests((x) => x?.unreadCount ?? 0)

   /* If no category is selected, select the first one */
   useBoundValue(() => {
      const { digestID } = uiStore.value()
      if (digestID) return

      const digests = Object.keys(digestsStore.value()?.digests ?? {})
      if (digests.length === 0) return

      uiStore.merge({ digestID: digests[0] })
   }, [digestsStore, uiStore])

   return (
      <>
         <RouteLayout topbar={<Components.Header />} className="grid grid-cols-[min-content,1fr] gap-2">
            <div className="grid h-full w-[400px] grid-rows-[min-content,1fr] overflow-y-auto rounded-[1.6rem] bg-white">
               <div className="flex h-[72px] items-center justify-between px-5">
                  <div className="text-[1.5rem] font-medium">Digest</div>
                  <div className="flex items-center gap-2">
                     {isLoading && (
                        <div className="flex aspect-square w-[40px] animate-spin cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]">
                           <RefreshCcw size={16} />
                        </div>
                     )}
                     {unreadCount > 0 && (
                        <div className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]">
                           <CheckCheck size={16} />
                        </div>
                     )}
                     <div className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]">
                        <Filter size={16} />
                     </div>
                     <div
                        onClick={() => editDigestStore.set(true)}
                        className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]"
                     >
                        <Edit2 size={16} />
                     </div>
                  </div>
               </div>
               <Components.Messages />
            </div>
            <div className="h-full w-full overflow-y-auto rounded-[1.6rem] bg-white">
               <Outlet />
            </div>
         </RouteLayout>
         <Components.NewDigestModal />
         <Components.EditDigestModal />
      </>
   )
}
