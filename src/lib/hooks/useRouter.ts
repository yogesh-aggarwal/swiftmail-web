import { useNavigate } from "react-router-dom"

/**
 * Custom hook that returns a function to navigate to a specified route.
 * The route is prefixed with application's constant routing information such as project ID, organization ID, etc.
 *
 * @returns A function that takes a route string and navigates to the new absolute route.
 *
 * @example
 * ```ts
 * const navigate = useRouter()
 * navigate("dashboard")  // Navigates to "/prefix/dashboard"
 * ```
 */
export function useRouter(): (route: string) => void {
   const navigate = useNavigate()

   const projectID = ""
   const prefix = `/${projectID}`

   return (route: string) => {
      const newAbsoluteRoute = `/${prefix}/${route}`.replace(/\/{2,}/g, "/")
      navigate(newAbsoluteRoute)
   }
}
