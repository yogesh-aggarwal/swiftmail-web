// ----------------------------------------------------------------------------
// Environment
// ----------------------------------------------------------------------------

export const IS_DEBUG = process.env.NODE_ENV === "development"
export const IS_PROD = process.env.NODE_ENV === "production"

// ----------------------------------------------------------------------------
// Application
// ----------------------------------------------------------------------------

export const APP_NAME: string = import.meta.env.VITE_APP_NAME!
export const APP_VERSION: string = import.meta.env.VITE_APP_VERSION!
export const APP_URL: string = import.meta.env.VITE_APP_URL!
export const APP_DESCRIPTION: string = import.meta.env.VITE_APP_DESCRIPTION!
export const APP_COMMIT_ID: string = import.meta.env.VITE_COMMIT_ID!

// ----------------------------------------------------------------------------
// API URIs
// ----------------------------------------------------------------------------

export const API_REST_BASE_URI = import.meta.env.VITE_API_REST_BASE_URI!

// ----------------------------------------------------------------------------
// Credentials
// ----------------------------------------------------------------------------

// Integrations
export const UNSPLASH_CLIENT_ID: string = import.meta.env.VITE_UNSPLASH_CLIENT_ID!

// ----------------------------------------------------------------------------
