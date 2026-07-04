import { describe, it, expect } from "vitest";
import { isValidEmail, isValidPassword, passwordsMatch } from "@/lib/validation";

describe("isValidEmail", () => {
  it("accepts a normal email", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  it("accepts an email with a subdomain and plus-addressing", () => {
    expect(isValidEmail("user+tag@mail.example.co.uk")).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("rejects a string with no @", () => {
    expect(isValidEmail("userexample.com")).toBe(false);
  });

  it("rejects a string with no domain", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  it("rejects a string with no TLD", () => {
    expect(isValidEmail("user@example")).toBe(false);
  });

  it("rejects an email containing whitespace", () => {
    expect(isValidEmail("user @example.com")).toBe(false);
    expect(isValidEmail("user@ example.com")).toBe(false);
  });

  it("rejects multiple @ symbols", () => {
    expect(isValidEmail("user@@example.com")).toBe(false);
  });
});

describe("isValidPassword", () => {
  it("accepts a password of exactly 8 characters (boundary)", () => {
    expect(isValidPassword("12345678")).toBe(true);
  });

  it("accepts a long password", () => {
    expect(isValidPassword("a-very-long-and-secure-password-123")).toBe(true);
  });

  it("rejects a password of 7 characters (just under boundary)", () => {
    expect(isValidPassword("1234567")).toBe(false);
  });

  it("rejects an empty password", () => {
    expect(isValidPassword("")).toBe(false);
  });
});

describe("passwordsMatch", () => {
  it("returns true for identical passwords", () => {
    expect(passwordsMatch("password123", "password123")).toBe(true);
  });

  it("returns false for different passwords", () => {
    expect(passwordsMatch("password123", "password124")).toBe(false);
  });

  it("is case-sensitive", () => {
    expect(passwordsMatch("Password123", "password123")).toBe(false);
  });

  it("returns false when one side is empty", () => {
    expect(passwordsMatch("password123", "")).toBe(false);
  });

  it("returns true when both sides are empty (caller must check length separately)", () => {
    expect(passwordsMatch("", "")).toBe(true);
  });
});
