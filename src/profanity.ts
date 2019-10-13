import { resolve } from 'path';
import { readFileSync } from 'fs';

import { ProfanityOptions } from './profanity-options';

export class Profanity {
  options: ProfanityOptions;
  words: string[];
  regEx: RegExp;

  constructor(options?: ProfanityOptions) {
    this.options = options || new ProfanityOptions();

    const file = readFileSync(resolve(__dirname, 'words.txt'), 'utf8');
    this.words = file.split('\n');

    this.compileRegEx();
  }

  exists(text: string): boolean {
    return this.regEx.test(text);
  }

  censor(text: string): string {
    return text.replace(this.regEx, this.options.grawlix);
  }

  removeWords(words: string[]): void {
    this.words = this.words.filter(x => !words.includes(x));
    this.compileRegEx();
  }

  addWords(words: string[]): void {
    this.words = this.words.concat(words);
    this.compileRegEx();
  }

  private compileRegEx(): void {
    const pattern = `${this.options.wholeWord ? '\\b' : ''}(${this.words.join('|')})${this.options.wholeWord ? '\\b' : ''}`;
    this.regEx = new RegExp(pattern, 'gi');
  }
}

export const profanity = new Profanity();
export default profanity;
