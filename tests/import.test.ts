import { describe, it, expect } from "vitest";
import { profanity, Profanity, CensorType, ProfanityOptions } from "../dist";

describe("ES Module Import", () => {
  it("should import profanity correctly", () => {
    expect(profanity).toBeInstanceOf(Profanity);
  });

  it("should import Profanity class correctly", () => {
    expect(typeof Profanity).toBe("function");
    const instance = new Profanity();
    expect(instance).toBeInstanceOf(Profanity);
  });

  it("should import CensorType enum correctly", () => {
    expect(typeof CensorType).toBe("object");
    expect(CensorType.Word).toBeDefined();
    expect(CensorType.FirstChar).toBeDefined();
    expect(CensorType.FirstVowel).toBeDefined();
    expect(CensorType.AllVowels).toBeDefined();
  });

  it("should import ProfanityOptions class correctly", () => {
    expect(typeof ProfanityOptions).toBe("function");
    const options = new ProfanityOptions();
    expect(options).toBeInstanceOf(ProfanityOptions);
  });
});
