// ----------------------------------------------------------------------------------------------------------
// Environment
// ----------------------------------------------------------------------------------------------------------

export const IS_DEBUG = process.env.NODE_ENV === "development"
export const IS_PROD = process.env.NODE_ENV === "production"

// ----------------------------------------------------------------------------------------------------------
// Application
// ----------------------------------------------------------------------------------------------------------

export const APP_NAME: string = import.meta.env.VITE_APP_NAME!
export const APP_VERSION: string = import.meta.env.VITE_APP_VERSION!
export const APP_URL: string = import.meta.env.VITE_APP_URL!
export const APP_DESCRIPTION: string = import.meta.env.VITE_APP_DESCRIPTION!
export const APP_COMMIT_ID: string = import.meta.env.VITE_COMMIT_ID!

// ----------------------------------------------------------------------------------------------------------
// PusH notification Configuration
// ----------------------------------------------------------------------------------------------------------

export const VAPID_PUBLIC_KEY: string = import.meta.env.VITE_VAPID_PUBLIC_KEY!

// ----------------------------------------------------------------------------------------------------------
// API URIs
// ----------------------------------------------------------------------------------------------------------

export const API_REST_BASE_URI = import.meta.env.VITE_API_REST_BASE_URI!
export const API_WS_BASE_URI = import.meta.env.VITE_API_WS_BASE_URI!

// ----------------------------------------------------------------------------------------------------------
// Credentials
// ----------------------------------------------------------------------------------------------------------

// Essentials
export const POSTHOG_API_KEY: string = import.meta.env.VITE_POSTHOG_API_KEY!
export const POSTHOG_API_HOST: string = import.meta.env.VITE_POSTHOG_API_HOST!

// Integrations
export const UNSPLASH_CLIENT_ID: string = import.meta.env.VITE_UNSPLASH_CLIENT_ID!

// ----------------------------------------------------------------------------------------------------------
