import { expect } from "chai";

import { Profanity, CensorType, ProfanityOptions } from "../src";

describe("Profanity", () => {
  describe("Class instantiation", () => {
    describe("Profanity", () => {
      it("should create Profanity instance with default options", () => {
        const profanityInstance = new Profanity();
        expect(profanityInstance.options.wholeWord).to.be.true;
        expect(profanityInstance.options.grawlix).to.equal("@#$%&!");
        expect(profanityInstance.options.grawlixChar).to.equal("*");
      });

      it("should create Profanity instance with custom options", () => {
        const options = new ProfanityOptions({
          wholeWord: false,
          grawlix: "***",
          grawlixChar: "#",
        });
        const profanityInstance = new Profanity(options);
        expect(profanityInstance.options.wholeWord).to.be.false;
        expect(profanityInstance.options.grawlix).to.equal("***");
        expect(profanityInstance.options.grawlixChar).to.equal("#");
      });

      it("should create Profanity instance with all partial custom options", () => {
        const profanityInstance = new Profanity({
          wholeWord: false,
          grawlix: "***",
          grawlixChar: "#",
        });
        expect(profanityInstance.options.wholeWord).to.be.false;
        expect(profanityInstance.options.grawlix).to.equal("***");
        expect(profanityInstance.options.grawlixChar).to.equal("#");
      });

      it("should create Profanity instance with some partial custom options", () => {
        const profanityInstance = new Profanity({
          wholeWord: false,
        });
        expect(profanityInstance.options.wholeWord).to.be.false;
        expect(profanityInstance.options.grawlix).to.equal("@#$%&!");
        expect(profanityInstance.options.grawlixChar).to.equal("*");
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
        expect(customProfanity.exists("Should we censor the word aardvark and zebra?")).to.be.true;
      });

      it("should handle adding duplicate words", () => {
        customProfanity.addWords(["test", "test"]);
        expect(customProfanity.exists("test")).to.be.true;
      });
    });

    describe("removeWords", () => {
      it("should remove multiple words from the list of profane words", () => {
        customProfanity.removeWords(["butts", "arses"]);
        expect(customProfanity.exists("I like big butts (aka arses) and I cannot lie")).to.be.false;
      });

      it("should handle removing non-existent words", () => {
        customProfanity.removeWords(["nonexistent"]);
        expect(customProfanity.exists("nonexistent")).to.be.false;
      });
    });

    describe("Custom word list", () => {
      it("should detect custom added words (wholeWord = true)", () => {
        customProfanity.addWords(["cucumber", "banana"]);
        expect(customProfanity.exists("I love cucumbers")).to.be.false;
        expect(customProfanity.censor("I love cucumbers")).to.equal("I love cucumbers");
        expect(customProfanity.exists("I love cucumber")).to.be.true;
        expect(customProfanity.censor("I love cucumber")).to.equal(`I love ${customProfanity.options.grawlix}`);
        expect(customProfanity.exists("Bananas are yellow")).to.be.false;
        expect(customProfanity.censor("Bananas are yellow")).to.equal("Bananas are yellow");
        expect(customProfanity.exists("This banana is yellow")).to.be.true;
        expect(customProfanity.censor("This banana is yellow")).to.equal(`This ${customProfanity.options.grawlix} is yellow`);
      });

      it("should detect custom added words (wholeWord = false)", () => {
        const customProfanityPartial = new Profanity({ wholeWord: false });
        customProfanityPartial.addWords(["cucumber", "banana"]);
        expect(customProfanityPartial.exists("I love cucumbers")).to.be.true;
        expect(customProfanityPartial.censor("I love cucumbers")).to.equal(`I love ${customProfanityPartial.options.grawlix}s`);
        expect(customProfanityPartial.exists("Bananas are yellow")).to.be.true;
        expect(customProfanityPartial.censor("Bananas are yellow")).to.equal(`${customProfanityPartial.options.grawlix}s are yellow`);
      });

      it("should not detect removed words", () => {
        customProfanity.removeWords(["butt", "arse"]);
        expect(customProfanity.exists("Don't be a butt")).to.be.false;
        expect(customProfanity.censor("Don't be a butt")).to.equal("Don't be a butt");
        expect(customProfanity.exists("You're an arse")).to.be.false;
        expect(customProfanity.censor("You're an arse")).to.equal("You're an arse");
      });

      it("should handle adding and removing words in sequence", () => {
        customProfanity.addWords(["test"]);
        expect(customProfanity.exists("test")).to.be.true;
        expect(customProfanity.censor("test")).to.equal(customProfanity.options.grawlix);
        customProfanity.removeWords(["test"]);
        expect(customProfanity.exists("test")).to.be.false;
        expect(customProfanity.censor("test")).to.equal("test");
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
        expect(customProfanity.exists("Don't be a butt")).to.be.false;
        expect(customProfanity.censor("Don't be a butt")).to.equal("Don't be a butt");
      });

      it("should whitelist multiple words", () => {
        customProfanity.whitelist.addWords(["butt", "arse"]);
        expect(customProfanity.exists("Should we censor the word butt or arse?")).to.be.false;
        expect(customProfanity.censor("Should we censor the word butt or arse?")).to.equal("Should we censor the word butt or arse?");
      });

      it("should only whitelist exact whole words", () => {
        customProfanity.whitelist.addWords(["but"]);
        expect(customProfanity.exists("Don't be a but")).to.be.false;
        expect(customProfanity.censor("Don't be a but")).to.equal("Don't be a but");
        expect(customProfanity.exists("Don't be a butt")).to.be.true;
        expect(customProfanity.censor("Don't be a butt")).to.equal("Don't be a @#$%&!");
      });

      describe("Hyphenated and underscore-separated words", () => {
        beforeEach(() => {
          customProfanity.whitelist.addWords(["butt"]);
        });

        it("should detect profanity in hyphenated words when part is whitelisted", () => {
          expect(customProfanity.exists("Don't be a butt-head")).to.be.true;
          expect(customProfanity.censor("Don't be a butt-head")).to.equal(`Don't be a ${customProfanity.options.grawlix}-head`);
        });

        it("should detect profanity in underscore-separated words when part is whitelisted", () => {
          expect(customProfanity.exists("Don't be a butt_head")).to.be.true;
          expect(customProfanity.censor("Don't be a butt_head")).to.equal(`Don't be a ${customProfanity.options.grawlix}_head`);
        });
      });
    });

    describe("wholeWord = false", () => {
      let customProfanityPartial: Profanity;

      before(() => {
        customProfanityPartial = new Profanity({ wholeWord: false });
      });

      it("should whitelist multiple words", () => {
        customProfanityPartial.whitelist.addWords(["buttocks", "arsenic"]);
        expect(customProfanityPartial.exists("Should we censor the word buttocks or arsenic?")).to.be.false;
      });

      describe("Edge cases", () => {
        before(() => {
          customProfanityPartial.whitelist.addWords(["arsenic", "class", "password", "classic"]);
        });

        it("should detect 'arse' as profanity", () => {
          expect(customProfanityPartial.exists("what an arse")).to.be.true;
          expect(customProfanityPartial.censor("what an arse")).to.equal(`what an ${customProfanityPartial.options.grawlix}`);
        });

        it("should not detect 'arsenic' as profanity due to whitelist", () => {
          expect(customProfanityPartial.exists("dedicated arsenic")).to.be.false;
          expect(customProfanityPartial.censor("dedicated arsenic")).to.equal("dedicated arsenic");
        });

        it("should not detect 'class' as profanity due to whitelist", () => {
          expect(customProfanityPartial.exists("dedicated class person")).to.be.false;
          expect(customProfanityPartial.censor("dedicated class person")).to.equal("dedicated class person");
        });

        it("should not detect 'classic' as profanity due to whitelist", () => {
          expect(customProfanityPartial.exists("dedicated classic")).to.be.false;
          expect(customProfanityPartial.censor("dedicated classic")).to.equal("dedicated classic");
        });

        it("should not detect 'password' as profanity due to whitelist", () => {
          expect(customProfanityPartial.exists("dedicated password")).to.be.false;
          expect(customProfanityPartial.censor("dedicated password")).to.equal("dedicated password");
        });
      });
    });

    describe("removeWords", () => {
      it("should remove multiple words from the whitelist", () => {
        customProfanity.whitelist.addWords(["butts", "arses"]);
        expect(customProfanity.exists("I like big butts (aka arses) and I cannot lie")).to.be.false;

        customProfanity.whitelist.removeWords(["butts"]);
        expect(customProfanity.exists("I like big butts (aka arses) and I cannot lie")).to.be.true;
      });

      it("should handle removing non-existent words from whitelist", () => {
        customProfanity.whitelist.removeWords(["nonexistent"]);
        expect(customProfanity.exists("nonexistent")).to.be.false;
      });
    });

    it("should not detect whitelisted words", () => {
      customProfanity.whitelist.addWords(["classic", "assembly"]);
      expect(customProfanity.exists("That's a classic movie")).to.be.false;
      expect(customProfanity.censor("That's a classic movie")).to.equal("That's a classic movie");
      expect(customProfanity.exists("The assembly line is efficient")).to.be.false;
      expect(customProfanity.censor("The assembly line is efficient")).to.equal("The assembly line is efficient");
    });

    it("should detect profanity after removing from whitelist", () => {
      customProfanity.whitelist.addWords(["classic"]);
      customProfanity.whitelist.removeWords(["classic"]);
      expect(customProfanity.exists("That's a classic butt movie")).to.be.true;
      expect(customProfanity.censor("That's a classic butt movie")).to.equal(`That's a classic ${customProfanity.options.grawlix} movie`);
    });

    it("should handle adding and removing words from whitelist in sequence", () => {
      customProfanity.whitelist.addWords(["test"]);
      customProfanity.addWords(["test"]);
      expect(customProfanity.exists("test")).to.be.false;
      expect(customProfanity.censor("test")).to.equal("test");
    });
  });

  describe("Custom options", () => {
    describe("Custom grawlix", () => {
      it("should use custom grawlix string", () => {
        const customProfanity = new Profanity({ grawlix: "!@#" });
        expect(customProfanity.censor("Don't be a butt")).to.equal("Don't be a !@#");
      });

      it("should use custom grawlix character", () => {
        const customProfanity = new Profanity({ grawlixChar: "X" });
        expect(customProfanity.censor("You're a butt", CensorType.FirstChar)).to.equal("You're a Xutt");
      });
    });
  });
});
