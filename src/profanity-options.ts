export class ProfanityOptions {
  wholeWord: boolean;

  grawlix: string;

  grawlixChar: string;

  languages: string[];

  unicodeWordBoundaries: boolean;

  constructor(options: Partial<ProfanityOptions> = {}) {
    this.wholeWord = options.wholeWord ?? true;
    this.grawlix = options.grawlix ?? "@#$%&!";
    this.grawlixChar = options.grawlixChar ?? "*";
    this.languages = options.languages ?? ["en"];
    this.unicodeWordBoundaries = options.unicodeWordBoundaries ?? false;
  }
}
