import { ProfanityOptions } from "./profanity-options";
import { List, CensorType } from "./models";
import { escapeRegExp } from "./utils/misc";
import profaneWords from "./data/profane-words";

export class Profanity {
  options: ProfanityOptions;

  whitelist: List;

  private blacklist: List;

  private regex: RegExp;

  constructor(options?: ProfanityOptions) {
    this.options = options || new ProfanityOptions();

    this.whitelist = new List(() => this.buildRegex());
    this.blacklist = new List(() => this.buildRegex());

    this.blacklist.addWords(profaneWords);
  }

  exists(text: string): boolean {
    this.regex.lastIndex = 0;
    return this.regex.test(text);
  }

  censor(text: string, censorType: CensorType = CensorType.Word): string {
    switch (censorType) {
      case CensorType.Word:
        return text.replace(this.regex, this.options.grawlix);
      case CensorType.FirstChar: {
        let output = text;

        Array.from(text.matchAll(this.regex)).forEach((match) => {
          const word = match[0];
          const grawlix = this.options.grawlixChar + word.slice(1, word.length);
          output = output.replace(word, grawlix);
        });
        return output;
      }
      case CensorType.FirstVowel:
      case CensorType.AllVowels: {
        const regex = new RegExp("[aeiou]", censorType === CensorType.FirstVowel ? "i" : "ig");
        let output = text;
        Array.from(text.matchAll(this.regex)).forEach((match) => {
          const word = match[0];
          const grawlix = word.replace(regex, this.options.grawlixChar);
          output = output.replace(word, grawlix);
        });
        return output;
      }
      default:
        throw new Error(`Invalid replacement type: "${censorType}"`);
    }
  }

  addWords(words: string[]): void {
    this.blacklist.addWords(words);
  }

  removeWords(words: string[]): void {
    this.blacklist.removeWords(words);
  }

  private buildRegex(): void {
    const escapedBlacklistWords = this.blacklist.words.map(escapeRegExp);
    const escapedWhitelistWords = this.whitelist.words.map(escapeRegExp);

    const blacklistPattern = `${this.options.wholeWord ? "\\b" : ""}(${escapedBlacklistWords.join("|")})${this.options.wholeWord ? "\\b" : ""}`;
    const whitelistPattern = this.whitelist.empty ? "" : `\\b(?!${escapedWhitelistWords.join("|")})\\b`;
    this.regex = new RegExp(whitelistPattern + blacklistPattern, "ig");
  }
}

export const profanity = new Profanity();
export default profanity;
