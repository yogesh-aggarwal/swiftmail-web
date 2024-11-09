/**
 * `Manip` class provides static methods for various string manipulations,
 * including converting to title case, reversing, truncating, removing whitespaces,
 * and capitalizing the first letter of a string.
 */
export class Manip {
   /**
    * Compares two Uint8Array objects for equality.
    *
    * @param a - The first Uint8Array to compare.
    * @param b - The second Uint8Array to compare.
    * @returns - Returns `true` if both Uint8Array objects are equal in length and content, otherwise `false`.
    */
   static compareUInt8Arrays(a: Uint8Array, b: Uint8Array): boolean {
      if (a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
         if (a[i] !== b[i]) return false
      }
      return true
   }

   /**
    * Converts a Base64 URL string to a Uint8Array.
    *
    * This function takes a Base64 URL encoded string, adds necessary padding,
    * replaces URL-specific characters with standard Base64 characters, decodes
    * the Base64 string to raw binary data, and then converts it to a Uint8Array.
    *
    * @param base64String - The Base64 URL encoded string to convert.
    * @returns A Uint8Array representing the decoded binary data.
    */
   static urlB64ToUint8Array(base64String: string) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
      const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")
      const rawData = atob(base64)

      const outputArray = new Uint8Array([...rawData].map((char) => char.charCodeAt(0)))
      return outputArray
   }

   /**
    * Encodes a given string to base64url format.
    *
    * This method first converts the input string to a Uint8Array if it is not already.
    * It then encodes the bytes to a base64 string and replaces characters according
    * to the base64url encoding scheme:
    * - Replaces '+' with '-'
    * - Replaces '/' with '_'
    * - Removes trailing '=' characters
    *
    * @param input - The string to be encoded.
    * @returns The base64url encoded string.
    */
   static base64urlEncode(input: string): string {
      // Convert input to a Uint8Array if it's not already
      const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input

      // Convert bytes to base64
      let base64 = btoa(String.fromCharCode(...bytes))

      // Replace characters according to base64url encoding
      return base64
         .replace(/\+/g, "-") // Replace + with -
         .replace(/\//g, "_") // Replace / with _
         .replace(/=+$/, "") // Remove trailing '='
   }

   /**
    * Converts an ArrayBuffer to a string using UTF-8 encoding.
    *
    * @param buffer - The ArrayBuffer to convert.
    * @returns The decoded string.
    */
   static arrayBufferToString(buffer: ArrayBuffer): string {
      return new TextDecoder("utf-8").decode(buffer)
   }

   /**
    * Converts a string to title case, capitalizing the first letter of each word.
    *
    * @param str - The input string to convert.
    * @returns A new string in title case.
    */
   static toTitleCase(str: string): string {
      return str.replace(/\w\S*/g, (txt) => {
         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
   }

   /**
    * Reverses the input string.
    *
    * @param str - The string to reverse.
    * @returns The reversed string.
    */
   static reverseString(str: string): string {
      return str.split("").reverse().join("")
   }

   /**
    * Truncates the input string to a specified length, adding ellipsis if truncated.
    *
    * @param str - The string to truncate.
    * @param num - The maximum number of characters to keep.
    * @returns The truncated string with "..." appended if it exceeds the specified length.
    */
   static truncateString(str: string, num: number): string {
      if (str.length <= num) {
         return str
      }
      return str.slice(0, num) + "..."
   }

   /**
    * Removes all whitespace characters from the input string.
    *
    * @param str - The string to remove whitespace from.
    * @returns A new string with all whitespace removed.
    */
   static removeWhitespace(str: string): string {
      return str.replace(/\s+/g, "")
   }

   /**
    * Capitalizes only the first letter of the input string.
    *
    * @param str - The string to capitalize.
    * @returns A new string with the first letter capitalized.
    */
   static capitalizeFirstLetter(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1)
   }
}
