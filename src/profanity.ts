import { ProfanityOptions } from "./profanity-options";
import { List, CensorType } from "./models";
import { escapeRegExp } from "./utils";
import { profaneWords } from "./data";

export class Profanity {
  options: ProfanityOptions;

  whitelist: List;

  private blacklist: List;

  private regexes: Map<string, RegExp>;

  constructor(options?: ProfanityOptions | Partial<ProfanityOptions>) {
    this.options = options ? { ...new ProfanityOptions(), ...options } : new ProfanityOptions();
    this.whitelist = new List(() => this.clearRegexes());
    this.blacklist = new List(() => this.clearRegexes());
    this.regexes = new Map<string, RegExp>();
  }

  exists(text: string, languages?: string[]): boolean {
    if (typeof text !== "string") {
      return false;
    }

    const regex = this.getRegex(this.resolveLanguages(languages));
    regex.lastIndex = 0;

    const lowercaseText = text.toLowerCase();

    let match: RegExpExecArray | null;
    do {
      match = regex.exec(lowercaseText);
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
              // eslint-disable-next-line security/detect-object-injection
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

  censor(text: string, censorType: CensorType = CensorType.Word, languages?: string[]): string {
    if (typeof text !== "string") {
      return text;
    }

    const regex = this.getRegex(this.resolveLanguages(languages));
    regex.lastIndex = 0;

    const lowercaseText = text.toLowerCase();

    switch (censorType) {
      case CensorType.Word:
        return text.replace(regex, (match) => {
          const underscore = match.includes("_") ? "_" : "";
          return this.options.grawlix + underscore;
        });
      case CensorType.FirstChar: {
        return this.replaceProfanity(text, lowercaseText, (word) => this.options.grawlixChar + word.slice(1), regex);
      }
      case CensorType.FirstVowel:
      case CensorType.AllVowels: {
        const vowelRegex = new RegExp("[aeiou]", censorType === CensorType.FirstVowel ? "i" : "ig");
        return this.replaceProfanity(text, lowercaseText, (word) => word.replace(vowelRegex, this.options.grawlixChar), regex);
      }
      default:
        throw new Error(`Invalid replacement type: "${censorType}"`);
    }
  }

  private replaceProfanity(text: string, lowercaseText: string, replacer: (word: string) => string, regex: RegExp): string {
    let result = text;
    let offset = 0;

    let match: RegExpExecArray | null;
    do {
      match = regex.exec(lowercaseText);
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
      console.info("Regex cache hit for", regexKey);
      return this.regexes.get(regexKey)!;
    }

    const allWords = uniqueLanguages.flatMap((language) => {
      const words = profaneWords.get(language);
      if (!words) {
        throw new Error(`Invalid language: "${language}"`);
      }
      return words;
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
