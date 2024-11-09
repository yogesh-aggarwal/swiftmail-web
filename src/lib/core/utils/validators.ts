import { z } from "zod"

/**
 * `Validators` class provides static methods for validating various input formats.
 * Includes email, phone number, URL, postal code, and alphanumeric checks.
 */
export class Validators {
   /**
    * Validates if a given string is a properly formatted email address.
    *
    * @param value - The string to validate as an email.
    * @returns `true` if the string is a valid email address, `false` otherwise.
    */
   static email(value: string): boolean {
      return z.string().email().safeParse(value).success
   }

   /**
    * Validates if a given string is a valid international phone number.
    * Follows a pattern of 7-15 digits, optionally prefixed with a "+".
    *
    * @param value - The string to validate as a phone number.
    * @returns `true` if the string is a valid phone number, `false` otherwise.
    */
   static phoneNumber(value: string): boolean {
      const phoneRegex = /^\+?[1-9]\d{7,14}$/
      return phoneRegex.test(value)
   }

   /**
    * Validates if a given string is a well-formed URL with "http" or "https" protocol.
    * Ensures valid structure without spaces, trailing slashes, or consecutive dots.
    *
    * @param value - The string to validate as a URL.
    * @returns `true` if the string is a valid URL, `false` otherwise.
    */
   static url(value: string): boolean {
      try {
         const url = new URL(value)
         return (
            /^(http|https):$/.test(url.protocol) &&
            /^[^\s/$.?#].[^\s]+\.[^\s]+$/.test(url.hostname) &&
            !/^(http|https):\/[^/]/.test(value) &&
            !/\.\..*/.test(url.hostname) &&
            !/\s/.test(value) &&
            !/\/$/.test(value)
         )
      } catch (_) {
         return false
      }
   }

   /**
    * Validates if a given string matches a postal code format (3-10 alphanumeric characters).
    *
    * @param value - The string to validate as a postal code.
    * @returns `true` if the string is a valid postal code, `false` otherwise.
    */
   static postalCode(value: string): boolean {
      const postalCodeRegex = /^[A-Za-z0-9]{3,10}$/
      return postalCodeRegex.test(value)
   }

   /**
    * Validates if a given string is alphanumeric (only letters and numbers).
    *
    * @param value - The string to validate as alphanumeric.
    * @returns `true` if the string is alphanumeric, `false` otherwise.
    */
   static alphanumeric(value: string): boolean {
      const alphanumericRegex = /^[a-z0-9]+$/i
      return alphanumericRegex.test(value)
   }
}
