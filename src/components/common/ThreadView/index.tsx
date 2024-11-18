import { API } from "@api/api"
import { onUpdate } from "common-react-toolkit"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Message } from "src/lib/types/models/message"

export default function ThreadView() {
   const id = useParams().id as string

   const [messages, setMessages] = useState<Message[]>([])

   onUpdate(async () => {
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

   return <div>ThreadView Component</div>
}
