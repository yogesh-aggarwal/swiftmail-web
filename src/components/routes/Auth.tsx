import { auth } from "@core/db/firebase"
import { classNames } from "@utils/ui"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { motion } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"
import { useState } from "react"

function AuthForm() {
   const [isLogin, setIsLogin] = useState(true)
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState("")

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError("")

      try {
         if (isLogin) {
            await signInWithEmailAndPassword(auth, email, password)
            location.reload()
         } else {
            await createUserWithEmailAndPassword(auth, email, password)
         }
      } catch (err: any) {
         setError(err.message)
      } finally {
         setLoading(false)
      }
   }

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3 }}
         className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-white p-8 shadow-xl"
      >
         <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Welcome Back</h1>
            <p className="text-sm opacity-60">
               {isLogin ? "Sign in to continue to your account" : "Create an account to get started"}
            </p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
               <label className="text-sm font-medium">Email</label>
               <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter your email"
                  required
               />
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium">Password</label>
               <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter your password"
                  required
               />
            </div>

            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">{error}</div>}

            <button
               type="submit"
               disabled={loading}
               className={classNames(
                  "flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-all hover:bg-black/90",
                  loading ? "cursor-not-allowed opacity-70" : ""
               )}
            >
               {loading ? (
                  <Loader2 size={18} className="animate-spin" />
               ) : (
                  <>
                     {isLogin ? "Sign In" : "Create Account"}
                     <ArrowRight size={18} />
                  </>
               )}
            </button>
         </form>

         <div className="mt-6 text-center">
            <button
               onClick={() => setIsLogin(!isLogin)}
               className="text-sm text-purple-600 hover:text-purple-700"
            >
               {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
         </div>
      </motion.div>
   )
}

export default function Auth() {
   return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
         <div className="w-full max-w-[1400px]">
            <div className="grid gap-8 lg:grid-cols-2">
               {/* Left side - Auth Form */}
               <div className="flex items-center justify-center">
                  <AuthForm />
               </div>

               {/* Right side - Feature Highlights */}
               <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="hidden lg:block"
               >
                  <div className="rounded-2xl bg-purple-50 p-8">
                     <h2 className="mb-6 text-2xl font-bold">Why Choose SwiftMail?</h2>
                     <div className="space-y-4">
                        {[
                           {
                              title: "Smart Organization",
                              description: "Automatically categorize and prioritize your emails",
                           },
                           {
                              title: "Digest Feature",
                              description: "Create custom digests for better email management",
                           },
                           {
                              title: "Beautiful Interface",
                              description: "Modern and intuitive design for a seamless experience",
                           },
                        ].map((feature, index) => (
                           <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                              className="rounded-xl bg-white p-4"
                           >
                              <h3 className="mb-1 font-medium">{feature.title}</h3>
                              <p className="text-sm opacity-60">{feature.description}</p>
                           </motion.div>
                        ))}
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </div>
   )
}
