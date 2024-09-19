import { expect } from "chai";

import { profanity, Profanity } from "../src";

describe("exists", () => {
  describe("wholeWord = true", () => {
    it("should return true when profanity exists in a sentence", () => {
      expect(profanity.exists("I like big butts and I cannot lie")).to.be.true;
    });

    it("should return false when profanity is not a whole word in a sentence", () => {
      expect(profanity.exists("Should we censor the word arsenic?")).to.be.false;
    });

    it("should return true when profanity exists within multiple lines", () => {
      expect(
        profanity.exists(`
          Nothing profane on line 1.
          Censoring butt on line 2.
          Nothing profane on line 3.
        `),
      ).to.be.true;
    });

    it("should return false when profanity does not exist", () => {
      expect(profanity.exists("I like big glutes and I cannot lie")).to.be.false;
    });

    it("should return true when profanity is surrounded by punctuation", () => {
      expect(profanity.exists("What the (butt)!")).to.be.true;
    });

    it("should return false when profanity is part of a larger word", () => {
      expect(profanity.exists("I'm feeling passionate today")).to.be.false;
    });

    it("should return true when profanity is at the beginning of a sentence", () => {
      expect(profanity.exists("Butt is a profane word")).to.be.true;
    });
    it("should return true when profanity is at the end of a sentence", () => {
      expect(profanity.exists("Don't be a butt.")).to.be.true;
    });

    it("should return false for words that are substrings of profane words", () => {
      expect(profanity.exists("I need to assess the situation")).to.be.false;
    });

    it("should return true when profanity is separated by hyphens", () => {
      expect(profanity.exists("Don't be a butt-head")).to.be.true;
      expect(profanity.exists("Don't be a head-butt")).to.be.true;
    });

    it("should return true when profanity is separated by underscores", () => {
      expect(profanity.exists("Don't be a butt_face")).to.be.true;
      expect(profanity.exists("Don't be a face_butt")).to.be.true;
    });

    it("should return false when profanity is part of a word separated by a hyphen", () => {
      expect(profanity.exists("Don't be an arsenic-head")).to.be.false;
      expect(profanity.exists("Don't be a head-arsenic")).to.be.false;
    });

    it("should return false when profanity is part of a word separated by an underscore", () => {
      expect(profanity.exists("Don't be an arsenic_head")).to.be.false;
      expect(profanity.exists("Don't be a head_arsenic")).to.be.false;
    });
    it("should return false when profanity is part of a URL", () => {
      expect(profanity.exists("Visit https://www.example.com/assets/image.jpg")).to.be.false;
    });

    it("should return true when profanity is surrounded by emoji", () => {
      expect(profanity.exists("That's 💩butt💩")).to.be.true;
    });
  });

  describe("wholeWord = false", () => {
    let customProfanity: Profanity;

    before(() => {
      customProfanity = new Profanity({ wholeWord: false });
    });

    it("should return true when profanity is part of a word in a sentence", () => {
      expect(customProfanity.exists("Should we censor the word arsenic?")).to.be.true;
    });

    it("should return false when profanity does not exist", () => {
      expect(customProfanity.exists("I like big glutes and I cannot lie")).to.be.false;
    });

    it("Should return false when the last character is an 'A' with no profanity (A$$ edge case)", () => {
      expect(customProfanity.exists("FUNTIMESA")).to.be.false;
    });

    it("Should return true when the last character is an 'A' and there is profanity (A$$ edge case)", () => {
      expect(customProfanity.exists("BUTTSA")).to.be.true;
    });

    it("Should return true when some regex characters are present as profanity", () => {
      expect(customProfanity.exists("lovea$$")).to.be.true;
    });

    it("should return true when profanity is at the beginning of a word", () => {
      expect(customProfanity.exists("buttress the wall")).to.be.true;
    });

    it("should return true when profanity is at the end of a word", () => {
      expect(customProfanity.exists("kickbutt performance")).to.be.true;
    });
    it("should return true when profanity is in the middle of a word", () => {
      expect(customProfanity.exists("Massachusetts")).to.be.true;
    });

    it("should return true for words that are substrings of profane words", () => {
      expect(customProfanity.exists("I need to assess the situation")).to.be.true;
    });

    it("should return true when profanity is part of a URL", () => {
      expect(customProfanity.exists("Visit https://www.example.com/assets/image.jpg")).to.be.true;
    });

    it("should return true when profanity is separated by hyphens", () => {
      expect(customProfanity.exists("Don't be a butt-head")).to.be.true;
      expect(customProfanity.exists("Don't be a head-butt")).to.be.true;
      expect(customProfanity.exists("Don't be an arsenic-head")).to.be.true;
      expect(customProfanity.exists("Don't be a head-arsenic")).to.be.true;
    });

    it("should return true when profanity is separated by underscores", () => {
      expect(customProfanity.exists("Don't be a butt_head")).to.be.true;
      expect(customProfanity.exists("Don't be a head_butt")).to.be.true;
      expect(customProfanity.exists("Don't be an arsenic_head")).to.be.true;
      expect(customProfanity.exists("Don't be a head_arsenic")).to.be.true;
    });
    it("should return true when profanity is surrounded by emoji", () => {
      expect(customProfanity.exists("That's 💩butt💩")).to.be.true;
    });
  });

  describe("Case sensitivity", () => {
    it("should detect mixed case profanity", () => {
      expect(profanity.exists("Don't be a BuTt")).to.be.true;
    });

    it("should detect all uppercase profanity", () => {
      expect(profanity.exists("DON'T BE A BUTT")).to.be.true;
    });

    it("should detect all lowercase profanity", () => {
      expect(profanity.exists("don't be a butt")).to.be.true;
    });

    it("should detect profanity with alternating case", () => {
      expect(profanity.exists("dOn'T bE a BuTt")).to.be.true;
    });

    it("should detect profanity with random casing", () => {
      expect(profanity.exists("DoN't Be A bUtT")).to.be.true;
    });
  });

  describe("Multi-word profanities", () => {
    it("should detect multi-word profanities", () => {
      expect(profanity.exists("He's a fudge packer")).to.be.true;
      expect(profanity.exists("That's a blow job")).to.be.true;
      expect(profanity.exists("Don't be a son-of-a-bitch")).to.be.true;
    });

    it("should not detect partial matches of multi-word profanities", () => {
      expect(profanity.exists("I like to pack fudge for desserts")).to.be.false;
      expect(profanity.exists("The wind blew jobs away")).to.be.false;
      expect(profanity.exists("He's the son of a businessman")).to.be.false;
    });
  });

  describe("Input type handling", () => {
    it("should return false for non-string input", () => {
      expect(profanity.exists(null as any)).to.be.false;
      expect(profanity.exists(undefined as any)).to.be.false;
      expect(profanity.exists(123 as any)).to.be.false;
      expect(profanity.exists(true as any)).to.be.false;
      expect(profanity.exists({} as any)).to.be.false;
      expect(profanity.exists([] as any)).to.be.false;
    });
  });

  describe("Language specified", () => {
    it("should return true when profanity exists in a sentence and a language is specified", () => {
      expect(profanity.exists("I like big butts and I cannot lie", ["en"])).to.be.true;
    });

    it("should return false when profanity is not a whole word in a sentence and a language is specified", () => {
      expect(profanity.exists("Should we censor the word arsenic?", ["en"])).to.be.false;
    });
  });

  describe("Language specified (multiple)", () => {
    it("should return true when profanity exists in a sentence and a language is specified", () => {
      expect(profanity.exists("I like big butts and I cannot lie", ["en", "de"])).to.be.true;
    });

    it("should return false when profanity is not a whole word in a sentence and a language is specified", () => {
      expect(profanity.exists("Should we censor the word arsenic?", ["en", "de"])).to.be.false;
    });
  });

  describe("Should throw an error when an invalid language is specified", () => {
    it("should throw an error when an invalid language is specified", () => {
      expect(() => profanity.exists("I like big butts and I cannot lie", ["en", "invalid"])).to.throw('Invalid language: "invalid"');
    });
  });
});
