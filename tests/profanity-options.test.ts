import { describe, it, expect } from "vitest";

import { ProfanityOptions } from "../src";

describe("ProfanityOptions", () => {
  it("should create ProfanityOptions with default values", () => {
    const options = new ProfanityOptions();
    expect(options.wholeWord).toBe(true);
    expect(options.grawlix).toBe("@#$%&!");
    expect(options.grawlixChar).toBe("*");
  });

  it("should create ProfanityOptions with custom values", () => {
    const options = new ProfanityOptions();
    options.wholeWord = false;
    options.grawlix = "***";
    options.grawlixChar = "#";
    expect(options.wholeWord).toBe(false);
    expect(options.grawlix).toBe("***");
    expect(options.grawlixChar).toBe("#");
  });

  it("should create ProfanityOptions with all partial custom values", () => {
    const options = new ProfanityOptions({
      wholeWord: false,
      grawlix: "***",
      grawlixChar: "#",
    });
    expect(options.wholeWord).toBe(false);
    expect(options.grawlix).toBe("***");
    expect(options.grawlixChar).toBe("#");
  });

  it("should create ProfanityOptions with some partial custom values", () => {
    const options = new ProfanityOptions({
      wholeWord: false,
    });
    expect(options.wholeWord).toBe(false);
    expect(options.grawlix).toBe("@#$%&!");
    expect(options.grawlixChar).toBe("*");
  });

  it("should default unicodeWordBoundaries to false", () => {
    const options = new ProfanityOptions();
    expect(options.unicodeWordBoundaries).toBe(false);
  });

  it("should allow setting unicodeWordBoundaries via constructor", () => {
    const options = new ProfanityOptions({ unicodeWordBoundaries: true });
    expect(options.unicodeWordBoundaries).toBe(true);
  });
});
