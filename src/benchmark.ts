// eslint-disable-next-line import/no-extraneous-dependencies
import * as Benchmark from "benchmark";
import { Profanity, CensorType } from ".";

const suite = new Benchmark.Suite();

// Helper function to create a large string
const createLargeString = (size: number, profanity: boolean): string => {
  const words = profanity ? ["hello", "world", "fuck", "shit", "damn", "ass"] : ["hello", "world", "foo", "bar", "baz", "qux"];
  return Array(size)
    .fill("")
    .map(() => words[Math.floor(Math.random() * words.length)])
    .join(" ");
};

// Test scenarios
const smallCleanText = "Hello world, this is a clean text.";
const smallProfaneText = "Hello world, this is a fucking profane text.";
const largeCleanText = createLargeString(1000, false);
const largeProfaneText = createLargeString(1000, true);

// Create Profanity instances for different scenarios
const defaultProfanity = new Profanity();
const partialMatchProfanity = new Profanity({ wholeWord: false });

// Benchmark exists() function
suite
  .add("exists() - small clean text", () => {
    defaultProfanity.exists(smallCleanText);
  })
  .add("exists() - small profane text", () => {
    defaultProfanity.exists(smallProfaneText);
  })
  .add("exists() - large clean text", () => {
    defaultProfanity.exists(largeCleanText);
  })
  .add("exists() - large profane text", () => {
    defaultProfanity.exists(largeProfaneText);
  })
  .add("exists() - partial match, small profane text", () => {
    partialMatchProfanity.exists(smallProfaneText);
  })

  // Benchmark censor() function
  .add("censor() - Word, small profane text", () => {
    defaultProfanity.censor(smallProfaneText, CensorType.Word);
  })
  .add("censor() - FirstChar, small profane text", () => {
    defaultProfanity.censor(smallProfaneText, CensorType.FirstChar);
  })
  .add("censor() - FirstVowel, small profane text", () => {
    defaultProfanity.censor(smallProfaneText, CensorType.FirstVowel);
  })
  .add("censor() - AllVowels, small profane text", () => {
    defaultProfanity.censor(smallProfaneText, CensorType.AllVowels);
  })
  .add("censor() - Word, large profane text", () => {
    defaultProfanity.censor(largeProfaneText, CensorType.Word);
  })
  .add("censor() - partial match, Word, small profane text", () => {
    partialMatchProfanity.censor(smallProfaneText, CensorType.Word);
  })

  // Run the benchmark
  .on("cycle", (event: Benchmark.Event) => {
    console.log(String(event.target));
  })
  .on("complete", function (this: Benchmark.Suite) {
    console.log(`Fastest is ${this.filter("fastest").map("name")}`);
  })
  .run({ async: true });
