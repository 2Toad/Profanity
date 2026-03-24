import { describe, it, expect, beforeEach } from "vitest";

import { Profanity, CensorType, ProfanityOptions } from "../src";

describe("Profanity", () => {
  describe("Class instantiation", () => {
    describe("Profanity", () => {
      it("should create Profanity instance with default options", () => {
        const profanityInstance = new Profanity();
        expect(profanityInstance.options.wholeWord).toBe(true);
        expect(profanityInstance.options.grawlix).toBe("@#$%&!");
        expect(profanityInstance.options.grawlixChar).toBe("*");
      });

      it("should create Profanity instance with custom options", () => {
        const options = new ProfanityOptions({
          wholeWord: false,
          grawlix: "***",
          grawlixChar: "#",
        });
        const profanityInstance = new Profanity(options);
        expect(profanityInstance.options.wholeWord).toBe(false);
        expect(profanityInstance.options.grawlix).toBe("***");
        expect(profanityInstance.options.grawlixChar).toBe("#");
      });

      it("should create Profanity instance with all partial custom options", () => {
        const profanityInstance = new Profanity({
          wholeWord: false,
          grawlix: "***",
          grawlixChar: "#",
        });
        expect(profanityInstance.options.wholeWord).toBe(false);
        expect(profanityInstance.options.grawlix).toBe("***");
        expect(profanityInstance.options.grawlixChar).toBe("#");
      });

      it("should create Profanity instance with some partial custom options", () => {
        const profanityInstance = new Profanity({
          wholeWord: false,
        });
        expect(profanityInstance.options.wholeWord).toBe(false);
        expect(profanityInstance.options.grawlix).toBe("@#$%&!");
        expect(profanityInstance.options.grawlixChar).toBe("*");
      });
    });
  });

  describe("Word list management", () => {
    let customProfanity: Profanity;

    beforeEach(() => {
      customProfanity = new Profanity();
    });

    describe("addWords", () => {
      it("should add multiple words to the list of profane words", () => {
        customProfanity.addWords(["aardvark", "zebra"]);
        expect(customProfanity.exists("Should we censor the word aardvark and zebra?")).toBe(true);
      });

      it("should handle adding duplicate words", () => {
        customProfanity.addWords(["test", "test"]);
        expect(customProfanity.exists("test")).toBe(true);
      });
    });

    describe("removeWords", () => {
      it("should remove multiple words from the list of profane words", () => {
        customProfanity.removeWords(["butts", "arses"]);
        expect(customProfanity.exists("I like big butts (aka arses) and I cannot lie")).toBe(false);
      });

      it("should handle removing non-existent words", () => {
        customProfanity.removeWords(["nonexistent"]);
        expect(customProfanity.exists("nonexistent")).toBe(false);
      });
    });

    describe("Custom word list", () => {
      it("should detect custom added words (wholeWord = true)", () => {
        customProfanity.addWords(["cucumber", "banana"]);
        expect(customProfanity.exists("I love cucumbers")).toBe(false);
        expect(customProfanity.censor("I love cucumbers")).toBe("I love cucumbers");
        expect(customProfanity.exists("I love cucumber")).toBe(true);
        expect(customProfanity.censor("I love cucumber")).toBe(`I love ${customProfanity.options.grawlix}`);
        expect(customProfanity.exists("Bananas are yellow")).toBe(false);
        expect(customProfanity.censor("Bananas are yellow")).toBe("Bananas are yellow");
        expect(customProfanity.exists("This banana is yellow")).toBe(true);
        expect(customProfanity.censor("This banana is yellow")).toBe(`This ${customProfanity.options.grawlix} is yellow`);
      });

      it("should detect custom added words (wholeWord = false)", () => {
        const customProfanityPartial = new Profanity({ wholeWord: false });
        customProfanityPartial.addWords(["cucumber", "banana"]);
        expect(customProfanityPartial.exists("I love cucumbers")).toBe(true);
        expect(customProfanityPartial.censor("I love cucumbers")).toBe(`I love ${customProfanityPartial.options.grawlix}s`);
        expect(customProfanityPartial.exists("Bananas are yellow")).toBe(true);
        expect(customProfanityPartial.censor("Bananas are yellow")).toBe(`${customProfanityPartial.options.grawlix}s are yellow`);
      });

      it("should not detect removed words", () => {
        customProfanity.removeWords(["butt", "arse"]);
        expect(customProfanity.exists("Don't be a butt")).toBe(false);
        expect(customProfanity.censor("Don't be a butt")).toBe("Don't be a butt");
        expect(customProfanity.exists("You're an arse")).toBe(false);
        expect(customProfanity.censor("You're an arse")).toBe("You're an arse");
      });

      it("should handle adding and removing words in sequence", () => {
        customProfanity.addWords(["test"]);
        expect(customProfanity.exists("test")).toBe(true);
        expect(customProfanity.censor("test")).toBe(customProfanity.options.grawlix);
        customProfanity.removeWords(["test"]);
        expect(customProfanity.exists("test")).toBe(false);
        expect(customProfanity.censor("test")).toBe("test");
      });
    });
  });

  describe("Whitelist functionality", () => {
    let customProfanity: Profanity;

    beforeEach(() => {
      customProfanity = new Profanity();
    });

    describe("wholeWord = true", () => {
      it("should whitelist a word", () => {
        customProfanity.whitelist.addWords(["butt"]);
        expect(customProfanity.exists("Don't be a butt")).toBe(false);
        expect(customProfanity.censor("Don't be a butt")).toBe("Don't be a butt");
      });

      it("should whitelist multiple words", () => {
        customProfanity.whitelist.addWords(["butt", "arse"]);
        expect(customProfanity.exists("Should we censor the word butt or arse?")).toBe(false);
        expect(customProfanity.censor("Should we censor the word butt or arse?")).toBe("Should we censor the word butt or arse?");
      });

      it("should only whitelist exact whole words", () => {
        customProfanity.whitelist.addWords(["but"]);
        expect(customProfanity.exists("Don't be a but")).toBe(false);
        expect(customProfanity.censor("Don't be a but")).toBe("Don't be a but");
        expect(customProfanity.exists("Don't be a butt")).toBe(true);
        expect(customProfanity.censor("Don't be a butt")).toBe("Don't be a @#$%&!");
      });

      describe("Hyphenated and underscore-separated words", () => {
        beforeEach(() => {
          customProfanity.whitelist.addWords(["butt"]);
        });

        it("should detect profanity in hyphenated words when part is whitelisted", () => {
          expect(customProfanity.exists("Don't be a butt-head")).toBe(true);
          expect(customProfanity.censor("Don't be a butt-head")).toBe(`Don't be a ${customProfanity.options.grawlix}-head`);
        });

        it("should detect profanity in underscore-separated words when part is whitelisted", () => {
          expect(customProfanity.exists("Don't be a butt_head")).toBe(true);
          expect(customProfanity.censor("Don't be a butt_head")).toBe(`Don't be a ${customProfanity.options.grawlix}_head`);
        });
      });
    });

    describe("wholeWord = false", () => {
      let customProfanityPartial: Profanity;

      beforeEach(() => {
        customProfanityPartial = new Profanity({ wholeWord: false });
      });

      it("should whitelist multiple words", () => {
        customProfanityPartial.whitelist.addWords(["buttocks", "arsenic"]);
        expect(customProfanityPartial.exists("Should we censor the word buttocks or arsenic?")).toBe(false);
      });

      describe("Edge cases", () => {
        beforeEach(() => {
          customProfanityPartial.whitelist.addWords(["arsenic", "class", "password", "classic"]);
        });

        it("should detect 'arse' as profanity", () => {
          expect(customProfanityPartial.exists("what an arse")).toBe(true);
          expect(customProfanityPartial.censor("what an arse")).toBe(`what an ${customProfanityPartial.options.grawlix}`);
        });

        it("should not detect 'arsenic' as profanity due to whitelist", () => {
          expect(customProfanityPartial.exists("dedicated arsenic")).toBe(false);
          expect(customProfanityPartial.censor("dedicated arsenic")).toBe("dedicated arsenic");
        });

        it("should not detect 'class' as profanity due to whitelist", () => {
          expect(customProfanityPartial.exists("dedicated class person")).toBe(false);
          expect(customProfanityPartial.censor("dedicated class person")).toBe("dedicated class person");
        });

        it("should not detect 'classic' as profanity due to whitelist", () => {
          expect(customProfanityPartial.exists("dedicated classic")).toBe(false);
          expect(customProfanityPartial.censor("dedicated classic")).toBe("dedicated classic");
        });

        it("should not detect 'password' as profanity due to whitelist", () => {
          expect(customProfanityPartial.exists("dedicated password")).toBe(false);
          expect(customProfanityPartial.censor("dedicated password")).toBe("dedicated password");
        });
      });
    });

    describe("removeWords", () => {
      it("should remove multiple words from the whitelist", () => {
        customProfanity.whitelist.addWords(["butts", "arses"]);
        expect(customProfanity.exists("I like big butts (aka arses) and I cannot lie")).toBe(false);

        customProfanity.whitelist.removeWords(["butts"]);
        expect(customProfanity.exists("I like big butts (aka arses) and I cannot lie")).toBe(true);
      });

      it("should handle removing non-existent words from whitelist", () => {
        customProfanity.whitelist.removeWords(["nonexistent"]);
        expect(customProfanity.exists("nonexistent")).toBe(false);
      });
    });

    it("should not detect whitelisted words", () => {
      customProfanity.whitelist.addWords(["classic", "assembly"]);
      expect(customProfanity.exists("That's a classic movie")).toBe(false);
      expect(customProfanity.censor("That's a classic movie")).toBe("That's a classic movie");
      expect(customProfanity.exists("The assembly line is efficient")).toBe(false);
      expect(customProfanity.censor("The assembly line is efficient")).toBe("The assembly line is efficient");
    });

    it("should detect profanity after removing from whitelist", () => {
      customProfanity.whitelist.addWords(["classic"]);
      customProfanity.whitelist.removeWords(["classic"]);
      expect(customProfanity.exists("That's a classic butt movie")).toBe(true);
      expect(customProfanity.censor("That's a classic butt movie")).toBe(`That's a classic ${customProfanity.options.grawlix} movie`);
    });

    it("should handle adding and removing words from whitelist in sequence", () => {
      customProfanity.whitelist.addWords(["test"]);
      customProfanity.addWords(["test"]);
      expect(customProfanity.exists("test")).toBe(false);
      expect(customProfanity.censor("test")).toBe("test");
    });
  });

  describe("Custom options", () => {
    describe("Custom grawlix", () => {
      it("should use custom grawlix string", () => {
        const customProfanity = new Profanity({ grawlix: "!@#" });
        expect(customProfanity.censor("Don't be a butt")).toBe("Don't be a !@#");
      });

      it("should use custom grawlix character", () => {
        const customProfanity = new Profanity({ grawlixChar: "X" });
        expect(customProfanity.censor("You're a butt", CensorType.FirstChar)).toBe("You're a Xutt");
      });
    });
  });
});
