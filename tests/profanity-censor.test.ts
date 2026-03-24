import { describe, it, expect } from "vitest";

import { profanity, CensorType } from "../src";

describe("censor", () => {
  describe("Default censoring (CensorType.Word)", () => {
    it("should replace multiple profane words within a sentence with grawlix", () => {
      const censored = profanity.censor("I like big butts (aka arses) and I cannot lie");
      expect(censored).toBe(`I like big ${profanity.options.grawlix} (aka ${profanity.options.grawlix}) and I cannot lie`);
    });

    it("should replace profane words within a multi-line sentence with grawlix", () => {
      const censored = profanity.censor(`
          Nothing profane on line 1.
          Censoring butt on line 2.
          Nothing profane on line 3.
        `);
      expect(censored).toBe(`
          Nothing profane on line 1.
          Censoring ${profanity.options.grawlix} on line 2.
          Nothing profane on line 3.
        `);
    });

    it("sentences without profanity should not be altered", () => {
      const original = "I like big glutes and I cannot lie";
      expect(profanity.censor(original)).toBe(original);
    });

    it("should censor profanity at the beginning of a sentence", () => {
      expect(profanity.censor("Butt is a profane word")).toBe(`${profanity.options.grawlix} is a profane word`);
    });

    it("should censor profanity at the end of a sentence", () => {
      expect(profanity.censor("Don't be a butt")).toBe(`Don't be a ${profanity.options.grawlix}`);
    });
    it("should censor multiple occurrences of the same profane word", () => {
      expect(profanity.censor("Butt, butt, butt!")).toBe(`${profanity.options.grawlix}, ${profanity.options.grawlix}, ${profanity.options.grawlix}!`);
    });

    it("should not censor parts of words that contain profanity", () => {
      expect(profanity.censor("I need to assess the situation")).toBe("I need to assess the situation");
    });

    it("should censor profanity separated by hyphens", () => {
      expect(profanity.censor("Don't be a butt-head")).toBe(`Don't be a ${profanity.options.grawlix}-head`);
    });

    it("should censor profanity separated by underscores", () => {
      expect(profanity.censor("Don't be a butt_head")).toBe(`Don't be a ${profanity.options.grawlix}_head`);
    });

    it("should censor profanity surrounded by emoji", () => {
      expect(profanity.censor("That's 💩butt💩")).toBe(`That's 💩${profanity.options.grawlix}💩`);
    });
  });

  describe("CensorType.FirstChar", () => {
    it("should replace first character of each profane word with grawlix character", () => {
      const censored = profanity.censor("I like big butts (aka arses) and I cannot lie", CensorType.FirstChar);
      expect(censored).toBe(`I like big ${profanity.options.grawlixChar}utts (aka ${profanity.options.grawlixChar}rses) and I cannot lie`);
    });

    it("should preserve case when censoring first character", () => {
      expect(profanity.censor("Don't be a BuTt", CensorType.FirstChar)).toBe(`Don't be a ${profanity.options.grawlixChar}uTt`);
    });

    it("should censor first character of profanity at the beginning of a sentence", () => {
      expect(profanity.censor("Butt is a profane word", CensorType.FirstChar)).toBe(`${profanity.options.grawlixChar}utt is a profane word`);
    });

    it("should censor first character of profanity at the end of a sentence", () => {
      expect(profanity.censor("Don't be a butt.", CensorType.FirstChar)).toBe(`Don't be a ${profanity.options.grawlixChar}utt.`);
    });

    it("should censor first character of profanity separated by hyphens", () => {
      expect(profanity.censor("Don't be a butt-head", CensorType.FirstChar)).toBe(`Don't be a ${profanity.options.grawlixChar}utt-head`);
    });

    it("should censor first character of profanity separated by underscores", () => {
      expect(profanity.censor("Don't be a butt_head", CensorType.FirstChar)).toBe(`Don't be a ${profanity.options.grawlixChar}utt_head`);
    });
  });
  describe("CensorType.FirstVowel", () => {
    it("should replace first vowel of each profane word with grawlix character", () => {
      const censored = profanity.censor("I like big butts (aka arses) and I cannot lie", CensorType.FirstVowel);
      expect(censored).toBe(`I like big b${profanity.options.grawlixChar}tts (aka ${profanity.options.grawlixChar}rses) and I cannot lie`);
    });

    it("should not censor if no vowels are present", () => {
      expect(profanity.censor("tsk tsk", CensorType.FirstVowel)).toBe("tsk tsk");
    });

    it("should censor first vowel of profanity at the beginning of a sentence", () => {
      expect(profanity.censor("Butt is a profane word", CensorType.FirstVowel)).toBe(`B${profanity.options.grawlixChar}tt is a profane word`);
    });

    it("should censor first vowel of profanity at the end of a sentence", () => {
      expect(profanity.censor("Don't be a butt.", CensorType.FirstVowel)).toBe(`Don't be a b${profanity.options.grawlixChar}tt.`);
    });

    it("should handle profane words with no vowels", () => {
      expect(profanity.censor("Don't say tsk", CensorType.FirstVowel)).toBe("Don't say tsk");
    });

    it("should censor first vowel of profanity separated by hyphens", () => {
      expect(profanity.censor("Don't be a butt-head", CensorType.FirstVowel)).toBe(`Don't be a b${profanity.options.grawlixChar}tt-head`);
    });
    it("should censor first vowel of profanity separated by underscores", () => {
      expect(profanity.censor("Don't be a butt_head", CensorType.FirstVowel)).toBe(`Don't be a b${profanity.options.grawlixChar}tt_head`);
    });
  });

  describe("CensorType.AllVowels", () => {
    it("should replace all vowels within each profane word with grawlix character", () => {
      const censored = profanity.censor("I like big butts (aka arses) and I cannot lie", CensorType.AllVowels);
      expect(censored).toBe(
        `I like big b${profanity.options.grawlixChar}tts (aka ${profanity.options.grawlixChar}rs${profanity.options.grawlixChar}s) and I cannot lie`,
      );
    });

    it("should preserve case when censoring all vowels", () => {
      expect(profanity.censor("BuTt", CensorType.AllVowels)).toBe(`B${profanity.options.grawlixChar}Tt`);
    });

    it("should censor all vowels of profanity at the beginning of a sentence", () => {
      expect(profanity.censor("Butt is a profane word", CensorType.AllVowels)).toBe(`B${profanity.options.grawlixChar}tt is a profane word`);
    });

    it("should censor all vowels of profanity at the end of a sentence", () => {
      expect(profanity.censor("Don't be a butt.", CensorType.AllVowels)).toBe(`Don't be a b${profanity.options.grawlixChar}tt.`);
    });

    it("should handle profane words with no vowels", () => {
      expect(profanity.censor("Don't say tsk", CensorType.AllVowels)).toBe("Don't say tsk");
    });
  });
  describe("Case sensitivity", () => {
    it("should censor while preserving case", () => {
      expect(profanity.censor("Don't be a BuTt")).toBe("Don't be a @#$%&!");
    });

    it("should censor all uppercase profanity", () => {
      expect(profanity.censor("DON'T BE A BUTT")).toBe("DON'T BE A @#$%&!");
    });

    it("should censor mixed case profanity", () => {
      expect(profanity.censor("Don't Be A bUtT")).toBe("Don't Be A @#$%&!");
    });

    it("should censor profanity with alternating case", () => {
      expect(profanity.censor("dOn'T bE a BuTt")).toBe("dOn'T bE a @#$%&!");
    });
  });

  describe("Multi-word profanities", () => {
    it("should censor multi-word profanities", () => {
      expect(profanity.censor("He's a fudge packer")).toBe(`He's a ${profanity.options.grawlix}`);
      expect(profanity.censor("That's a blow job")).toBe(`That's a ${profanity.options.grawlix}`);
      expect(profanity.censor("Don't be a son-of-a-bitch")).toBe(`Don't be a ${profanity.options.grawlix}`);
    });

    it("should handle multi-word profanities with different censor types", () => {
      expect(profanity.censor("He's a fudge packer", CensorType.FirstChar)).toBe(`He's a ${profanity.options.grawlixChar}udge packer`);
      expect(profanity.censor("That's a blow job", CensorType.FirstVowel)).toBe(`That's a bl${profanity.options.grawlixChar}w job`);
      expect(profanity.censor("Don't be a son-of-a-bitch", CensorType.AllVowels)).toBe(
        `Don't be a s${profanity.options.grawlixChar}n-${profanity.options.grawlixChar}f-${profanity.options.grawlixChar}-b${profanity.options.grawlixChar}tch`,
      );
    });
  });

  describe("Input type handling", () => {
    it("should return original input for non-string input", () => {
      expect(profanity.censor(null as any)).toBeNull();
      expect(profanity.censor(undefined as any)).toBeUndefined();
      expect(profanity.censor(123 as any)).toBe(123);
      expect(profanity.censor(true as any)).toBe(true);
      expect(profanity.censor({} as any)).toEqual({});
      expect(profanity.censor([] as any)).toEqual([]);
    });
  });
});
