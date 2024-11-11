import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { db } from "@core/db/firebase"
import BaseLayout from "@layouts/BaseLayout"
import { DigestDB } from "@models/digest"
import { MessageDB } from "@models/message"
import ProgressCircle from "@ui/ProgressCircle"
import { collection, query, where } from "firebase/firestore"
import { useAuth, userStore } from "src/lib/state"

userStore.subscribe((user) => {
   if (!user) return

   DigestDB.ListenDocsByQuery(query(collection(db, DigestDB.collection), where("user_id", "==", user.id)))
   MessageDB.ListenDocsByQuery(query(collection(db, MessageDB.collection), where("user_id", "==", user.id)))
})

namespace Components {
   export function Unauthenticated() {
      return "Unauthenticated"
   }

   export function Authenticated() {
      const Inbox = lazy(() => import("./routes/Inbox"))
      const Digest = lazy(() => import("./routes/Digest"))
      const Attachments = lazy(() => import("./routes/Attachments"))
      const Contacts = lazy(() => import("./routes/Contacts"))
      const Dashboard = lazy(() => import("./routes/Dashboard"))
      const Templates = lazy(() => import("./routes/Templates"))
      const Notifications = lazy(() => import("./routes/Notifications"))

      return (
         <BrowserRouter>
            <BaseLayout>
               <Suspense fallback={<ProgressCircle />}>
                  <Routes>
                     <Route path="/" element={<Navigate to="/inbox" />} />
                     <Route path="*" element={<Navigate to="/inbox" />} />

                     <Route path="/inbox" element={<Inbox />} />
                     <Route path="/digest" element={<Digest />} />
                     <Route path="/attachments" element={<Attachments />} />
                     <Route path="/contacts" element={<Contacts />} />
                     <Route path="/dashboard" element={<Dashboard />} />
                     <Route path="/templates" element={<Templates />} />
                     <Route path="/notifications" element={<Notifications />} />
                  </Routes>
               </Suspense>
            </BaseLayout>
         </BrowserRouter>
      )
   }
}

export default function App() {
   const isAuthenticated = useAuth()

   return isAuthenticated ? <Components.Authenticated /> : <Components.Unauthenticated />
}
