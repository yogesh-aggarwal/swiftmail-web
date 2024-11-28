import { API } from "@api/api"
import { Manip } from "@utils/manip"
import { classNames } from "@utils/ui"
import { makeStore, onUpdate } from "common-react-toolkit"
import {
   ArrowUp,
   CheckCheck,
   ChevronDown,
   ChevronUp,
   RefreshCcw,
   Reply,
   Star,
   Tag,
   Text,
   Trash2,
} from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Message } from "src/lib/types/models/message"
import { Thread } from "src/lib/types/models/thread"
import Dropdown from "../Dropdown/Dropdown"
import { Edge, Side } from "../Dropdown/Dropdown.types"

const [uiStore, useUI] = makeStore<{
   isReplying: boolean
   replyingMessageId: string | null
   isSummaryExpanded: boolean
}>({
   isReplying: false,
   replyingMessageId: null,
   isSummaryExpanded: true,
})

namespace Components {
   export function MessageReply() {
      const ref = useRef<HTMLDivElement>(null)
      const isReplying = useUI((x) => x.isReplying)

      const [isWorking, setIsWorking] = useState(false)

      onUpdate(() => {
         ref.current?.focus()
      }, [isReplying, ref])

      const handleSubmit = useCallback(async () => {
         setIsWorking(true)
         const replyingMessageId = uiStore.value().replyingMessageId
         const innerHTML = ref.current?.innerHTML

         const res = await fetch("https://swiftmail-pubsub-api.onrender.com/queue/reply", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({
               message_id: replyingMessageId,
               reply_body: innerHTML,
            }),
         })
         if (res.status !== 200) {
            console.error(res)
         } else {
            console.log(await res.json())
         }

         console.log(innerHTML)
      }, [])
      const handleCancel = useCallback(() => {
         uiStore.merge({
            isReplying: false,
            replyingMessageId: null,
         })
      }, [])

      if (!isReplying) return null

      return (
         <div className="h-max-[200px] p-4">
            <div className="flex h-full w-full items-end gap-2 rounded-[1.3rem] border border-gray-200 focus-within:border-gray-300">
               <div
                  ref={ref}
                  contentEditable
                  className="h-full w-full resize-none rounded-[inherit] p-4 text-[.9rem] outline-none"
                  onKeyDown={(e) => {
                     if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit()
                     }
                  }}
               />
               <div className="flex flex-col gap-4 p-4 pl-0">
                  <div
                     onClick={handleSubmit}
                     className={classNames(
                        "flex aspect-[1] h-[42px] items-center justify-center gap-4 rounded-[1rem]",
                        !isWorking
                           ? "cursor-pointer bg-black text-white hover:bg-gray-800"
                           : "cursor-wait bg-background text-gray-500"
                     )}
                  >
                     <ArrowUp size={20} />
                  </div>
                  <div
                     onClick={handleCancel}
                     className={classNames(
                        "flex aspect-[1] h-[42px] items-center justify-center gap-4 rounded-[1rem]",
                        "cursor-pointer bg-gray-200 text-black"
                     )}
                  >
                     <Trash2 size={20} />
                  </div>
               </div>
            </div>
         </div>
      )
   }

   export function Message({ message, expanded = false }: { message: Message; expanded?: boolean }) {
      const [isExpanded, setIsExpanded] = useState(expanded)

      return (
         <div className="mx-5 flex flex-col border-b border-gray-200 py-4">
            <div
               className="flex cursor-pointer items-center justify-between"
               onClick={() => {
                  setIsExpanded(!isExpanded)
               }}
            >
               <div className="flex cursor-pointer items-center">
                  {/* <img
                     src="data:image/png;base64,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"
                     alt="Sender Avatar"
                     className="mr-4 h-10 w-10 rounded-full"
                  /> */}
                  <div className="flex flex-col">
                     <span className="font-bold">{message.email_data.from_email}</span>
                     <span className="text-sm text-gray-500">
                        {Intl.DateTimeFormat(undefined, {
                           dateStyle: "medium",
                           timeStyle: "short",
                        }).format(new Date(message.date_created))}
                     </span>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <div
                     onClick={(e) => {
                        e.stopPropagation()
                        uiStore.merge({
                           isReplying: true,
                           replyingMessageId: message.id,
                        })
                     }}
                     className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]"
                  >
                     <Reply size={16} />
                  </div>
                  <div className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]">
                     {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
               </div>
            </div>
            <div
               className={`mt-4 ${isExpanded ? "block" : "hidden"}`}
               dangerouslySetInnerHTML={{ __html: message.email_data.html_content }}
            />
         </div>
      )
   }
}

