import { readFileSync } from "fs";

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

  loadFile(filename: string): void {
    const file = readFileSync(filename, "utf8");
    this.words = file.split(/[\r\n]+/).filter((x) => x);
    this.onListChanged();
  }

  removeWords(words: string[]): void {
    this.words = this.words.filter((x) => !words.includes(x));
    this.onListChanged();
  }

  addWords(words: string[]): void {
    this.words = this.words.concat(words);
    this.onListChanged();
  }
}
