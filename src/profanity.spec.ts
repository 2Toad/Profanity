import { expect } from 'chai';

import { profanity, Profanity, ProfanityOptions } from '.';

describe('Profanity', () => {
  describe('exists (wholeWord = true)', () => {
    it('should return true when profanity exists in a sentence', () => {
      expect(profanity.exists('Should we censor the word butt?')).to.equal(true);
    });

    it('should return false when concatenated profanity exists in a sentence', () => {
      expect(profanity.exists('Should we censor the word buttArse?')).to.equal(false);
    });

    it('should return true when profanity exists on multiple lines', () => {
      expect(profanity.exists(`
        Nothing profane on line 1.
        Censoring butt on line 2.
        Nothing profane on line 3.
      `)).to.equal(true);
    });

    it('should return false when profanity does not exist', () => {
      expect(profanity.exists('Should we censor the word buttocks?')).to.equal(false);
    });

    it('should return true when profanity exists as a single word', () => {
      expect(profanity.exists('butt')).to.equal(true);
    });
  });

  describe('exists (wholeWord = false)', () => {
    const options = new ProfanityOptions();
    options.wholeWord = false;
    const customProfanity = new Profanity(options);

    it('should return true when concatenated profanity exists in a sentence', () => {
      expect(customProfanity.exists('Should we censor the word buttArse?')).to.equal(true);
    });

    it('should return true when concatenated profanity exists on multiple lines', () => {
      expect(customProfanity.exists(`
        Nothing profane on line 1.
        Censoring buttArse on line 2.
        Nothing profane on line 3.
      `)).to.equal(true);
    });

    it('should return false when profanity does not exist', () => {
      expect(customProfanity.exists('Should we censor the word buttocks?')).to.equal(false);
    });

    it('should return true when concatenated profanity exists as a single word', () => {
      expect(customProfanity.exists('buttArse')).to.equal(true);
    });
  });

  describe('censor', () => {
    it('should replace profanity with grawlix in a sentence', () => {
      const censored = profanity.censor('Should we censor the word butt?');
      expect(censored.includes(profanity.options.grawlix)).to.equal(true);
    });

    it('should remove profanity from a sentence', () => {
      const censored = profanity.censor('Should we censor the word butt?');
      expect(profanity.exists(censored)).to.equal(false);
    });

    it('should remove profanity from multiple lines', () => {
      const censored = profanity.censor(`
        Nothing profane on line 1.
        Censoring butt on line 2.
        Nothing profane on line 3.
      `);
      expect(profanity.exists(censored)).to.equal(false);
    });

    it('should not alter sentence without profanity', () => {
      const original = 'Should we censor the word buttocks?';
      const censored = profanity.censor(original);
      expect(censored).to.equal(original);
    });

    it('should remove profanity when profanity exists as a single word', () => {
      const censored = profanity.censor('butt');
      expect(profanity.exists(censored)).to.equal(false);
    });
  });

  describe('removeWords', () => {
    const customProfanity = new Profanity();

    it('should remove a single word from the list of profane words', () => {
      customProfanity.removeWords(['butt']);
      expect(customProfanity.exists('Should we censor the word butt?')).to.equal(false);
    });

    it('should remove mulitple words from the list of profane words', () => {
      customProfanity.removeWords(['butt', 'arse']);
      expect(customProfanity.exists('Should we censor the word butt or arse?')).to.equal(false);
    });
  });

  describe('addWords', () => {
    const customProfanity = new Profanity();

    it('should add a single word to the list of profane words', () => {
      customProfanity.addWords(['aardvark']);
      expect(customProfanity.exists('Should we censor the word aardvark?')).to.equal(true);
    });

    it('should add mulitple words to the list of profane words', () => {
      customProfanity.addWords(['aardvark', 'zebra']);
      expect(customProfanity.exists('Should we censor the word aardvark or zebra?')).to.equal(true);
    });
  });
});
