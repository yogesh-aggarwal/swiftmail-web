import { auth, db } from "@core/db/firebase"
import { User } from "@models/user"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, onSnapshot, Unsubscribe } from "firebase/firestore"
import { userStore } from "src/lib/state"

let subscription: Unsubscribe | null = null

export function initAuthListener() {
   onAuthStateChanged(auth, async (user) => {
      if (!user) {
         userStore.set(null)
         localStorage.removeItem("authToken")
         return
      }

      const uid = user.uid.replace("\r", "")

      // Unsubscribe from the previous user
      if (subscription) {
         if (user.uid != userStore.value()?.id) {
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

      localStorage.setItem("authToken", await user.getIdToken())
   })
}
