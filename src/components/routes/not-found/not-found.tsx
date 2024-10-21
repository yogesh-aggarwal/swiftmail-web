import { ResizablePanel } from "@ui/resizable"

export default function NotFoundPage() {
   return (
      <ResizablePanel defaultSize={85} minSize={85} maxSize={80}>
         <div className="flex items-center justify-center h-full">
            <h1 className="text-4xl font-bold">404 Not Found</h1>
         </div>
      </ResizablePanel>
   )
}
