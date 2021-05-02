import { resolve } from "path";

import { ProfanityOptions } from "./profanity-options";
import { List } from "./list";

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class Profanity {
  options: ProfanityOptions;
  whitelist: List;
  private blacklist: List;
  private regex: RegExp;

  constructor(options?: ProfanityOptions) {
    this.options = options || new ProfanityOptions();

    this.whitelist = new List(() => this.buildRegex());
    this.blacklist = new List(() => this.buildRegex());

    this.blacklist.loadFile(resolve(__dirname, "words.txt"));
  }

  exists(text: string): boolean {
    this.regex.lastIndex = 0;
    return this.regex.test(text);
  }

  censor(text: string): string {
    return text.replace(this.regex, this.options.grawlix);
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
    const whitelistPattern = this.whitelist.empty ? "" : `(?!${escapedWhitelistWords.join("|")})`;
    this.regex = new RegExp(whitelistPattern + blacklistPattern, "ig");
  }
}

export const profanity = new Profanity();
export default profanity;
