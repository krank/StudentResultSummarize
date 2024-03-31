import { mulberry32 } from "./random";

export function GenerateRandomWord(seed: number, length: number): string
{
  let parts = ["ing", "er", "a", "ly", "ed", "i", "es", "re", "tion", "in", "e", "con", "y", "ter", "ex", "al", "de", "com", "o", "di", "en", "an", "ty", "ry", "u", "ti", "ri", "be", "per", "to", "pro", "ac", "ad", "ar", "ers", "ment", "or", "tions", "ble", "der", "ma", "na", "si", "un", "at", "dis", "ca", "cal", "man", "ap", "po", "sion", "vi", "el", "est", "la", "lar", "pa", "ture", "for", "is", "mer", "pe", "ra", "so", "ta", "as", "col", "fi", "ful", "ger", "low", "ni", "par", "son", "tle", "day", "ny", "pen", "pre", "tive", "car", "ci", "mo", "on", "ous", "pi", "se", "ten", "tor", "ver", "ber", "can", "dy", "et", "it", "mu", "no", "ple", "cu"];

  let word: string = "";

  let generator = mulberry32(seed);

  for (let i = 0; i < length; i++) {
    let rnd = Math.floor(generator() * parts.length);
    word += parts[rnd];
  }

  return word.charAt(0).toLocaleUpperCase() + word.slice(1);
}