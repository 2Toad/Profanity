import { describe, it, expect } from "vitest";

import { Profanity } from "../src";

describe("Unicode word boundaries (wholeWord=true)", () => {
  it("should not flag/censor substrings across diacritics: vehículo/horário", () => {
    const profanity = new Profanity({
      languages: ["es"],
      grawlix: "*****",
      wholeWord: true,
      unicodeWordBoundaries: true,
    });

    const input = "vehículo vehiculo horário horario";

    expect(profanity.exists(input)).toBe(false);
    expect(profanity.censor(input)).toBe(input);
  });

  it("should not flag NFD decomposed diacritics", () => {
    const profanity = new Profanity({ languages: ["es"], wholeWord: true, unicodeWordBoundaries: true });
    const input = "vehi\u0301culo hora\u0301rio"; // vehículo / horário (NFD)
    expect(profanity.exists(input)).toBe(false);
    expect(profanity.censor(input)).toBe(input);
  });

  it("should treat curly quotes and NBSP as boundaries", () => {
    const profanity = new Profanity({ languages: ["en"], wholeWord: true, unicodeWordBoundaries: true });
    expect(profanity.exists("\u201Cbutt\u201D")).toBe(true); // "butt"
    expect(profanity.exists("\u00A0butt\u00A0")).toBe(true); // NBSP butt NBSP
  });

  it("should detect across Unicode hyphens/dashes", () => {
    const profanity = new Profanity({ languages: ["en"], wholeWord: true, unicodeWordBoundaries: true });
    expect(profanity.exists("butt\u2010head")).toBe(true); // hyphen
    expect(profanity.exists("butt\u2011head")).toBe(true); // non-breaking hyphen
    expect(profanity.exists("butt\u2013head")).toBe(true); // en dash
  });

  it("should not flag uppercase diacritics inside words", () => {
    const profanity = new Profanity({ languages: ["es"], wholeWord: true, unicodeWordBoundaries: true });
    expect(profanity.exists("VEHÍCULO")).toBe(false);
  });

  it("should not match 'cul' inside 'véhicule' (fr)", () => {
    const profanity = new Profanity({ languages: ["fr"], wholeWord: true, unicodeWordBoundaries: true });
    expect(profanity.exists("véhicule")).toBe(false);
  });
});

describe("Unicode option interaction with wholeWord=false", () => {
  it("should detect substrings regardless of unicodeWordBoundaries (es)", () => {
    const input = "vehículo";
    const pAscii = new Profanity({ languages: ["es"], wholeWord: false, grawlix: "*****", unicodeWordBoundaries: false });
    const pUnicode = new Profanity({ languages: ["es"], wholeWord: false, grawlix: "*****", unicodeWordBoundaries: true });
    expect(pAscii.exists(input)).toBe(true);
    expect(pAscii.censor(input)).toBe("vehí*****");
    expect(pUnicode.exists(input)).toBe(true);
    expect(pUnicode.censor(input)).toBe("vehí*****");
  });

  it("should detect substrings regardless of unicodeWordBoundaries (fr)", () => {
    const input = "véhicule";
    const pAscii = new Profanity({ languages: ["fr"], wholeWord: false, unicodeWordBoundaries: false });
    const pUnicode = new Profanity({ languages: ["fr"], wholeWord: false, unicodeWordBoundaries: true });
    expect(pAscii.exists(input)).toBe(true); // matches 'cul'
    expect(pUnicode.exists(input)).toBe(true); // matches 'cul'
  });
});

describe("Unicode off with wholeWord=true (legacy ASCII boundaries)", () => {
  it("should match 'culo' inside 'vehículo' when unicodeWordBoundaries=false", () => {
    const profanity = new Profanity({ languages: ["es"], wholeWord: true, grawlix: "*****", unicodeWordBoundaries: false });
    expect(profanity.exists("vehículo")).toBe(true);
    expect(profanity.censor("vehículo")).toBe("vehí*****");
  });

  it("should not match 'cul' inside 'véhicule' even when unicodeWordBoundaries=false", () => {
    const profanity = new Profanity({ languages: ["fr"], wholeWord: true, unicodeWordBoundaries: false });
    expect(profanity.exists("véhicule")).toBe(false);
  });
});
