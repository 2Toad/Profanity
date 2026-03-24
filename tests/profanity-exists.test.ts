import { describe, it, expect, beforeAll } from "vitest";

import { profanity, Profanity } from "../src";

describe("exists", () => {
  describe("wholeWord = true", () => {
    it("should return true when profanity exists in a sentence", () => {
      expect(profanity.exists("I like big butts and I cannot lie")).toBe(true);
    });

    it("should return false when profanity is not a whole word in a sentence", () => {
      expect(profanity.exists("Should we censor the word arsenic?")).toBe(false);
    });

    it("should return true when profanity exists within multiple lines", () => {
      expect(
        profanity.exists(`
          Nothing profane on line 1.
          Censoring butt on line 2.
          Nothing profane on line 3.
        `),
      ).toBe(true);
    });

    it("should return false when profanity does not exist", () => {
      expect(profanity.exists("I like big glutes and I cannot lie")).toBe(false);
    });

    it("should return true when profanity is surrounded by punctuation", () => {
      expect(profanity.exists("What the (butt)!")).toBe(true);
    });

    it("should return false when profanity is part of a larger word", () => {
      expect(profanity.exists("I'm feeling passionate today")).toBe(false);
    });

    it("should return true when profanity is at the beginning of a sentence", () => {
      expect(profanity.exists("Butt is a profane word")).toBe(true);
    });
    it("should return true when profanity is at the end of a sentence", () => {
      expect(profanity.exists("Don't be a butt.")).toBe(true);
    });

    it("should return false for words that are substrings of profane words", () => {
      expect(profanity.exists("I need to assess the situation")).toBe(false);
    });

    it("should return true when profanity is separated by hyphens", () => {
      expect(profanity.exists("Don't be a butt-head")).toBe(true);
      expect(profanity.exists("Don't be a head-butt")).toBe(true);
    });

    it("should return true when profanity is separated by underscores", () => {
      expect(profanity.exists("Don't be a butt_face")).toBe(true);
      expect(profanity.exists("Don't be a face_butt")).toBe(true);
    });

    it("should return false when profanity is part of a word separated by a hyphen", () => {
      expect(profanity.exists("Don't be an arsenic-head")).toBe(false);
      expect(profanity.exists("Don't be a head-arsenic")).toBe(false);
    });

    it("should return false when profanity is part of a word separated by an underscore", () => {
      expect(profanity.exists("Don't be an arsenic_head")).toBe(false);
      expect(profanity.exists("Don't be a head_arsenic")).toBe(false);
    });
    it("should return false when profanity is part of a URL", () => {
      expect(profanity.exists("Visit https://www.example.com/assets/image.jpg")).toBe(false);
    });

    it("should return true when profanity is surrounded by emoji", () => {
      expect(profanity.exists("That's 💩butt💩")).toBe(true);
    });
  });

  describe("wholeWord = false", () => {
    let customProfanity: Profanity;

    beforeAll(() => {
      customProfanity = new Profanity({ wholeWord: false });
    });

    it("should return true when profanity is part of a word in a sentence", () => {
      expect(customProfanity.exists("Should we censor the word arsenic?")).toBe(true);
    });

    it("should return false when profanity does not exist", () => {
      expect(customProfanity.exists("I like big glutes and I cannot lie")).toBe(false);
    });

    it("Should return false when the last character is an 'A' with no profanity (A$$ edge case)", () => {
      expect(customProfanity.exists("FUNTIMESA")).toBe(false);
    });

    it("Should return true when the last character is an 'A' and there is profanity (A$$ edge case)", () => {
      expect(customProfanity.exists("BUTTSA")).toBe(true);
    });

    it("Should return true when some regex characters are present as profanity", () => {
      expect(customProfanity.exists("lovea$$")).toBe(true);
    });

    it("should return true when profanity is at the beginning of a word", () => {
      expect(customProfanity.exists("buttress the wall")).toBe(true);
    });

    it("should return true when profanity is at the end of a word", () => {
      expect(customProfanity.exists("kickbutt performance")).toBe(true);
    });
    it("should return true when profanity is in the middle of a word", () => {
      expect(customProfanity.exists("Massachusetts")).toBe(true);
    });

    it("should return true for words that are substrings of profane words", () => {
      expect(customProfanity.exists("I need to assess the situation")).toBe(true);
    });

    it("should return true when profanity is part of a URL", () => {
      expect(customProfanity.exists("Visit https://www.example.com/assets/image.jpg")).toBe(true);
    });

    it("should return true when profanity is separated by hyphens", () => {
      expect(customProfanity.exists("Don't be a butt-head")).toBe(true);
      expect(customProfanity.exists("Don't be a head-butt")).toBe(true);
      expect(customProfanity.exists("Don't be an arsenic-head")).toBe(true);
      expect(customProfanity.exists("Don't be a head-arsenic")).toBe(true);
    });

    it("should return true when profanity is separated by underscores", () => {
      expect(customProfanity.exists("Don't be a butt_head")).toBe(true);
      expect(customProfanity.exists("Don't be a head_butt")).toBe(true);
      expect(customProfanity.exists("Don't be an arsenic_head")).toBe(true);
      expect(customProfanity.exists("Don't be a head_arsenic")).toBe(true);
    });
    it("should return true when profanity is surrounded by emoji", () => {
      expect(customProfanity.exists("That's 💩butt💩")).toBe(true);
    });
  });

  describe("Case sensitivity", () => {
    it("should detect mixed case profanity", () => {
      expect(profanity.exists("Don't be a BuTt")).toBe(true);
    });

    it("should detect all uppercase profanity", () => {
      expect(profanity.exists("DON'T BE A BUTT")).toBe(true);
    });

    it("should detect all lowercase profanity", () => {
      expect(profanity.exists("don't be a butt")).toBe(true);
    });

    it("should detect profanity with alternating case", () => {
      expect(profanity.exists("dOn'T bE a BuTt")).toBe(true);
    });

    it("should detect profanity with random casing", () => {
      expect(profanity.exists("DoN't Be A bUtT")).toBe(true);
    });
  });

  describe("Multi-word profanities", () => {
    it("should detect multi-word profanities", () => {
      expect(profanity.exists("He's a fudge packer")).toBe(true);
      expect(profanity.exists("That's a blow job")).toBe(true);
      expect(profanity.exists("Don't be a son-of-a-bitch")).toBe(true);
    });

    it("should not detect partial matches of multi-word profanities", () => {
      expect(profanity.exists("I like to pack fudge for desserts")).toBe(false);
      expect(profanity.exists("The wind blew jobs away")).toBe(false);
      expect(profanity.exists("He's the son of a businessman")).toBe(false);
    });
  });

  describe("Input type handling", () => {
    it("should return false for non-string input", () => {
      expect(profanity.exists(null as any)).toBe(false);
      expect(profanity.exists(undefined as any)).toBe(false);
      expect(profanity.exists(123 as any)).toBe(false);
      expect(profanity.exists(true as any)).toBe(false);
      expect(profanity.exists({} as any)).toBe(false);
      expect(profanity.exists([] as any)).toBe(false);
    });
  });
});