export default function ThreadView() {
   const id = useParams().id as string

   const [isLoading, setIsLoading] = useState(true)
   const [thread, setThread] = useState<Thread | null>(null)
   const [messages, setMessages] = useState<Message[] | null>(null)

   const isSummaryExpanded = useUI((x) => x.isSummaryExpanded)

   const fetchThread = useCallback(async () => {
      const [response, error] = await API.request({
         method: "GET",
         url: API.buildURL(`/api/thread/${id}`),
      })
      if (error) {
         console.error(error)
         return
      }
      setThread(response?.data ?? null)
   }, [id])

   const fetchMessages = useCallback(async () => {
      const [response, error] = await API.request({
         method: "GET",
         url: API.buildURL(`/api/thread/${id}/messages`),
      })
      if (error) {
         console.error(error)
         return
      }
      setMessages(response?.data ?? [])
   }, [id])

   const toggleReadStatus = async () => {
      const [, error] = await API.request({
         method: "PATCH",
         url: API.buildURL(`/api/thread/${id}/read`),
      })
      if (error) {
         console.error(error)
         return
      }
      setThread((prev) => (prev ? { ...prev, flags: { ...prev.flags, is_read: !prev.flags.is_read } } : prev))
   }

   const toggleStarStatus = async () => {
      const currentStarStatus = thread?.flags.is_starred ?? false
      const [, error] = await API.request({
         method: "PATCH",
         url: API.buildURL(`/api/thread/${id}/star`),
         body: { is_starred: !currentStarStatus },
      })
      if (error) {
         console.error(error)
         return
      }
      setThread((prev) =>
         prev ? { ...prev, flags: { ...prev.flags, is_starred: !currentStarStatus } } : prev
      )
   }

   const toggleTrashStatus = async () => {
      const [, error] = await API.request({
         method: "DELETE",
         url: API.buildURL(`/api/thread/${id}/trash`),
      })
      if (error) {
         console.error(error)
         return
      }
      setThread((prev) =>
         prev ? { ...prev, flags: { ...prev.flags, is_trash: !prev.flags.is_trash } } : prev
      )
   }

   const updateLabels = async (labels: string[]) => {
      const [, error] = await API.request({
         method: "PATCH",
         url: API.buildURL(`/api/thread/${id}/labels`),
         body: { labels },
      })
      if (error) {
         console.error(error)
         return
      }
      // Update UI state if necessary
   }

   onUpdate(async () => {
      setIsLoading(true)
      await Promise.all([fetchThread(), fetchMessages()])
      setIsLoading(false)
   }, [id, fetchThread, fetchMessages])

   return (
      <div className="grid h-full grid-rows-[min-content,1fr,min-content] overflow-auto">
         <div>
            <div className="flex h-[72px] items-center justify-between px-5">
               <div className="flex items-center gap-5">
                  <div className="text-[1.5rem] font-medium">{thread?.title}</div>
                  <div className="mt-2 flex items-center gap-2">
                     <div className="rounded-lg bg-green-bg px-2 py-1 text-[.7rem]">
                        <span className="opacity-70">
                           {Manip.toTitleCase(thread?.priority ?? "")} priority
                        </span>
                     </div>
                     <div className="rounded-lg bg-purple-bg px-2 py-1 text-[.7rem]">
                        <span className="opacity-70">
                           {thread?.labels.map((x) => Manip.toTitleCase(x)).join(", ")}
                        </span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  {isLoading && (
                     <div className="flex aspect-square w-[40px] animate-spin cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]">
                        <RefreshCcw size={16} />
                     </div>
                  )}
                  <div
                     onClick={() => uiStore.merge({ isSummaryExpanded: !uiStore.value().isSummaryExpanded })}
                     className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]"
                  >
                     <Text size={16} />
                  </div>
                  <div
                     onClick={toggleStarStatus}
                     className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]"
                  >
                     <Star size={16} className={thread?.flags.is_starred ? "text-yellow-500" : ""} />
                  </div>
                  <div
                     onClick={toggleReadStatus}
                     className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]"
                  >
                     <CheckCheck size={16} className={thread?.flags.is_read ? "text-green-500" : ""} />
                  </div>
                  <Dropdown
                     id="label-dropdown"
                     placement={{
                        triggerEdge: Edge.Left,
                        expansionEdge: Edge.Bottom,
                        expansionSide: Side.Left,
                     }}
                     expansion={<div>Label</div>}
                  >
                     {() => (
                        <div
                           onClick={() => updateLabels(["Important"])}
                           className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]"
                        >
                           <Tag size={16} />
                        </div>
                     )}
                  </Dropdown>
                  <div
                     onClick={toggleTrashStatus}
                     className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-bg text-[.84rem]"
                  >
                     <Trash2 size={16} className={thread?.flags.is_trash ? "text-red-500" : ""} />
                  </div>
               </div>
            </div>
            {isSummaryExpanded && (
               <div className="mx-4 mb-4 rounded-xl bg-gray-100 p-4">
                  <div className="mb-2 text-[1.2rem] font-semibold">Summary</div>
                  <div>{thread?.summary}</div>
               </div>
            )}
         </div>
         <div className="flex h-full flex-col gap-2 overflow-y-auto">
            {messages?.map((message, index) => (
               <div key={message.id} className="">
                  <Components.Message message={message} expanded={index === messages.length - 1} />
               </div>
            ))}
         </div>
         <Components.MessageReply />
      </div>
   )
}
