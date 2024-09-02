/**
 * This script benchmarks the performance of the Profanity filter.
 *
 * Usage:
 * - To run the benchmark, execute: `npm run benchmark`
 *
 * Benchmarking:
 * - The benchmark script uses test data stored in `src/benchmark/test-data.json`.
 * - If you want to use new random test data, delete the `test-data.json` file before running the benchmark.
 * - If you want to use the same test data across multiple benchmarking sessions, keep the `test-data.json` file.
 */

import * as fs from "fs";
import * as Benchmark from "benchmark";
import { Profanity, CensorType } from "..";

const suite = new Benchmark.Suite();
const testDataFile = "src/benchmark/test-data.json";

// Helper function to create a large string
const createLargeString = (size: number, profanity: boolean): string => {
  const words = profanity ? ["hello", "world", "arse", "shite", "damn", "bugger"] : ["hello", "world", "foo", "bar", "baz", "qux"];
  return Array(size)
    .fill("")
    .map(() => words[Math.floor(Math.random() * words.length)])
    .join(" ");
};

// Function to generate test data
const generateTestData = () => {
  return {
    smallCleanText: "Hello world, this is a clean text.",
    smallProfaneText: "Hello world, this is a damn profane text.",
    largeCleanText: createLargeString(1000, false),
    largeProfaneText: createLargeString(1000, true),
  };
};

// Load or generate test data
let testData;
if (fs.existsSync(testDataFile)) {
  testData = JSON.parse(fs.readFileSync(testDataFile, "utf-8"));
  console.log("Loaded test data from file");
} else {
  testData = generateTestData();
  fs.writeFileSync(testDataFile, JSON.stringify(testData, null, 2));
  console.log("Generated and saved test data to file");
}

// Destructure test data
const { smallCleanText, smallProfaneText, largeCleanText, largeProfaneText } = testData;

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
