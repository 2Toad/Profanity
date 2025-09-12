import { expect } from "chai";

import { Profanity } from "../src";

describe("Unicode word boundaries (wholeWord=true)", () => {
  it("should not flag/censor substrings across diacritics: vehículo/horário", () => {
    const profanity = new Profanity({
      languages: ["es"],
      grawlix: "*****",
      wholeWord: true,
    });

    const input = "vehículo vehiculo horário horario";

    expect(profanity.exists(input)).to.be.false;
    expect(profanity.censor(input)).to.equal(input);
  });

  it("should not flag NFD decomposed diacritics", () => {
    const profanity = new Profanity({ languages: ["es"], wholeWord: true });
    const input = "vehi\u0301culo hora\u0301rio"; // vehículo / horário (NFD)
    expect(profanity.exists(input)).to.be.false;
    expect(profanity.censor(input)).to.equal(input);
  });

  it("should treat curly quotes and NBSP as boundaries", () => {
    const profanity = new Profanity({ languages: ["en"], wholeWord: true });
    expect(profanity.exists("\u201Cbutt\u201D")).to.be.true; // “butt”
    expect(profanity.exists("\u00A0butt\u00A0")).to.be.true; // NBSP butt NBSP
  });

  it("should detect across Unicode hyphens/dashes", () => {
    const profanity = new Profanity({ languages: ["en"], wholeWord: true });
    expect(profanity.exists("butt\u2010head")).to.be.true; // hyphen
    expect(profanity.exists("butt\u2011head")).to.be.true; // non-breaking hyphen
    expect(profanity.exists("butt\u2013head")).to.be.true; // en dash
  });

  it("should not flag uppercase diacritics inside words", () => {
    const profanity = new Profanity({ languages: ["es"], wholeWord: true });
    expect(profanity.exists("VEHÍCULO")).to.be.false;
  });

  it("should not match 'cul' inside 'véhicule' (fr)", () => {
    const profanity = new Profanity({ languages: ["fr"], wholeWord: true });
    expect(profanity.exists("véhicule")).to.be.false;
  });
});
