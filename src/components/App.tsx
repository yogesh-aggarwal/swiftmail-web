import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import BaseLayout from "@layouts/BaseLayout"
import ProgressCircle from "@ui/ProgressCircle"
import { useAuth } from "src/lib/state"

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
                     <Route path="/" element={<Navigate to="/dashboard" />} />
                     <Route path="*" element={<Navigate to="/dashboard" />} />

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
