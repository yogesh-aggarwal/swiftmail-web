import { FirebaseOptions, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

import { IS_DEBUG } from "@core/constants"

const devCredentials: FirebaseOptions = {
   apiKey: "AIzaSyAeOjAcz8xa8feSSlwZrp5CRpgj3mH0lqw",
   authDomain: "swiftmail-backend.firebaseapp.com",
   projectId: "swiftmail-backend",
   storageBucket: "swiftmail-backend.appspot.com",
   messagingSenderId: "488233109498",
   appId: "1:488233109498:web:aa4c8d8746235e8f224643",
   measurementId: "G-DQ71Z7DHFC",
}

const prodCredentials: FirebaseOptions = {
   apiKey: "AIzaSyAeOjAcz8xa8feSSlwZrp5CRpgj3mH0lqw",
   authDomain: "swiftmail-backend.firebaseapp.com",
   projectId: "swiftmail-backend",
   storageBucket: "swiftmail-backend.appspot.com",
   messagingSenderId: "488233109498",
   appId: "1:488233109498:web:aa4c8d8746235e8f224643",
   measurementId: "G-DQ71Z7DHFC",
}

const credentials = IS_DEBUG ? devCredentials : prodCredentials

initializeApp(credentials)

export const db = getFirestore()
export const auth = getAuth()
