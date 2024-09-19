export class List {
  words: Set<string>;

  onListChanged: () => void;

  get empty(): boolean {
    return this.words.size === 0;
  }

  constructor(onListChanged: () => void) {
    this.onListChanged = onListChanged;
    this.words = new Set<string>();
  }

  removeWords(words: string[]): void {
    words.forEach((word) => this.words.delete(word));
    this.onListChanged();
  }

  addWords(words: readonly string[] | string[]): void {
    words.forEach((word) => this.words.add(word.toLowerCase()));
    this.onListChanged();
  }
}
