import { ProfanityOptions } from "./profanity-options";
import { List, CensorType } from "./models";
import { escapeRegExp } from "./utils";
import { profaneWords } from "./data";

export class Profanity {
  options: ProfanityOptions;

  whitelist: List;

  private blacklist: List;

  private removed: List;

  private regexes: Map<string, RegExp>;

  constructor(options?: ProfanityOptions | Partial<ProfanityOptions>) {
    this.options = options ? { ...new ProfanityOptions(), ...options } : new ProfanityOptions();

    this.whitelist = new List(() => this.clearRegexes());
    this.blacklist = new List(() => this.clearRegexes());
    this.removed = new List(() => this.clearRegexes());
    this.regexes = new Map<string, RegExp>();
  }

  private isWhitelisted(matchStart: number, matchEnd: number, text: string): boolean {
    for (const whitelistedWord of this.whitelist.words) {
      const whitelistedIndex = text.indexOf(whitelistedWord, Math.max(0, matchStart - whitelistedWord.length + 1));
      if (whitelistedIndex !== -1) {
        const whitelistedEnd = whitelistedIndex + whitelistedWord.length;

        if (this.options.wholeWord) {
          if (
            matchStart === whitelistedIndex &&
            matchEnd === whitelistedEnd &&
            (matchStart === 0 || !/[\w-_]/.test(text[matchStart - 1])) &&
            (matchEnd === text.length || !/[\w-_]/.test(text[matchEnd]))
          ) {
            return true;
          }
        } else {
          if (
            (matchStart >= whitelistedIndex && matchStart < whitelistedEnd) ||
            (matchEnd > whitelistedIndex && matchEnd <= whitelistedEnd) ||
            (whitelistedIndex >= matchStart && whitelistedEnd <= matchEnd)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  exists(text: string, languages?: string[]): boolean {
    if (typeof text !== "string") {
      return false;
    }

    const regex = this.getRegex(this.resolveLanguages(languages));
    regex.lastIndex = 0;

    const lowercaseText = text.toLowerCase();

    let match: RegExpExecArray | null;
    while ((match = regex.exec(lowercaseText)) !== null) {
      const matchStart = match.index;
      const matchEnd = matchStart + match[0].length;

      if (!this.isWhitelisted(matchStart, matchEnd, lowercaseText)) {
        return true;
      }
    }

    return false;
  }

  censor(text: string, censorType: CensorType = CensorType.Word, languages?: string[]): string {
    if (typeof text !== "string") {
      return text;
    }

    const regex = this.getRegex(this.resolveLanguages(languages));
    regex.lastIndex = 0;

    const lowercaseText = text.toLowerCase();

    return this.replaceProfanity(
      text,
      lowercaseText,
      (word, start, end) => {
        if (this.isWhitelisted(start, end, lowercaseText)) {
          return word;
        }
        switch (censorType) {
          case CensorType.Word: {
            const underscore = word.includes("_") ? "_" : "";
            return this.options.grawlix + underscore;
          }
          case CensorType.FirstChar:
            return this.options.grawlixChar + word.slice(1);
          case CensorType.FirstVowel:
          case CensorType.AllVowels: {
            const vowelRegex = new RegExp("[aeiou]", censorType === CensorType.FirstVowel ? "i" : "ig");
            return word.replace(vowelRegex, this.options.grawlixChar);
          }
          default:
            throw new Error(`Invalid replacement type: "${censorType}"`);
        }
      },
      regex,
    );
  }

  private replaceProfanity(
    text: string,
    lowercaseText: string,
    replacer: (word: string, start: number, end: number) => string,
    regex: RegExp,
  ): string {
    let result = text;
    let offset = 0;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(lowercaseText)) !== null) {
      const matchStart = match.index;
      const matchEnd = matchStart + match[0].length;
      const originalWord = text.slice(matchStart + offset, matchEnd + offset);
      const censoredWord = replacer(originalWord, matchStart, matchEnd);
      result = result.slice(0, matchStart + offset) + censoredWord + result.slice(matchEnd + offset);
      offset += censoredWord.length - originalWord.length;
    }

    return result;
  }

  addWords(words: string[]): void {
    const removedWords: string[] = [];
    const blacklistWords: string[] = [];

    words.forEach((word) => {
      const lowerCaseWord = word.toLowerCase();
      if (this.removed.words.has(lowerCaseWord)) {
        removedWords.push(lowerCaseWord);
      } else {
        blacklistWords.push(lowerCaseWord);
      }
    });

    if (removedWords.length) {
      this.removed.removeWords(removedWords);
    }
    if (blacklistWords.length) {
      this.blacklist.addWords(blacklistWords);
    }
  }

  removeWords(words: string[]): void {
    const blacklistedWords: string[] = [];
    const removeWords: string[] = [];

    words.forEach((word) => {
      const lowerCaseWord = word.toLowerCase();
      if (this.blacklist.words.has(lowerCaseWord)) {
        blacklistedWords.push(lowerCaseWord);
      } else {
        removeWords.push(lowerCaseWord);
      }
    });

    if (blacklistedWords.length) {
      this.blacklist.removeWords(blacklistedWords);
    }
    if (removeWords.length) {
      this.removed.addWords(removeWords);
    }
  }

  /**
   * Determines the list of languages to use, either from the provided list or falling back to default languages.
   * @param languages - An optional list of languages to use.
   * @returns The list of languages to be used.
   */
  private resolveLanguages(languages?: string[]): string[] {
    return languages?.length ? languages : this.options.languages;
  }

  /**
   * Retrieves or constructs a regular expression for detecting profanity in the specified languages.
   * This method first checks if a regex for the given combination of languages already exists in the cache.
   *
   * @param languages - An array of languages to include in the regex.
   * @throws {Error} If no languages are provided.
   * @returns A RegExp object for detecting profanity in the specified languages.
   */
  private getRegex(languages: string[]): RegExp {
    if (!languages.length) {
      throw new Error("At least one language must be provided");
    }

    const uniqueLanguages = [...new Set(languages.map((language) => language.trim().toLowerCase()))];

    const regexKey = uniqueLanguages.sort().join(",");
    if (this.regexes.has(regexKey)) {
      return this.regexes.get(regexKey)!;
    }

    const allWords = uniqueLanguages.flatMap((language) => {
      const words = profaneWords.get(language);
      if (!words) {
        throw new Error(`Invalid language: "${language}"`);
      }
      return words.filter((word) => !this.removed.words.has(word));
    });

    const regex = this.buildRegex(allWords);
    this.regexes.set(regexKey, regex);
    return regex;
  }

  /**
   * Constructs a regular expression for detecting profane words.
   *
   * @param words - An array of profane words to be included in the regex.
   * @returns A RegExp that matches any of the profane or blacklisted words.
   */
  private buildRegex(words: string[]): RegExp {
    const allProfaneWords = [...words, ...this.blacklist.words];
    const escapedProfaneWords = allProfaneWords.map(escapeRegExp);
    const profanityPattern = `${this.options.wholeWord ? "(?:\\b|_)" : ""}(${escapedProfaneWords.join("|")})${this.options.wholeWord ? "(?:\\b|_)" : ""}`;
    // eslint-disable-next-line security/detect-non-literal-regexp
    return new RegExp(profanityPattern, "gi");
  }

  /**
   * Clear the cached regexes.
   */
  private clearRegexes(): void {
    this.regexes.clear();
  }
}

export const profanity = new Profanity();
