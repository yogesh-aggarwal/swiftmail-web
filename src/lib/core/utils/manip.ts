export class Manip {
   static toTitleCase(str: string): string {
      return str.replace(/\w\S*/g, (txt) => {
         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
   }

   static reverseString(str: string): string {
      return str.split("").reverse().join("")
   }

   static truncateString(str: string, num: number): string {
      if (str.length <= num) {
         return str
      }
      return str.slice(0, num) + "..."
   }

   static removeWhitespace(str: string): string {
      return str.replace(/\s+/g, "")
   }

   static capitalizeFirstLetter(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1)
   }
}
