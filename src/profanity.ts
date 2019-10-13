import { resolve } from 'path';
import { readFileSync } from 'fs';

import { ProfanityOptions } from './profanity-options';

export class Profanity {
  private regex: RegExp;
  words: string[];
  options: ProfanityOptions;

  constructor(options?: ProfanityOptions) {
    this.options = options || new ProfanityOptions();

    const file = readFileSync(resolve(__dirname, 'words.txt'), 'utf8');
    this.words = file.split('\n');

    this.buildRegex();
  }

  exists(text: string): boolean {
    return this.regex.test(text);
  }

  censor(text: string): string {
    return text.replace(this.regex, this.options.grawlix);
  }

  removeWords(words: string[]): void {
    this.words = this.words.filter(x => !words.includes(x));
    this.buildRegex();
  }

  addWords(words: string[]): void {
    this.words = this.words.concat(words);
    this.buildRegex();
  }

  private buildRegex(): void {
    const pattern = `${this.options.wholeWord ? '\\b' : ''}(${this.words.join('|')})${this.options.wholeWord ? '\\b' : ''}`;
    this.regex = new RegExp(pattern, 'i');
  }
}

export const profanity = new Profanity();
export default profanity;
