import { WS } from "@api/websocket/websocket"
import { auth, db } from "@core/db/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, onSnapshot, Unsubscribe } from "firebase/firestore"
import { userStore } from "src/lib/state"
import { User } from "src/lib/types/models/user"

let subscription: Unsubscribe | null = null

export function initAuthListener() {
   onAuthStateChanged(auth, async (user) => {
      if (!user) {
         userStore.set(null)
         localStorage.removeItem("authToken")
         return
      }

      // Connect to the websocket server
      const authToken = await user.getIdToken()
      localStorage.setItem("authToken", authToken)

      WS.connect({ token: authToken })

      // Remove the trailing \r character from the uid
      const uid = user.uid.replace("\r", "")

      // Unsubscribe from the previous user
      if (subscription) {
         if (user.uid != userStore.value()?._id) {
            subscription()
            subscription = null
         } else {
            return
         }
      }

      // Check if user is already in the database or not, if not create it.
      {
         const exists = (await getDoc(doc(db, "/users", uid))).exists()
         if (!exists) return

         subscription = onSnapshot(doc(db, "/users", uid), (doc) => {
            const user = doc.data() as User
            userStore.set(user)
         })
      }
   })
}
