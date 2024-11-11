import "./main.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "@components/App"
import { POSTHOG_API_HOST, POSTHOG_API_KEY } from "@core/constants"
import { PushNotificationManager } from "@utils/sw"
import { PostHogProvider } from "posthog-js/react"
import { QueryClient, QueryClientProvider } from "react-query"

PushNotificationManager.registerServiceWorker()

const queryClient = new QueryClient()

function Analytics(props: { children: any }) {
   return (
      <PostHogProvider apiKey={POSTHOG_API_KEY} options={{ api_host: POSTHOG_API_HOST }}>
         {props.children}
      </PostHogProvider>
   )
}

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <Analytics>
         <QueryClientProvider client={queryClient}>
            <App />
         </QueryClientProvider>
      </Analytics>
   </StrictMode>
)
