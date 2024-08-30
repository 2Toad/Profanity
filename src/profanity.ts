import { ProfanityOptions } from "./profanity-options";
import { List, CensorType } from "./models";
import { escapeRegExp } from "./utils";
import { profaneWords } from "./data";

export class Profanity {
  options: ProfanityOptions;

  whitelist: List;

  private blacklist: List;

  private regex: RegExp;

  constructor(options?: ProfanityOptions | Partial<ProfanityOptions>) {
    this.options = options ? { ...new ProfanityOptions(), ...options } : new ProfanityOptions();
    this.whitelist = new List(() => this.buildRegex());
    this.blacklist = new List(() => this.buildRegex());
    this.blacklist.addWords(profaneWords);
  }

  exists(text: string): boolean {
    this.regex.lastIndex = 0;
    const lowercaseText = text.toLowerCase();

    let match: RegExpExecArray | null;
    do {
      match = this.regex.exec(lowercaseText);
      if (match !== null) {
        const matchStart = match.index;
        const matchEnd = matchStart + match[0].length;

        // Check if the matched word is part of a whitelisted word
        const isWhitelisted = this.whitelist.words.some((whitelistedWord) => {
          const whitelistedIndex = lowercaseText.indexOf(whitelistedWord, Math.max(0, matchStart - whitelistedWord.length + 1));
          if (whitelistedIndex === -1) return false;

          const whitelistedEnd = whitelistedIndex + whitelistedWord.length;

          if (this.options.wholeWord) {
            // For whole word matching, ensure the whitelisted word exactly matches the profane word
            // and is not part of a hyphenated or underscore-separated word
            return (
              matchStart === whitelistedIndex &&
              matchEnd === whitelistedEnd &&
              (matchStart === 0 || !/[\w-_]/.test(lowercaseText[matchStart - 1])) &&
              (matchEnd === lowercaseText.length || !/[\w-_]/.test(lowercaseText[matchEnd]))
            );
          }

          // For partial matching, check if the profane word is contained within the whitelisted word
          return (matchStart >= whitelistedIndex && matchStart < whitelistedEnd) || (matchEnd > whitelistedIndex && matchEnd <= whitelistedEnd);
        });

        if (!isWhitelisted) {
          return true;
        }
      }
    } while (match !== null);

    return false;
  }

  censor(text: string, censorType: CensorType = CensorType.Word): string {
    const lowercaseText = text.toLowerCase();

    switch (censorType) {
      case CensorType.Word:
        return text.replace(this.regex, (match) => {
          const underscore = match.includes("_") ? "_" : "";
          return this.options.grawlix + underscore;
        });
      case CensorType.FirstChar: {
        return this.replaceProfanity(text, lowercaseText, (word) => this.options.grawlixChar + word.slice(1));
      }
      case CensorType.FirstVowel:
      case CensorType.AllVowels: {
        const vowelRegex = new RegExp("[aeiou]", censorType === CensorType.FirstVowel ? "i" : "ig");
        return this.replaceProfanity(text, lowercaseText, (word) => word.replace(vowelRegex, this.options.grawlixChar));
      }
      default:
        throw new Error(`Invalid replacement type: "${censorType}"`);
    }
  }

  private replaceProfanity(text: string, lowercaseText: string, replacer: (word: string) => string): string {
    let result = text;
    let offset = 0;

    this.regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    do {
      match = this.regex.exec(lowercaseText);
      if (match !== null) {
        const matchStart = match.index;
        const matchEnd = matchStart + match[0].length;
        const originalWord = text.slice(matchStart + offset, matchEnd + offset);
        const censoredWord = replacer(originalWord);
        result = result.slice(0, matchStart + offset) + censoredWord + result.slice(matchEnd + offset);
        offset += censoredWord.length - originalWord.length;
      }
    } while (match !== null);

    return result;
  }

  addWords(words: string[]): void {
    this.blacklist.addWords(words);
  }

  removeWords(words: string[]): void {
    this.blacklist.removeWords(words.map((word) => word.toLowerCase()));
  }

  private buildRegex(): void {
    const escapedBlacklistWords = this.blacklist.words.map(escapeRegExp);
    const profanityPattern = `${this.options.wholeWord ? "(?:\\b|_)" : ""}(${escapedBlacklistWords.join("|")})${this.options.wholeWord ? "(?:\\b|_)" : ""}`;
    this.regex = new RegExp(profanityPattern, "gi");
  }
}

export const profanity = new Profanity();
