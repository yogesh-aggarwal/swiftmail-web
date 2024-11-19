import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import BaseLayout from "@layouts/BaseLayout"
import ProgressCircle from "@ui/ProgressCircle"
import { initAuthListener } from "@utils/auth"
import { useAuth } from "src/lib/state"
import Settings from "./common/Settings"
import ThreadView from "./common/ThreadView"
import Auth from "./routes/Auth"

namespace Components {
   export function Unauthenticated() {
      return <Auth />
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
               <Settings />
               <Suspense fallback={<ProgressCircle />}>
                  <Routes>
                     <Route path="/" element={<Navigate to="/inbox" />} />
                     <Route path="*" element={<Navigate to="/inbox" />} />

                     <Route path="/inbox" element={<Inbox />}>
                        <Route path=":id" element={<ThreadView />} />
                     </Route>
                     <Route path="/digest" element={<Digest />}>
                        <Route path=":id" element={<ThreadView />} />
                     </Route>
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

initAuthListener()

export default function App() {
   const isAuthenticated = useAuth()

   // onMount(() => {
   //    signInWithEmailAndPassword(auth, "yogeshdevaggarwal@gmail.com", "12345678")
   // })

   return isAuthenticated ? <Components.Authenticated /> : <Components.Unauthenticated />
}
