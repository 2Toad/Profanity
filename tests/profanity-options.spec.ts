import { expect } from "chai";

import { ProfanityOptions } from "../src";

describe("ProfanityOptions", () => {
  it("should create ProfanityOptions with default values", () => {
    const options = new ProfanityOptions();
    expect(options.wholeWord).to.be.true;
    expect(options.grawlix).to.equal("@#$%&!");
    expect(options.grawlixChar).to.equal("*");
  });

  it("should create ProfanityOptions with custom values", () => {
    const options = new ProfanityOptions();
    options.wholeWord = false;
    options.grawlix = "***";
    options.grawlixChar = "#";
    expect(options.wholeWord).to.be.false;
    expect(options.grawlix).to.equal("***");
    expect(options.grawlixChar).to.equal("#");
  });

  it("should create ProfanityOptions with all partial custom values", () => {
    const options = new ProfanityOptions({
      wholeWord: false,
      grawlix: "***",
      grawlixChar: "#",
    });
    expect(options.wholeWord).to.be.false;
    expect(options.grawlix).to.equal("***");
    expect(options.grawlixChar).to.equal("#");
  });

  it("should create ProfanityOptions with some partial custom values", () => {
    const options = new ProfanityOptions({
      wholeWord: false,
    });
    expect(options.wholeWord).to.be.false;
    expect(options.grawlix).to.equal("@#$%&!");
    expect(options.grawlixChar).to.equal("*");
  });

  it("should default unicodeWordBoundaries to false", () => {
    const options = new ProfanityOptions();
    expect(options.unicodeWordBoundaries).to.be.false;
  });

  it("should allow setting unicodeWordBoundaries via constructor", () => {
    const options = new ProfanityOptions({ unicodeWordBoundaries: true });
    expect(options.unicodeWordBoundaries).to.be.true;
  });
});
