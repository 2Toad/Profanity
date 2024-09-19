import { expect } from "chai";
import { profanity, Profanity } from "../src";

describe("Languages", () => {
  describe("Multi-language support", () => {
    it("should detect and censor profanity in specified languages", () => {
      expect(profanity.exists("I like big butts and I cannot lie", ["en"])).to.be.true;
      expect(profanity.exists("Ich bin ein arschloch", ["de"])).to.be.true;
      expect(profanity.exists("I like big butts and ich bin ein arschloch", ["en", "de"])).to.be.true;

      expect(profanity.censor("I like big butts and I cannot lie", undefined, ["en"])).to.equal(
        `I like big ${profanity.options.grawlix} and I cannot lie`,
      );
      expect(profanity.censor("Ich bin ein arschloch", undefined, ["de"])).to.equal(`Ich bin ein ${profanity.options.grawlix}`);
      expect(profanity.censor("I like big butts and ich bin ein arschloch", undefined, ["en", "de"])).to.equal(
        `I like big ${profanity.options.grawlix} and ich bin ein ${profanity.options.grawlix}`,
      );
    });

    it("should detect and censor profanity in a sentence with multiple languages", () => {
      expect(profanity.exists("I like big butts and ich bin ein arschloch", ["en", "de"])).to.be.true;
      expect(profanity.exists("Je suis un arschloch and I like big butts", ["en", "de"])).to.be.true;

      expect(profanity.censor("I like big butts and ich bin ein arschloch", undefined, ["en", "de"])).to.equal(
        `I like big ${profanity.options.grawlix} and ich bin ein ${profanity.options.grawlix}`,
      );
      expect(profanity.censor("Je suis un arschloch and I like big butts", undefined, ["en", "de"])).to.equal(
        `Je suis un ${profanity.options.grawlix} and I like big ${profanity.options.grawlix}`,
      );
    });

    it("should throw an error when an invalid language is specified", () => {
      expect(() => profanity.exists("I like big butts and I cannot lie", ["en", "invalid"])).to.throw('Invalid language: "invalid"');
      expect(() => profanity.censor("I like big butts and I cannot lie", undefined, ["en", "invalid"])).to.throw('Invalid language: "invalid"');
    });

    it("should handle language codes case-insensitively", () => {
      expect(profanity.exists("I like big butts", ["EN"])).to.be.true;
      expect(profanity.exists("ich bin ein arschloch", ["De"])).to.be.true;

      expect(profanity.censor("I like big butts", undefined, ["EN"])).to.equal(`I like big ${profanity.options.grawlix}`);
      expect(profanity.censor("ich bin ein arschloch", undefined, ["De"])).to.equal(`ich bin ein ${profanity.options.grawlix}`);
    });
  });

  describe("Language options", () => {
    it("should use languages specified in options when an empty language array is provided", () => {
      const customProfanity = new Profanity({ languages: ["de"] });
      expect(customProfanity.exists("I like big butts", [])).to.be.false;
      expect(customProfanity.exists("ich bin ein arschloch", [])).to.be.true;

      expect(customProfanity.censor("I like big butts", undefined, [])).to.equal("I like big butts");
      expect(customProfanity.censor("ich bin ein arschloch", undefined, [])).to.equal(`ich bin ein ${customProfanity.options.grawlix}`);
    });

    it("should use default language (en) when no languages are specified in options or method call", () => {
      const customProfanity = new Profanity();
      expect(customProfanity.exists("I like big butts")).to.be.true;
      expect(customProfanity.exists("ich bin ein arschloch")).to.be.false;

      expect(customProfanity.censor("I like big butts")).to.equal(`I like big ${customProfanity.options.grawlix}`);
      expect(customProfanity.censor("ich bin ein arschloch")).to.equal("ich bin ein arschloch");
    });

    it("should use provided languages even if options.languages is set", () => {
      const customProfanity = new Profanity({ languages: ["de"] });
      expect(customProfanity.exists("I like big butts", ["en"])).to.be.true;
      expect(customProfanity.exists("ich bin ein arschloch", ["en"])).to.be.false;

      expect(customProfanity.censor("I like big butts", undefined, ["en"])).to.equal(`I like big ${customProfanity.options.grawlix}`);
      expect(customProfanity.censor("ich bin ein arschloch", undefined, ["en"])).to.equal("ich bin ein arschloch");
    });
  });

  describe("Word list management across languages", () => {
    it("should detect and censor added words across all languages", () => {
      const customProfanity = new Profanity();
      customProfanity.addWords(["testword"]);
      expect(customProfanity.exists("this is a testword", ["en"])).to.be.true;
      expect(customProfanity.exists("this is a testword", ["de"])).to.be.true;

      expect(customProfanity.censor("this is a testword", undefined, ["en"])).to.equal(`this is a ${customProfanity.options.grawlix}`);
      expect(customProfanity.censor("this is a testword", undefined, ["de"])).to.equal(`this is a ${customProfanity.options.grawlix}`);
    });

    it("should not detect or censor removed words across all languages", () => {
      const customProfanity = new Profanity();
      customProfanity.removeWords(["butts", "arschloch"]);
      expect(customProfanity.exists("I like big butts", ["en"])).to.be.false;
      expect(customProfanity.exists("ich bin ein arschloch", ["de"])).to.be.false;

      expect(customProfanity.censor("I like big butts", undefined, ["en"])).to.equal("I like big butts");
      expect(customProfanity.censor("ich bin ein arschloch", undefined, ["de"])).to.equal("ich bin ein arschloch");
    });
  });
});
