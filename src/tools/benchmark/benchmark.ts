/**
 * This script benchmarks the performance of the Profanity filter.
 *
 * Usage:
 * - To run the benchmark, execute: `npm run benchmark`
 *
 * Benchmarking:
 * - The benchmark script uses test data stored in `test-data.json`.
 * - The data is versioned so we can use the same test data across multiple benchmarking sessions.
 * - If you want to generate new random test data, increment TEST_VERSION before running the benchmark.
 */

import * as fs from "fs";
import * as path from "path";
import { Suite, Event } from "benchmark";

import { VersionData, TestData } from "./benchmark-interfaces";
import { Profanity, CensorType } from "../../";

const TEST_VERSION: number = 1;

const suite: Suite = new Suite();
const testDataFile: string = path.join(__dirname, "test-data.json");

const createLargeString = (size: number, profanity: boolean): string => {
  const words = profanity ? ["hello", "world", "arse", "shite", "damn", "bugger"] : ["hello", "world", "foo", "bar", "baz", "qux"];
  return Array.from({ length: size }, () => words[Math.floor(Math.random() * words.length)]).join(" ");
};

const generateTestData = () => ({
  smallCleanText: "Hello world, this is a clean text.",
  smallProfaneText: "Hello world, this is a damn profane text.",
  largeCleanText: createLargeString(1000, false),
  largeProfaneText: createLargeString(1000, true),
});

let fileData: TestData;
try {
  fileData = JSON.parse(fs.readFileSync(testDataFile, "utf-8"));
} catch (error) {
  console.error("Error reading test data file:", error);
  process.exit(1);
}

const testData =
  fileData.versions.find((data: VersionData) => data.version === TEST_VERSION) ||
  (() => {
    const newData = generateTestData();
    fileData.versions.push({ version: TEST_VERSION, ...newData });
    try {
      fs.writeFileSync(testDataFile, JSON.stringify(fileData, null, 2));
      console.log("Generated new test data");
    } catch (error) {
      console.error("Error writing test data file:", error);
      process.exit(1);
    }
    return newData;
  })();

console.log(`Using test data: v${TEST_VERSION}`);
const { smallCleanText, smallProfaneText, largeCleanText, largeProfaneText } = testData;

// Create Profanity instances for different scenarios
const defaultProfanity = new Profanity();
const partialMatchProfanity = new Profanity({ wholeWord: false });

// Pre-cache regexes
defaultProfanity.exists("foo");
partialMatchProfanity.exists("bar");

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
  .on("cycle", (event: Event) => {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log(`Fastest: ${this.filter("fastest").map("name")[0]}`);
  })
  .run({ async: true });
