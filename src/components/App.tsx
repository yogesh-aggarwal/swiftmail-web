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
      const Blog = lazy(() => import("./routes/Blog"))
      const Changelog = lazy(() => import("./routes/Changelog"))
      const Dashboard = lazy(() => import("./routes/Dashboard"))
      const Docs = lazy(() => import("./routes/Docs"))
      const Pricing = lazy(() => import("./routes/Pricing"))

      return (
         <BrowserRouter>
            <BaseLayout>
               <Suspense fallback={<ProgressCircle />}>
                  <Routes>
                     <Route path="/" element={<Navigate to="/dashboard" />} />
                     <Route path="*" element={<Navigate to="/dashboard" />} />

                     <Route path="/dashboard" element={<Dashboard />} />
                     <Route path="/docs" element={<Docs />} />
                     <Route path="/blog" element={<Blog />} />
                     <Route path="/pricing" element={<Pricing />} />
                     <Route path="/changelog" element={<Changelog />} />
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
