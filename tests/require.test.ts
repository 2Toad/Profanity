import { describe, it, expect } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const dist = require("../dist");

describe("CommonJS Require", () => {
  it("should require profanity correctly", () => {
    expect(dist.profanity).toBeInstanceOf(dist.Profanity);
  });

  it("should require Profanity class correctly", () => {
    expect(typeof dist.Profanity).toBe("function");
    const instance = new dist.Profanity();
    expect(instance).toBeInstanceOf(dist.Profanity);
  });

  it("should require CensorType enum correctly", () => {
    expect(typeof dist.CensorType).toBe("object");
    expect(dist.CensorType.Word).toBeDefined();
    expect(dist.CensorType.FirstChar).toBeDefined();
    expect(dist.CensorType.FirstVowel).toBeDefined();
    expect(dist.CensorType.AllVowels).toBeDefined();
  });

  it("should require ProfanityOptions class correctly", () => {
    expect(typeof dist.ProfanityOptions).toBe("function");
    const options = new dist.ProfanityOptions();
    expect(options).toBeInstanceOf(dist.ProfanityOptions);
  });
});
