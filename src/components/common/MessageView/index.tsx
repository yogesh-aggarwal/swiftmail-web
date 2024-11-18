import { useParams } from "react-router-dom"

export default function MessageView() {
   const id = useParams().id as string

   return <div>index Component</div>
}
