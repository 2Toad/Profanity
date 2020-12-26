import { expect } from "chai";

import { profanity, Profanity, ProfanityOptions } from ".";

describe("Profanity", () => {
  describe("exists (wholeWord = true)", () => {
    it("should return true when profanity exists in a sentence", () => {
      expect(profanity.exists("I like big butts and I cannot lie")).to.equal(true);
    });

    it("should return true when profanity exists as a single word", () => {
      expect(profanity.exists("butt")).to.equal(true);
    });

    it("should return false when profanity is not a whole word in a sentence", () => {
      expect(profanity.exists("Should we censor the word arsenic?")).to.equal(false);
    });

    it("should return true when profanity exists within multiple lines", () => {
      expect(
        profanity.exists(`
        Nothing profane on line 1.
        Censoring butt on line 2.
        Nothing profane on line 3.
      `)
      ).to.equal(true);
    });

    it("should return false when profanity does not exist", () => {
      expect(profanity.exists("I like big glutes and I cannot lie")).to.equal(false);
    });
  });

  describe("exists (wholeWord = false)", () => {
    const options = new ProfanityOptions();
    options.wholeWord = false;
    const customProfanity = new Profanity(options);

    it("should return true when profanity is part of a word in a sentence", () => {
      expect(customProfanity.exists("Should we censor the word arsenic?")).to.equal(true);
    });

    it("should return true when profanity is part of a word, within multiple lines", () => {
      expect(
        customProfanity.exists(`
        Nothing profane on line 1.
        Censoring arsenic on line 2.
        Nothing profane on line 3.
      `)
      ).to.equal(true);
    });

    it("should return false when profanity does not exist", () => {
      expect(customProfanity.exists("I like big glutes and I cannot lie")).to.equal(false);
    });

    it("should return true when profanity exists as part of a single word", () => {
      expect(customProfanity.exists("arsenic")).to.equal(true);
    });
  });

  describe("censor", () => {
    it("should replace profanity with grawlix in a sentence", () => {
      const censored = profanity.censor("I like big butts and I cannot lie");
      expect(censored.includes(profanity.options.grawlix)).to.equal(true);
    });

    it("should remove profanity from a sentence", () => {
      const censored = profanity.censor("I like big butts (aka arses) and I cannot lie");
      expect(profanity.exists(censored)).to.equal(false);
    });

    it("should remove profanity from multiple lines", () => {
      const censored = profanity.censor(`
        Nothing profane on line 1.
        Censoring butt on line 2.
        Nothing profane on line 3.
      `);
      expect(profanity.exists(censored)).to.equal(false);
    });

    it("should not alter sentence without profanity", () => {
      const original = "I like big glutes and I cannot lie";
      const censored = profanity.censor(original);
      expect(censored).to.equal(original);
    });

    it("should remove profanity when profanity exists as a single word", () => {
      const censored = profanity.censor("butt");
      expect(profanity.exists(censored)).to.equal(false);
    });
  });

  describe("addWords", () => {
    it("should add a single word to the list of profane words", () => {
      const customProfanity = new Profanity();
      customProfanity.addWords(["aardvark"]);
      expect(customProfanity.exists("Should we censor the word aardvark?")).to.equal(true);
    });

    it("should add mulitple words to the list of profane words", () => {
      const customProfanity = new Profanity();
      customProfanity.addWords(["aardvark", "zebra"]);
      expect(customProfanity.exists("Should we censor the word aardvark and zebra?")).to.equal(true);
    });
  });

  describe("removeWords", () => {
    it("should remove a single word from the list of profane words", () => {
      const customProfanity = new Profanity();
      customProfanity.removeWords(["butts"]);
      expect(customProfanity.exists("I like big butts and I cannot lie")).to.equal(false);
    });

    it("should remove mulitple words from the list of profane words", () => {
      const customProfanity = new Profanity();
      customProfanity.removeWords(["butts", "arses"]);
      expect(customProfanity.exists("I like big butts (aka arses) and I cannot lie")).to.equal(false);
    });
  });

  describe("Whitelist (wholeWord = true)", () => {
    it("should whitelist a single word", () => {
      const customProfanity = new Profanity();
      customProfanity.whitelist.addWords(["butt"]);
      expect(customProfanity.exists("Should we censor the word butt?")).to.equal(false);
    });

    it("should whitelist multiple words", () => {
      const customProfanity = new Profanity();
      customProfanity.whitelist.addWords(["butt", "arse"]);
      expect(customProfanity.exists("Should we censor the word butt or arse?")).to.equal(false);
    });
  });

  describe("Whitelist (wholeWord = false)", () => {
    const options = new ProfanityOptions();
    options.wholeWord = false;

    it("should whitelist a single word", () => {
      const customProfanity = new Profanity(options);
      customProfanity.whitelist.addWords(["buttocks"]);
      expect(customProfanity.exists("Should we censor the word buttocks?")).to.equal(false);
    });

    it("should whitelist multiple words", () => {
      const customProfanity = new Profanity(options);
      customProfanity.whitelist.addWords(["buttocks", "arsenic"]);
      expect(customProfanity.exists("Should we censor the word buttocks or arsenic?")).to.equal(false);
    });
  });

  describe("Whitelist - removeWords", () => {
    it("should remove a single word from the whitelist", () => {
      const customProfanity = new Profanity();
      customProfanity.whitelist.addWords(["butts", "arses"]);
      expect(customProfanity.exists("I like big butts and I cannot lie")).to.equal(false);

      customProfanity.whitelist.removeWords(["butts"]);
      expect(customProfanity.exists("I like big butts and I cannot lie")).to.equal(true);
    });

    it("should remove multiple words from the whitelist", () => {
      const customProfanity = new Profanity();
      customProfanity.whitelist.addWords(["butts", "arses"]);
      expect(customProfanity.exists("I like big butts (aka arses) and I cannot lie")).to.equal(false);

      customProfanity.whitelist.removeWords(["butts"]);
      expect(customProfanity.exists("I like big butts (aka arses) and I cannot lie")).to.equal(true);
    });
  });
});
