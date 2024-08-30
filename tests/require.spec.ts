const { expect } = require("chai");
const { profanity, Profanity, CensorType, ProfanityOptions } = require("../dist");

describe("CommonJS Require", () => {
  it("should require profanity correctly", () => {
    expect(profanity).to.be.an.instanceOf(Profanity);
  });

  it("should require Profanity class correctly", () => {
    expect(Profanity).to.be.a("function");
    const instance = new Profanity();
    expect(instance).to.be.an.instanceOf(Profanity);
  });

  it("should require CensorType enum correctly", () => {
    expect(CensorType).to.be.an("object");
    expect(CensorType.Word).to.exist;
    expect(CensorType.FirstChar).to.exist;
    expect(CensorType.FirstVowel).to.exist;
    expect(CensorType.AllVowels).to.exist;
  });

  it("should require ProfanityOptions class correctly", () => {
    expect(ProfanityOptions).to.be.a("function");
    const options = new ProfanityOptions();
    expect(options).to.be.an.instanceOf(ProfanityOptions);
  });
});
