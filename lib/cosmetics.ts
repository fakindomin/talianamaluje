export const DEFAULT_COSMETIC_CATEGORIES = [
  "Podkład",
  "Korektor",
  "Puder",
  "Bronzer",
  "Róż",
  "Rozświetlacz",
  "Cień do powiek",
  "Kredka do oczu",
  "Eyeliner",
  "Kredka do brwi",
  "Żel do brwi",
  "Kępki rzęs",
  "Szminka",
  "Błyszczyk",
  "Konturówka do ust"
];

export function mergeCategories(existing: string[]): string[] {
  return Array.from(new Set([...DEFAULT_COSMETIC_CATEGORIES, ...existing])).sort((a, b) => a.localeCompare(b, "pl"));
}
