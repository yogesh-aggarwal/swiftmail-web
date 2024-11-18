import { useParams } from "react-router-dom"

export default function ThreadView() {
   const id = useParams().id as string

   return <div>ThreadView Component</div>
}
