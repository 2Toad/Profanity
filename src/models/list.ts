export class List {
  words: string[];

  onListChanged: () => void;

  get empty(): boolean {
    return !this.words.length;
  }

  constructor(onListChanged: () => void) {
    this.onListChanged = onListChanged;
    this.words = [];
  }

  removeWords(words: string[]): void {
    this.words = this.words.filter((x) => !words.includes(x));
    this.onListChanged();
  }

  addWords(words: readonly string[] | string[]): void {
    this.words = this.words.concat(words.map((word: string) => word.toLowerCase()));
    this.onListChanged();
  }
}
