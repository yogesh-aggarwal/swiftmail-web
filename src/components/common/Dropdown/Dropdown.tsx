import { makeStore } from "common-react-toolkit"
import { AnimatePresence, motion } from "framer-motion"
import { useMemo } from "react"
import { DropdownPlacement_t, DropdownWidth_t, Edge, Side } from "./Dropdown.types"

const [dropdownStore, useDropdown] = makeStore<Record<string, boolean>>({})

document.addEventListener("click", (e) => {
   const currentDropdown = Object.keys(dropdownStore.value())[0]
   if (!currentDropdown) return

   const trigger = document.getElementById(currentDropdown)
   const expansion = document.getElementById("dropdown")

   if (!trigger || !expansion || trigger.contains(e.target as Node) || expansion.contains(e.target as Node))
      return

   trigger.click()
})

export default function Dropdown(props: {
   id: string
   children: (expanded: boolean) => React.ReactNode | React.ReactNode[]
   expansion: any
   placement: DropdownPlacement_t
   width?: DropdownWidth_t
   className?: string
}) {
   const expanded = useDropdown((x) => x[props.id])

   const placementStyling = useMemo(() => {
      let final = ""
      const { triggerEdge, expansionEdge, expansionSide } = props.placement

      if (triggerEdge === expansionEdge) {
         throw new Error("triggerEdge and expansionEdge cannot be the same")
      }

      if (triggerEdge === Edge.Left && expansionEdge === Edge.Right) {
         final += "top-0 right-full mr-1"
      } else if (triggerEdge === Edge.Right && expansionEdge === Edge.Left) {
         final += "top-0 left-full ml-1"
      } else if (triggerEdge === Edge.Top && expansionEdge === Edge.Bottom) {
         final += "bottom-full mb-1 "
         if (expansionSide === Side.Right) {
            final += "right-0"
         } else {
            final += "left-0"
         }
      } else if (triggerEdge === Edge.Bottom && expansionEdge === Edge.Top) {
         final += "top-full mt-1 "
         if (expansionSide === Side.Right) {
            final += "right-0"
         } else {
            final += "left-0"
         }
      } else {
         // can't happen
      }

      return final
   }, [props.placement])

   const widthStyling = useMemo(() => {
      if (props.width === "max") {
         return "min-w-full"
      } else {
         return "w-max"
      }
   }, [props.width])

   return (
      <div className="relative">
         {/* Trigger */}
         <div
            id={props.id}
            className={`cursor-pointer ${props.className}`}
            onClick={() => {
               const otherDropdowns = Object.keys(dropdownStore.value())
               if (otherDropdowns.length) {
                  if (otherDropdowns.includes(props.id)) {
                     dropdownStore.set({})
                  } else {
                     dropdownStore.set({ [props.id]: true })
                  }
               } else {
                  dropdownStore.merge({ [props.id]: true })
               }
            }}
         >
            {props.children(expanded)}
         </div>
         {/* Expansion */}
         <AnimatePresence>
            {expanded && (
               <motion.div
                  initial={{ opacity: 0, transform: "translateY(-5px)" }}
                  exit={{ opacity: 0, transform: "translateY(-5px)" }}
                  animate={{ opacity: 1, transform: "translateY(0)" }}
                  transition={{ duration: 0.15 }}
                  id="dropdown"
                  className={`${widthStyling} ${placementStyling} border-bg4 bg-bg2 shadow-bg1 absolute z-50 rounded-lg border shadow-2xl drop-shadow-xl`}
               >
                  {props.expansion}
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   )
}
