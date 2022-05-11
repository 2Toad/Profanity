import { expect } from "chai";

import { profanity, Profanity, ProfanityOptions } from ".";
import { CensorType } from "./models";

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

    it("Should return false when the last character is an 'A' with no profanity (A$$ edge case)", () => {
      expect(customProfanity.exists("FUNTIMESA")).to.equal(false);
    });

    it("Should return true when the last character is an 'A' and there is profanity (A$$ edge case)", () => {
      expect(customProfanity.exists("BUTTSA")).to.equal(true);
    });

    it("Should return true when some regex characters are present as profanity", () => {
      expect(customProfanity.exists("lovea$$")).to.equal(true);
    });
  });

  describe("censor", () => {
    it("should replace multiple profane words within a sentence with grawlix", () => {
      const censored = profanity.censor("I like big butts (aka arses) and I cannot lie");
      expect(censored).to.equal(`I like big ${profanity.options.grawlix} (aka ${profanity.options.grawlix}) and I cannot lie`);
    });

    it("should replace a single profane word within a sentence with grawlix", () => {
      const censored = profanity.censor("I like big butts and I cannot lie");
      expect(censored).to.equal(`I like big ${profanity.options.grawlix} and I cannot lie`);
    });

    it("should replace standalone profane word with grawlix", () => {
      const censored = profanity.censor("butt");
      expect(censored).to.equal(profanity.options.grawlix);
    });

    it("should replace profane words within a multi-line sentence with grawlix", () => {
      const censored = profanity.censor(`
        Nothing profane on line 1.
        Censoring butt on line 2.
        Nothing profane on line 3.
      `);
      expect(censored).to.equal(`
        Nothing profane on line 1.
        Censoring ${profanity.options.grawlix} on line 2.
        Nothing profane on line 3.
      `);
    });

    it("sentences without profanity should not be altered", () => {
      const original = "I like big glutes and I cannot lie";
      const censored = profanity.censor(original);
      expect(censored).to.equal(original);
    });
  });

  describe("censor (CensorType = FirstChar)", () => {
    it("should replace first character of each profane word with grawlix character", () => {
      const censored = profanity.censor("I like big butts (aka arses) and I cannot lie", CensorType.FirstChar);
      expect(censored).to.equal(`I like big ${profanity.options.grawlixChar}utts (aka ${profanity.options.grawlixChar}rses) and I cannot lie`);
    });
  });

  describe("censor (CensorType = FirstVowel)", () => {
    it("should replace first vowel of each profane word with grawlix character", () => {
      const censored = profanity.censor("I like big butts (aka arses) and I cannot lie", CensorType.FirstVowel);
      expect(censored).to.equal(`I like big b${profanity.options.grawlixChar}tts (aka ${profanity.options.grawlixChar}rses) and I cannot lie`);
    });
  });

  describe("censor (CensorType = AllVowels)", () => {
    it("should replace all vowels within each profane word with grawlix character", () => {
      const censored = profanity.censor("I like big butts (aka arses) and I cannot lie", CensorType.AllVowels);
      expect(censored).to.equal(
        `I like big b${profanity.options.grawlixChar}tts (aka ${profanity.options.grawlixChar}rs${profanity.options.grawlixChar}s) and I cannot lie`
      );
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
