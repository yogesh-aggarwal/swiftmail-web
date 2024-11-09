import { JsonType } from "posthog-js"
import { useFeatureFlagEnabled, useFeatureFlagPayload } from "posthog-js/react"

/**
 * Hook to retrieve the payload of a feature flag if it is enabled.
 *
 * @param key - The key of the feature flag to check.
 * @returns The payload of the feature flag if enabled, otherwise null.
 *
 * @example
 * ```typescript
 * const featurePayload = useFeatureFlag('new-feature')
 * if (featurePayload) {
 *   // Feature is enabled, use the payload
 * } else {
 *   // Feature is not enabled
 * }
 * ```
 */
export function useFeatureFlag(key: string): JsonType | null {
   const enabled = useFeatureFlagEnabled(key)
   const payload = useFeatureFlagPayload(key)

   if (!enabled) return null

   return payload || null
}
