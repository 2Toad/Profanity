import { expect } from "chai";

import { profanity, Profanity, ProfanityOptions } from "../src";
import { CensorType } from "../src/models";

describe("Profanity", () => {
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
        expect(profanity.exists("What the (ass)!")).to.be.true;
      });

      it("should return false when profanity is part of a larger word", () => {
        expect(profanity.exists("I'm feeling passionate today")).to.be.false;
      });

      it("should return true when profanity is at the beginning of a sentence", () => {
        expect(profanity.exists("Ass is a profane word")).to.be.true;
      });

      it("should return true when profanity is at the end of a sentence", () => {
        expect(profanity.exists("Don't be an ass.")).to.be.true;
      });

      it("should return false for words that are substrings of profane words", () => {
        expect(profanity.exists("I need to assess the situation")).to.be.false;
      });

      it("should return true when profanity is separated by hyphens", () => {
        expect(profanity.exists("Don't be an ass-hole")).to.be.true;
      });

      it("should return false when profanity is part of a URL", () => {
        expect(profanity.exists("Visit https://www.example.com/assets/image.jpg")).to.be.false;
      });

      it("should return true when profanity is surrounded by emoji", () => {
        expect(profanity.exists("That's 💩ass💩")).to.be.true;
      });
    });

    describe("wholeWord = false", () => {
      let customProfanity: Profanity;

      before(() => {
        const options = new ProfanityOptions();
        options.wholeWord = false;
        customProfanity = new Profanity(options);
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
        expect(customProfanity.exists("assemble the team")).to.be.true;
      });

      it("should return true when profanity is at the end of a word", () => {
        expect(customProfanity.exists("kickass performance")).to.be.true;
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
        expect(customProfanity.exists("Don't be an ass-hole")).to.be.true;
      });

      it("should return true when profanity is separated by underscores", () => {
        expect(customProfanity.exists("Don't be a butt_head")).to.be.true;
      });

      it("should return true when profanity is surrounded by emoji", () => {
        expect(customProfanity.exists("That's 💩ass💩")).to.be.true;
      });
    });

    describe("Case sensitivity", () => {
      it("should detect mixed case profanity", () => {
        expect(profanity.exists("Don't be an AsS")).to.be.true;
      });

      it("should detect all uppercase profanity", () => {
        expect(profanity.exists("DON'T BE AN ASS")).to.be.true;
      });

      it("should detect all lowercase profanity", () => {
        expect(profanity.exists("don't be an ass")).to.be.true;
      });

      it("should detect profanity with alternating case", () => {
        expect(profanity.exists("dOn'T bE aN aSs")).to.be.true;
      });

      it("should detect profanity with random casing", () => {
        expect(profanity.exists("DoN't Be An aSs")).to.be.true;
      });
    });
  });

  describe("censor", () => {
    describe("Default censoring (CensorType.Word)", () => {
      it("should replace multiple profane words within a sentence with grawlix", () => {
        const censored = profanity.censor("I like big butts (aka arses) and I cannot lie");
        expect(censored).to.equal(`I like big ${profanity.options.grawlix} (aka ${profanity.options.grawlix}) and I cannot lie`);
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
        expect(profanity.censor(original)).to.equal(original);
      });

      it("should censor profanity at the beginning of a sentence", () => {
        expect(profanity.censor("Ass is a profane word")).to.equal(`${profanity.options.grawlix} is a profane word`);
      });

      it("should censor profanity at the end of a sentence", () => {
        expect(profanity.censor("Don't be an ass")).to.equal(`Don't be an ${profanity.options.grawlix}`);
      });

      it("should censor multiple occurrences of the same profane word", () => {
        expect(profanity.censor("Ass, ass, ass!")).to.equal(
          `${profanity.options.grawlix}, ${profanity.options.grawlix}, ${profanity.options.grawlix}!`,
        );
      });

      it("should not censor parts of words that contain profanity", () => {
        expect(profanity.censor("I need to assess the situation")).to.equal("I need to assess the situation");
      });

      it("should censor profanity separated by hyphens", () => {
        expect(profanity.censor("Don't be an ass-hole")).to.equal(`Don't be an ${profanity.options.grawlix}-hole`);
      });

      it("should censor profanity separated by underscores", () => {
        expect(profanity.censor("Don't be an ass_hole")).to.equal(`Don't be an ${profanity.options.grawlix}_hole`);
      });

      it("should censor profanity surrounded by emoji", () => {
        expect(profanity.censor("That's 💩ass💩")).to.equal(`That's 💩${profanity.options.grawlix}💩`);
      });
    });

    describe("CensorType.FirstChar", () => {
      it("should replace first character of each profane word with grawlix character", () => {
        const censored = profanity.censor("I like big butts (aka arses) and I cannot lie", CensorType.FirstChar);
        expect(censored).to.equal(`I like big ${profanity.options.grawlixChar}utts (aka ${profanity.options.grawlixChar}rses) and I cannot lie`);
      });

      it("should preserve case when censoring first character", () => {
        expect(profanity.censor("Don't be an AsS", CensorType.FirstChar)).to.equal(`Don't be an ${profanity.options.grawlixChar}sS`);
      });

      it("should censor first character of profanity at the beginning of a sentence", () => {
        expect(profanity.censor("Ass is a profane word", CensorType.FirstChar)).to.equal(`${profanity.options.grawlixChar}ss is a profane word`);
      });

      it("should censor first character of profanity at the end of a sentence", () => {
        expect(profanity.censor("Don't be an ass.", CensorType.FirstChar)).to.equal(`Don't be an ${profanity.options.grawlixChar}ss.`);
      });

      it("should censor first character of profanity separated by hyphens", () => {
        expect(profanity.censor("Don't be an ass-hole", CensorType.FirstChar)).to.equal(`Don't be an ${profanity.options.grawlixChar}ss-hole`);
      });

      it("should censor first character of profanity separated by underscores", () => {
        expect(profanity.censor("Don't be an ass_hole", CensorType.FirstChar)).to.equal(`Don't be an ${profanity.options.grawlixChar}ss_hole`);
      });
    });

    describe("CensorType.FirstVowel", () => {
      it("should replace first vowel of each profane word with grawlix character", () => {
        const censored = profanity.censor("I like big butts (aka arses) and I cannot lie", CensorType.FirstVowel);
        expect(censored).to.equal(`I like big b${profanity.options.grawlixChar}tts (aka ${profanity.options.grawlixChar}rses) and I cannot lie`);
      });

      it("should not censor if no vowels are present", () => {
        expect(profanity.censor("tsk tsk", CensorType.FirstVowel)).to.equal("tsk tsk");
      });

      it("should censor first vowel of profanity at the beginning of a sentence", () => {
        expect(profanity.censor("Ass is a profane word", CensorType.FirstVowel)).to.equal(`${profanity.options.grawlixChar}ss is a profane word`);
      });

      it("should censor first vowel of profanity at the end of a sentence", () => {
        expect(profanity.censor("Don't be an ass.", CensorType.FirstVowel)).to.equal(`Don't be an ${profanity.options.grawlixChar}ss.`);
      });

      it("should handle profane words with no vowels", () => {
        expect(profanity.censor("Don't say tsk", CensorType.FirstVowel)).to.equal("Don't say tsk");
      });

      it("should censor first vowel of profanity separated by hyphens", () => {
        expect(profanity.censor("Don't be an ass-hole", CensorType.FirstVowel)).to.equal(`Don't be an ${profanity.options.grawlixChar}ss-hole`);
      });

      it("should censor first vowel of profanity separated by underscores", () => {
        expect(profanity.censor("Don't be an ass_hole", CensorType.FirstVowel)).to.equal(`Don't be an ${profanity.options.grawlixChar}ss_hole`);
      });
    });

    describe("CensorType.AllVowels", () => {
      it("should replace all vowels within each profane word with grawlix character", () => {
        const censored = profanity.censor("I like big butts (aka arses) and I cannot lie", CensorType.AllVowels);
        expect(censored).to.equal(
          `I like big b${profanity.options.grawlixChar}tts (aka ${profanity.options.grawlixChar}rs${profanity.options.grawlixChar}s) and I cannot lie`,
        );
      });

      it("should preserve case when censoring all vowels", () => {
        expect(profanity.censor("AsS", CensorType.AllVowels)).to.equal(`${profanity.options.grawlixChar}sS`);
      });

      it("should censor all vowels of profanity at the beginning of a sentence", () => {
        expect(profanity.censor("Ass is a profane word", CensorType.AllVowels)).to.equal(`${profanity.options.grawlixChar}ss is a profane word`);
      });

      it("should censor all vowels of profanity at the end of a sentence", () => {
        expect(profanity.censor("Don't be an ass.", CensorType.AllVowels)).to.equal(`Don't be an ${profanity.options.grawlixChar}ss.`);
      });

      it("should handle profane words with no vowels", () => {
        expect(profanity.censor("Don't say tsk", CensorType.AllVowels)).to.equal("Don't say tsk");
      });
    });

    describe("Case sensitivity", () => {
      it("should censor while preserving case", () => {
        expect(profanity.censor("Don't be an AsS")).to.equal("Don't be an @#$%&!");
      });

      it("should censor all uppercase profanity", () => {
        expect(profanity.censor("DON'T BE AN ASS")).to.equal("DON'T BE AN @#$%&!");
      });

      it("should censor mixed case profanity", () => {
        expect(profanity.censor("Don't Be An aSs")).to.equal("Don't Be An @#$%&!");
      });

      it("should censor profanity with alternating case", () => {
        expect(profanity.censor("dOn'T bE aN aSs")).to.equal("dOn'T bE aN @#$%&!");
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
        expect(customProfanity.exists("I love cucumber")).to.be.true;
        expect(customProfanity.exists("Bananas are yellow")).to.be.false;
        expect(customProfanity.exists("This banana is yellow")).to.be.true;
      });

      it("should detect custom added words (wholeWord = false)", () => {
        const options = new ProfanityOptions();
        options.wholeWord = false;
        const customProfanityPartial = new Profanity(options);
        customProfanityPartial.addWords(["cucumber", "banana"]);
        expect(customProfanityPartial.exists("I love cucumbers")).to.be.true;
        expect(customProfanityPartial.exists("Bananas are yellow")).to.be.true;
      });

      it("should not detect removed words", () => {
        customProfanity.removeWords(["ass", "arse"]);
        expect(customProfanity.exists("Don't be an ass")).to.be.false;
        expect(customProfanity.exists("You're an arse")).to.be.false;
      });

      it("should handle adding and removing words in sequence", () => {
        customProfanity.addWords(["test"]);
        expect(customProfanity.exists("test")).to.be.true;
        customProfanity.removeWords(["test"]);
        expect(customProfanity.exists("test")).to.be.false;
      });
    });
  });

  describe("Whitelist functionality", () => {
    let customProfanity: Profanity;

    beforeEach(() => {
      customProfanity = new Profanity();
    });

    describe("wholeWord = true", () => {
      it("should whitelist multiple words", () => {
        customProfanity.whitelist.addWords(["butt", "arse"]);
        expect(customProfanity.exists("Should we censor the word butt or arse?")).to.be.false;
      });

      it("should only whitelist exact whole words", () => {
        customProfanity.whitelist.addWords(["but"]);
        expect(customProfanity.exists("Don't be a but")).to.be.false;
        expect(customProfanity.exists("Don't be a butt")).to.be.true;
      });

      describe("Hyphenated and underscore-separated words", () => {
        beforeEach(() => {
          customProfanity.whitelist.addWords(["butt"]);
        });

        it("should detect profanity in hyphenated words when part is whitelisted", () => {
          expect(customProfanity.exists("Don't be a butt-head")).to.be.true;
        });

        it("should detect profanity in underscore-separated words when part is whitelisted", () => {
          expect(customProfanity.exists("Don't be a butt_head")).to.be.true;
        });
      });
    });

    describe("wholeWord = false", () => {
      let customProfanityPartial: Profanity;

      before(() => {
        const options = new ProfanityOptions();
        options.wholeWord = false;
        customProfanityPartial = new Profanity(options);
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
        });

        it("should not detect 'arsenic' as profanity due to whitelist", () => {
          expect(customProfanityPartial.exists("dedicated arsenic")).to.be.false;
        });

        it("should not detect 'class' as profanity due to whitelist", () => {
          expect(customProfanityPartial.exists("dedicated class person")).to.be.false;
        });

        it("should not detect 'classic' as profanity due to whitelist", () => {
          expect(customProfanityPartial.exists("dedicated classic")).to.be.false;
        });

        it("should not detect 'password' as profanity due to whitelist", () => {
          expect(customProfanityPartial.exists("dedicated password")).to.be.false;
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
      expect(customProfanity.exists("The assembly line is efficient")).to.be.false;
    });

    it("should detect profanity after removing from whitelist", () => {
      customProfanity.whitelist.addWords(["classic"]);
      customProfanity.whitelist.removeWords(["classic"]);
      expect(customProfanity.exists("That's a classic ass movie")).to.be.true;
    });

    it("should handle adding and removing words from whitelist in sequence", () => {
      customProfanity.whitelist.addWords(["test"]);
      customProfanity.addWords(["test"]);
      expect(customProfanity.exists("test")).to.be.false;
    });
  });

  describe("Custom options", () => {
    describe("Custom grawlix", () => {
      it("should use custom grawlix string", () => {
        const options = new ProfanityOptions();
        options.grawlix = "!@#";
        const customProfanity = new Profanity(options);
        expect(customProfanity.censor("Don't be an ass")).to.equal("Don't be an !@#");
      });

      it("should use custom grawlix character", () => {
        const options = new ProfanityOptions();
        options.grawlixChar = "X";
        const customProfanity = new Profanity(options);
        expect(customProfanity.censor("You're a bitch", CensorType.FirstChar)).to.equal("You're a Xitch");
      });
    });
  });
});
