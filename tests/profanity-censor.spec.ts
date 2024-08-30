import { expect } from "chai";

import { profanity, CensorType } from "../src";

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
      expect(profanity.censor("Butt is a profane word")).to.equal(`${profanity.options.grawlix} is a profane word`);
    });

    it("should censor profanity at the end of a sentence", () => {
      expect(profanity.censor("Don't be a butt")).to.equal(`Don't be a ${profanity.options.grawlix}`);
    });
    it("should censor multiple occurrences of the same profane word", () => {
      expect(profanity.censor("Butt, butt, butt!")).to.equal(
        `${profanity.options.grawlix}, ${profanity.options.grawlix}, ${profanity.options.grawlix}!`,
      );
    });

    it("should not censor parts of words that contain profanity", () => {
      expect(profanity.censor("I need to assess the situation")).to.equal("I need to assess the situation");
    });

    it("should censor profanity separated by hyphens", () => {
      expect(profanity.censor("Don't be a butt-head")).to.equal(`Don't be a ${profanity.options.grawlix}-head`);
    });

    it("should censor profanity separated by underscores", () => {
      expect(profanity.censor("Don't be a butt_head")).to.equal(`Don't be a ${profanity.options.grawlix}_head`);
    });

    it("should censor profanity surrounded by emoji", () => {
      expect(profanity.censor("That's 💩butt💩")).to.equal(`That's 💩${profanity.options.grawlix}💩`);
    });
  });

  describe("CensorType.FirstChar", () => {
    it("should replace first character of each profane word with grawlix character", () => {
      const censored = profanity.censor("I like big butts (aka arses) and I cannot lie", CensorType.FirstChar);
      expect(censored).to.equal(`I like big ${profanity.options.grawlixChar}utts (aka ${profanity.options.grawlixChar}rses) and I cannot lie`);
    });

    it("should preserve case when censoring first character", () => {
      expect(profanity.censor("Don't be a BuTt", CensorType.FirstChar)).to.equal(`Don't be a ${profanity.options.grawlixChar}uTt`);
    });

    it("should censor first character of profanity at the beginning of a sentence", () => {
      expect(profanity.censor("Butt is a profane word", CensorType.FirstChar)).to.equal(`${profanity.options.grawlixChar}utt is a profane word`);
    });

    it("should censor first character of profanity at the end of a sentence", () => {
      expect(profanity.censor("Don't be a butt.", CensorType.FirstChar)).to.equal(`Don't be a ${profanity.options.grawlixChar}utt.`);
    });

    it("should censor first character of profanity separated by hyphens", () => {
      expect(profanity.censor("Don't be a butt-head", CensorType.FirstChar)).to.equal(`Don't be a ${profanity.options.grawlixChar}utt-head`);
    });

    it("should censor first character of profanity separated by underscores", () => {
      expect(profanity.censor("Don't be a butt_head", CensorType.FirstChar)).to.equal(`Don't be a ${profanity.options.grawlixChar}utt_head`);
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
      expect(profanity.censor("Butt is a profane word", CensorType.FirstVowel)).to.equal(`B${profanity.options.grawlixChar}tt is a profane word`);
    });

    it("should censor first vowel of profanity at the end of a sentence", () => {
      expect(profanity.censor("Don't be a butt.", CensorType.FirstVowel)).to.equal(`Don't be a b${profanity.options.grawlixChar}tt.`);
    });

    it("should handle profane words with no vowels", () => {
      expect(profanity.censor("Don't say tsk", CensorType.FirstVowel)).to.equal("Don't say tsk");
    });

    it("should censor first vowel of profanity separated by hyphens", () => {
      expect(profanity.censor("Don't be a butt-head", CensorType.FirstVowel)).to.equal(`Don't be a b${profanity.options.grawlixChar}tt-head`);
    });
    it("should censor first vowel of profanity separated by underscores", () => {
      expect(profanity.censor("Don't be a butt_head", CensorType.FirstVowel)).to.equal(`Don't be a b${profanity.options.grawlixChar}tt_head`);
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
      expect(profanity.censor("BuTt", CensorType.AllVowels)).to.equal(`B${profanity.options.grawlixChar}Tt`);
    });

    it("should censor all vowels of profanity at the beginning of a sentence", () => {
      expect(profanity.censor("Butt is a profane word", CensorType.AllVowels)).to.equal(`B${profanity.options.grawlixChar}tt is a profane word`);
    });

    it("should censor all vowels of profanity at the end of a sentence", () => {
      expect(profanity.censor("Don't be a butt.", CensorType.AllVowels)).to.equal(`Don't be a b${profanity.options.grawlixChar}tt.`);
    });

    it("should handle profane words with no vowels", () => {
      expect(profanity.censor("Don't say tsk", CensorType.AllVowels)).to.equal("Don't say tsk");
    });
  });
  describe("Case sensitivity", () => {
    it("should censor while preserving case", () => {
      expect(profanity.censor("Don't be a BuTt")).to.equal("Don't be a @#$%&!");
    });

    it("should censor all uppercase profanity", () => {
      expect(profanity.censor("DON'T BE A BUTT")).to.equal("DON'T BE A @#$%&!");
    });

    it("should censor mixed case profanity", () => {
      expect(profanity.censor("Don't Be A bUtT")).to.equal("Don't Be A @#$%&!");
    });

    it("should censor profanity with alternating case", () => {
      expect(profanity.censor("dOn'T bE a BuTt")).to.equal("dOn'T bE a @#$%&!");
    });
  });

  describe("Multi-word profanities", () => {
    it("should censor multi-word profanities", () => {
      expect(profanity.censor("He's a fudge packer")).to.equal(`He's a ${profanity.options.grawlix}`);
      expect(profanity.censor("That's a blow job")).to.equal(`That's a ${profanity.options.grawlix}`);
      expect(profanity.censor("Don't be a son-of-a-bitch")).to.equal(`Don't be a ${profanity.options.grawlix}`);
    });

    it("should handle multi-word profanities with different censor types", () => {
      expect(profanity.censor("He's a fudge packer", CensorType.FirstChar)).to.equal(`He's a ${profanity.options.grawlixChar}udge packer`);
      expect(profanity.censor("That's a blow job", CensorType.FirstVowel)).to.equal(`That's a bl${profanity.options.grawlixChar}w job`);
      expect(profanity.censor("Don't be a son-of-a-bitch", CensorType.AllVowels)).to.equal(
        `Don't be a s${profanity.options.grawlixChar}n-${profanity.options.grawlixChar}f-${profanity.options.grawlixChar}-b${profanity.options.grawlixChar}tch`,
      );
    });
  });
});
