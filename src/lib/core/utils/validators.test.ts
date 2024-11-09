import { describe, expect, it } from "vitest"

import { Validators } from "./validators"

describe("Validators", () => {
   describe("email", () => {
      it("should validate correct email addresses", () => {
         expect(Validators.email("test@example.com")).toBe(true)
         expect(Validators.email("user.name+tag+sorting@example.com")).toBe(true)
         expect(Validators.email("user.name@example.co.uk")).toBe(true)
      })

      it("should invalidate incorrect email addresses", () => {
         expect(Validators.email("plainaddress")).toBe(false)
         expect(Validators.email("@missingusername.com")).toBe(false)
         expect(Validators.email("username@.com")).toBe(false)
         expect(Validators.email("username@com")).toBe(false)
         expect(Validators.email("username@.com.")).toBe(false)
         expect(Validators.email("username@-example.com")).toBe(false)
         expect(Validators.email("username@example..com")).toBe(false)
      })
   })

   describe("phoneNumber", () => {
      it("should validate correct phone numbers", () => {
         expect(Validators.phoneNumber("+1234567890")).toBe(true)
         expect(Validators.phoneNumber("1234567890")).toBe(true)
         expect(Validators.phoneNumber("+19876543210")).toBe(true)
      })

      it("should invalidate incorrect phone numbers", () => {
         expect(Validators.phoneNumber("")).toBe(false)
         expect(Validators.phoneNumber("123")).toBe(false)
         expect(Validators.phoneNumber("phone123")).toBe(false)
         expect(Validators.phoneNumber("+123-456-7890")).toBe(false)
         expect(Validators.phoneNumber("123 456 7890")).toBe(false)
         expect(Validators.phoneNumber("+1234567890123456")).toBe(false)
      })
   })

   describe("url", () => {
      it("should validate correct URLs", () => {
         expect(Validators.url("http://example.com")).toBe(true)
         expect(Validators.url("https://example.com")).toBe(true)
         expect(Validators.url("http://www.example.com")).toBe(true)
         expect(Validators.url("https://sub.example.com")).toBe(true)
      })

      it("should invalidate incorrect URLs", () => {
         expect(Validators.url("")).toBe(false)
         expect(Validators.url("example")).toBe(false)
         expect(Validators.url("http:/example.com")).toBe(false)
         expect(Validators.url("ftp://example.com")).toBe(false)
         expect(Validators.url("http://example")).toBe(false)
         expect(Validators.url("http://example.")).toBe(false)
         expect(Validators.url("http://.com")).toBe(false)
         expect(Validators.url("http://example..com")).toBe(false)
      })
   })

   describe("postalCode", () => {
      it("should validate correct postal codes", () => {
         expect(Validators.postalCode("12345")).toBe(true)
         expect(Validators.postalCode("ABCDE")).toBe(true)
         expect(Validators.postalCode("A1B2C3")).toBe(true)
         expect(Validators.postalCode("1234567890")).toBe(true)
      })

      it("should invalidate incorrect postal codes", () => {
         expect(Validators.postalCode("")).toBe(false)
         expect(Validators.postalCode("12")).toBe(false)
         expect(Validators.postalCode("12345678901")).toBe(false)
         expect(Validators.postalCode("123 456")).toBe(false)
         expect(Validators.postalCode("123-456")).toBe(false)
         expect(Validators.postalCode("ABC DEF")).toBe(false)
      })
   })

   describe("alphanumeric", () => {
      it("should validate correct alphanumeric strings", () => {
         expect(Validators.alphanumeric("abc123")).toBe(true)
         expect(Validators.alphanumeric("ABC123")).toBe(true)
         expect(Validators.alphanumeric("123")).toBe(true)
         expect(Validators.alphanumeric("abc")).toBe(true)
      })

      it("should invalidate incorrect alphanumeric strings", () => {
         expect(Validators.alphanumeric("")).toBe(false)
         expect(Validators.alphanumeric("abc 123")).toBe(false)
         expect(Validators.alphanumeric("abc-123")).toBe(false)
         expect(Validators.alphanumeric("abc_123")).toBe(false)
         expect(Validators.alphanumeric("abc!123")).toBe(false)
      })
   })
})
