import { TooltipProvider } from "@ui/tooltip"

import { ThemeProvider } from "@providers/theme"
import Root from "./routes/root"

export default function App() {
   return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
         <TooltipProvider delayDuration={0}>
            <Root />
         </TooltipProvider>
      </ThemeProvider>
   )
}
