import { expect } from "chai";
import { profanity, Profanity, CensorType, ProfanityOptions } from "../dist";

describe("ES Module Import", () => {
  it("should import profanity correctly", () => {
    expect(profanity).to.be.an.instanceOf(Profanity);
  });

  it("should import Profanity class correctly", () => {
    expect(Profanity).to.be.a("function");
    const instance = new Profanity();
    expect(instance).to.be.an.instanceOf(Profanity);
  });

  it("should import CensorType enum correctly", () => {
    expect(CensorType).to.be.an("object");
    expect(CensorType.Word).to.exist;
    expect(CensorType.FirstChar).to.exist;
    expect(CensorType.FirstVowel).to.exist;
    expect(CensorType.AllVowels).to.exist;
  });

  it("should import ProfanityOptions class correctly", () => {
    expect(ProfanityOptions).to.be.a("function");
    const options = new ProfanityOptions();
    expect(options).to.be.an.instanceOf(ProfanityOptions);
  });
});
