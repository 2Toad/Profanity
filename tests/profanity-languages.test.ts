import { describe, it, expect } from "vitest";
import { profanity, Profanity } from "../src";

describe("Languages", () => {
  describe("Multi-language support", () => {
    it("should detect and censor profanity in specified languages", () => {
      expect(profanity.exists("I like big butts and I cannot lie", ["en"])).toBe(true);
      expect(profanity.exists("Ich bin ein arschloch", ["de"])).toBe(true);
      expect(profanity.exists("I like big butts and ich bin ein arschloch", ["en", "de"])).toBe(true);

      expect(profanity.censor("I like big butts and I cannot lie", undefined, ["en"])).toBe(
        `I like big ${profanity.options.grawlix} and I cannot lie`,
      );
      expect(profanity.censor("Ich bin ein arschloch", undefined, ["de"])).toBe(`Ich bin ein ${profanity.options.grawlix}`);
      expect(profanity.censor("I like big butts and ich bin ein arschloch", undefined, ["en", "de"])).toBe(
        `I like big ${profanity.options.grawlix} and ich bin ein ${profanity.options.grawlix}`,
      );
    });

    it("should detect and censor profanity in a sentence with multiple languages", () => {
      expect(profanity.exists("I like big butts and ich bin ein arschloch", ["en", "de"])).toBe(true);
      expect(profanity.exists("Je suis un arschloch and I like big butts", ["en", "de"])).toBe(true);

      expect(profanity.censor("I like big butts and ich bin ein arschloch", undefined, ["en", "de"])).toBe(
        `I like big ${profanity.options.grawlix} and ich bin ein ${profanity.options.grawlix}`,
      );
      expect(profanity.censor("Je suis un arschloch and I like big butts", undefined, ["en", "de"])).toBe(
        `Je suis un ${profanity.options.grawlix} and I like big ${profanity.options.grawlix}`,
      );
    });

    it("should throw an error when an invalid language is specified", () => {
      expect(() => profanity.exists("I like big butts and I cannot lie", ["en", "invalid"])).toThrow('Invalid language: "invalid"');
      expect(() => profanity.censor("I like big butts and I cannot lie", undefined, ["en", "invalid"])).toThrow('Invalid language: "invalid"');
    });

    it("should handle language codes case-insensitively", () => {
      expect(profanity.exists("I like big butts", ["EN"])).toBe(true);
      expect(profanity.exists("ich bin ein arschloch", ["De"])).toBe(true);

      expect(profanity.censor("I like big butts", undefined, ["EN"])).toBe(`I like big ${profanity.options.grawlix}`);
      expect(profanity.censor("ich bin ein arschloch", undefined, ["De"])).toBe(`ich bin ein ${profanity.options.grawlix}`);
    });
  });

  describe("Language options", () => {
    it("should use languages specified in options when an empty language array is provided", () => {
      const customProfanity = new Profanity({ languages: ["de"] });
      expect(customProfanity.exists("I like big butts", [])).toBe(false);
      expect(customProfanity.exists("ich bin ein arschloch", [])).toBe(true);

      expect(customProfanity.censor("I like big butts", undefined, [])).toBe("I like big butts");
      expect(customProfanity.censor("ich bin ein arschloch", undefined, [])).toBe(`ich bin ein ${customProfanity.options.grawlix}`);
    });

    it("should use default language (en) when no languages are specified in options or method call", () => {
      const customProfanity = new Profanity();
      expect(customProfanity.exists("I like big butts")).toBe(true);
      expect(customProfanity.exists("ich bin ein arschloch")).toBe(false);

      expect(customProfanity.censor("I like big butts")).toBe(`I like big ${customProfanity.options.grawlix}`);
      expect(customProfanity.censor("ich bin ein arschloch")).toBe("ich bin ein arschloch");
    });

    it("should use provided languages even if options.languages is set", () => {
      const customProfanity = new Profanity({ languages: ["de"] });
      expect(customProfanity.exists("I like big butts", ["en"])).toBe(true);
      expect(customProfanity.exists("ich bin ein arschloch", ["en"])).toBe(false);

      expect(customProfanity.censor("I like big butts", undefined, ["en"])).toBe(`I like big ${customProfanity.options.grawlix}`);
      expect(customProfanity.censor("ich bin ein arschloch", undefined, ["en"])).toBe("ich bin ein arschloch");
    });
  });

  describe("Word list management across languages", () => {
    it("should detect and censor added words across all languages", () => {
      const customProfanity = new Profanity();
      customProfanity.addWords(["testword"]);
      expect(customProfanity.exists("this is a testword", ["en"])).toBe(true);
      expect(customProfanity.exists("this is a testword", ["de"])).toBe(true);

      expect(customProfanity.censor("this is a testword", undefined, ["en"])).toBe(`this is a ${customProfanity.options.grawlix}`);
      expect(customProfanity.censor("this is a testword", undefined, ["de"])).toBe(`this is a ${customProfanity.options.grawlix}`);
    });

    it("should not detect or censor removed words across all languages", () => {
      const customProfanity = new Profanity();
      customProfanity.removeWords(["butts", "arschloch"]);
      expect(customProfanity.exists("I like big butts", ["en"])).toBe(false);
      expect(customProfanity.exists("ich bin ein arschloch", ["de"])).toBe(false);

      expect(customProfanity.censor("I like big butts", undefined, ["en"])).toBe("I like big butts");
      expect(customProfanity.censor("ich bin ein arschloch", undefined, ["de"])).toBe("ich bin ein arschloch");
    });
  });
});
