import { useEffect } from "react"

export default function Header() {
   useEffect(() => {
      function stackedOpacity(n: number): number {
         // Each layer is 1% opaque, or 0.01 in decimal
         const opacityPerLayer = 0.01
         // Calculate the effective opacity after stacking `n` layers
         const resultingOpacity = 1 - Math.pow(1 - opacityPerLayer, n)
         // Convert to percentage
         return resultingOpacity * 100
      }

      // Example usage:
      const n = 10
      console.log(`Resulting opacity after ${n} layers of 1% opacity: ${stackedOpacity(n).toFixed(2)}%`)
   })

   return <header className="layer-5 p-4 px-8 m-4 rounded-full">Header component</header>
}
