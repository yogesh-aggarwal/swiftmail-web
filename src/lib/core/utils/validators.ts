export class Validators {
   static email(value: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
   }

   static phoneNumber(value: string): boolean {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/
      return phoneRegex.test(value)
   }

   static url(value: string): boolean {
      const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
      return urlRegex.test(value)
   }

   static postalCode(value: string): boolean {
      const postalCodeRegex = /^[A-Za-z0-9]{3,10}$/
      return postalCodeRegex.test(value)
   }

   static alphanumeric(value: string): boolean {
      const alphanumericRegex = /^[a-z0-9]+$/i
      return alphanumericRegex.test(value)
   }
}
