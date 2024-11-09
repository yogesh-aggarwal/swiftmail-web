import { API } from "@api/api"
import { AuthAPIError, AuthAPIErrorMessageDescription } from "./auth.types"

export class AuthAPI {
   static async loginWithEmailAndPassword(email: string, password: string) {
      type Error = AuthAPIError
      type Response = { message: string; data: { user: any; token: string } }

      const [res, err] = await API.request<Response, Error>({
         method: "POST",
         url: API.buildURL("/auth/login"),
         body: { email, password },
      })

      if (err) {
         throw new Error(AuthAPIErrorMessageDescription[err.message])
      }

      console.log(res!.data!.data.user)
   }
}
