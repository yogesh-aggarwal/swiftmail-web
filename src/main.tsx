import "./main.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "@components/App"
import { POSTHOG_API_HOST, POSTHOG_API_KEY } from "@core/constants"
import { PostHogProvider } from "posthog-js/react"

// PushNotificationManager.registerServiceWorker()

function Analytics(props: { children: any }) {
   return (
      <PostHogProvider apiKey={POSTHOG_API_KEY} options={{ api_host: POSTHOG_API_HOST }}>
         {props.children}
      </PostHogProvider>
   )
}

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <App />
   </StrictMode>
)
