import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Sidebar } from "@components/common/sidebar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@ui/resizable"
import { TooltipProvider } from "@ui/tooltip"
import { lazy, Suspense } from "react"

const NotFoundPage = lazy(() => import("./not-found/not-found"))
const InboxPage = lazy(() => import("./inbox/inbox"))

export default function Root() {
   return (
      <TooltipProvider delayDuration={0}>
         <BrowserRouter>
            <ResizablePanelGroup
               direction="horizontal"
               onLayout={(sizes: number[]) => {
                  document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(sizes)}`
               }}
               className="h-full max-h-[800px] items-stretch"
            >
               <Sidebar />
               <ResizableHandle withHandle />
               <Suspense fallback={<ResizablePanel defaultSize={85} minSize={85} maxSize={80} />}>
                  <Routes>
                     <Route path="/inbox" element={<InboxPage />} />
                     <Route path="*" element={<NotFoundPage />} />
                  </Routes>
               </Suspense>
            </ResizablePanelGroup>
         </BrowserRouter>
      </TooltipProvider>
   )
}
