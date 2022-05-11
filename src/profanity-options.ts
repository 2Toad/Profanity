export class ProfanityOptions {
  wholeWord: boolean;
  grawlix: string;
  grawlixChar: string;

  constructor() {
    this.wholeWord = true;
    this.grawlix = "@#$%&!";
    this.grawlixChar = "*";
  }
}
