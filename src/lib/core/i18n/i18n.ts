import { IntlTranslations } from "./i18n.types"

export class AppIntl {
   private static defaultLocale: string = "en" // Default locale
   private static locales: Record<string, IntlTranslations> = {}

   /**
    * Set the translations for a specific locale.
    * @param locale - The locale code (e.g., 'en', 'es').
    * @param translations - An object containing translation key-value pairs.
    */
   public static setLocaleData(locale: string, translations: IntlTranslations): void {
      this.locales[locale] = translations
   }

   /**
    * Get the translation for a given key based on the current locale.
    * Fallback to default locale if the translation is not available.
    * @param key - The translation key.
    * @param locale - The locale to use, defaults to the default locale.
    * @returns The translated string.
    */
   public static translate(key: string, locale: string = this.defaultLocale): string {
      if (this.locales[locale] && this.locales[locale][key]) {
         return this.locales[locale][key]
      } else if (this.locales[this.defaultLocale] && this.locales[this.defaultLocale][key]) {
         return this.locales[this.defaultLocale][key]
      } else {
         return key // Return key itself if no translation is found
      }
   }

   /**
    * Formats a number based on the provided locale.
    * @param value - The number to format.
    * @param locale - The locale to format the number in.
    * @returns Formatted number as a string.
    */
   public static formatNumber(value: number, locale: string = this.defaultLocale): string {
      return new Intl.NumberFormat(locale).format(value)
   }

   /**
    * Formats a currency value based on the provided locale and currency code.
    * @param value - The currency value to format.
    * @param currency - The currency code (e.g., 'USD', 'EUR').
    * @param locale - The locale to format the currency in.
    * @returns Formatted currency as a string.
    */
   public static formatCurrency(
      value: number,
      currency: string,
      locale: string = this.defaultLocale
   ): string {
      return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value)
   }

   /**
    * Formats a percentage value based on the provided locale.
    * @param value - The percentage value to format (e.g., 0.25 for 25%).
    * @param locale - The locale to format the percentage in.
    * @returns Formatted percentage as a string.
    */
   public static formatPercent(value: number, locale: string = this.defaultLocale): string {
      return new Intl.NumberFormat(locale, { style: "percent" }).format(value)
   }

   /**
    * Formats a date based on the provided locale.
    * @param date - The date to format.
    * @param options - Formatting options (optional).
    * @param locale - The locale to format the date in.
    * @returns Formatted date as a string.
    */
   public static formatDate(
      date: Date,
      options: Intl.DateTimeFormatOptions = {},
      locale: string = this.defaultLocale
   ): string {
      return new Intl.DateTimeFormat(locale, options).format(date)
   }

   /**
    * Sets the default locale for the app.
    * @param locale - The locale code to set (e.g., 'en', 'es').
    */
   public static setDefaultLocale(locale: string): void {
      this.defaultLocale = locale
   }
}
