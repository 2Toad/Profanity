export class ProfanityOptions {
  wholeWord: boolean;

  grawlix: string;

  grawlixChar: string;

  languages: string[];

  constructor(options: Partial<ProfanityOptions> = {}) {
    this.wholeWord = options.wholeWord ?? true;
    this.grawlix = options.grawlix ?? "@#$%&!";
    this.grawlixChar = options.grawlixChar ?? "*";
    this.languages = options.languages ?? ["en"];
  }
}
