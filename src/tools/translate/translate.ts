import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { profaneWords } from "../../data/profane-words";

interface TranslationResponse {
  translatedText: string;
}

interface LanguageInfo {
  code: string;
  name: string;
  targets: string[];
}

const LIBRE_TRANSLATE_URL = "http://localhost:5000";
const BATCH_SIZE = 50;

async function getTargetLanguages(): Promise<string[]> {
  let attempts = 0;

  while (true) {
    attempts++;
    try {
      const response = await axios.get<LanguageInfo[]>(`${LIBRE_TRANSLATE_URL}/languages`);
      const englishInfo = response.data.find((lang) => lang.code === "en");

      if (!englishInfo) {
        throw new Error("English language support not found in API");
      }

      process.stdout.write("\n"); // Clear the retry line
      // Filter out 'en' from targets
      return englishInfo.targets.filter((lang) => lang !== "en");
    } catch (error) {
      // Check if it's a connection error
      if (error.code === "ECONNREFUSED" || error.code === "ECONNRESET" || error.message.includes("socket hang up")) {
        process.stdout.write(`\rWaiting for LibreTranslate API to come online... (Attempt ${attempts})`);
        await delay(5000); // Wait 5 seconds before retry
        continue;
      }

      // If it's not a connection error, rethrow
      console.error("Error fetching supported languages:", error.message);
      throw error;
    }
  }
}

function normalizeWord(word: string): { normalized: string; hasSpaces: boolean } {
  const hasSpaces = word.includes(" ");
  // Remove spaces and underscores from words like "f u c k" or "f_u_c_k"
  const normalized = word.replace(/[\s_]+/g, "");
  return { normalized, hasSpaces };
}

async function translateWord(word: string, targetLang: string): Promise<string> {
  const { normalized, hasSpaces } = normalizeWord(word);

  // If the word had spaces, and removing them makes it match another word in our list,
  // just use the spaced version of that word in the target language
  if (hasSpaces) {
    // Skip translation for spaced words, keep original format
    return word;
  }

  try {
    const response = await axios.post<TranslationResponse>(`${LIBRE_TRANSLATE_URL}/translate`, {
      q: normalized,
      source: "en",
      target: targetLang,
      format: "text",
    });

    const translatedText = response.data.translatedText.toLowerCase();

    // Check if the translated text is just asterisks and spaces
    if (/^[\s*]+$/.test(translatedText)) {
      return word; // Return original word if translation is just asterisks and spaces
    }

    // Check for unexpected content that might indicate an error
    if (["error", "not found", "invalid", "translation"].some((keyword) => translatedText.includes(keyword))) {
      console.warn(`Unexpected translation result for "${word}" to ${targetLang}: "${translatedText}"`);
      return word; // Return original word if translation seems to be an error message
    }

    return translatedText;
  } catch (error) {
    console.error(`Error translating "${word}" to ${targetLang}:`, error.message);
    return word; // Return original word on error
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateBatch(words: string[], targetLang: string): Promise<string[]> {
  const translations: string[] = [];
  const totalBatches = Math.ceil(words.length / BATCH_SIZE);

  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    const batch = words.slice(i, i + BATCH_SIZE);

    // Add retry logic for failed batches
    let retries = 3;
    let batchTranslations: string[] = [];

    while (retries > 0) {
      try {
        batchTranslations = await Promise.all(batch.map((word) => translateWord(word, targetLang)));
        break; // Success, exit retry loop
      } catch (error) {
        retries--;
        if (retries === 0) {
          console.error(`\nBatch translation failed after 3 attempts, using original words`, error);
          batchTranslations = batch; // Use original words on complete failure
        } else {
          console.error(`\nRetrying batch translation (${retries} attempts remaining)`, error);
          await delay(1000); // Wait 1 second before retry
        }
      }
    }

    translations.push(...batchTranslations);

    const currentBatch = Math.floor(i / BATCH_SIZE) + 1;
    const percentage = ((currentBatch / totalBatches) * 100).toFixed(1);
    const progress = `[${currentBatch}/${totalBatches}]`;
    const wordRange = `[${i + 1}-${Math.min(i + BATCH_SIZE, words.length)}/${words.length}]`;
    process.stdout.write(`\r${progress} English to ${targetLang} ${percentage}% ${wordRange}`);
  }

  process.stdout.write("\n");
  return translations;
}

async function main() {
  // Fetch supported target languages
  console.log("Fetching supported languages...");
  const targetLanguages = await getTargetLanguages();
  console.log(`Found ${targetLanguages.length} supported target languages\n${targetLanguages}\n`);

  const englishWords = profaneWords.get("en") || [];

  if (englishWords.length === 0) {
    throw new Error("No English words found in profaneWords map");
  }

  // Check for duplicates in English list
  const uniqueEnglishWords = [...new Set(englishWords)];
  const duplicateCount = englishWords.length - uniqueEnglishWords.length;

  if (duplicateCount > 0) {
    console.log(`Found ${duplicateCount} duplicates in English word list`);
    console.log(`Original count: ${englishWords.length}, Unique count: ${uniqueEnglishWords.length}`);
  }

  console.log(`${uniqueEnglishWords.length} English words to translate`);

  // Translate to each target language
  const translations = new Map<string, string[]>();

  for (let i = 0; i < targetLanguages.length; i++) {
    const lang = targetLanguages[i];
    const langProgress = `[${i + 1}/${targetLanguages.length}]`;
    console.log(`\n${langProgress} Translating ${lang}...`);
    const translatedWords = await translateBatch(uniqueEnglishWords, lang);
    // Clean up translations - remove quotes, invalid characters, and duplicates
    const cleanedWords = [...new Set(translatedWords.map((word) => word.replace(/["""]/g, "").trim()).filter((word) => word.length > 0))];
    translations.set(lang, cleanedWords);
    console.log(`Removed ${translatedWords.length - cleanedWords.length} duplicates`);
  }

  // Combine new translations with existing ones
  const combinedTranslations = new Map<string, string[]>([...profaneWords, ...translations]);
  combinedTranslations.delete("en");

  const sortedTranslations = Array.from(combinedTranslations.entries()).sort(([langA], [langB]) => langA.localeCompare(langB));

  // Generate new content
  let newContent = "// WARNING: this file contains profanity. The below list of profane words is necessary for this tool to function properly.\n";
  newContent += "// Do not read below this line if you do not wish to be exposed to lots of profane words\n\n";
  newContent += "export const profaneWords: Map<string, string[]> = new Map([\n";

  // Add English words first
  newContent += `  ["en", [\n    "${uniqueEnglishWords.join('",\n    "')}"\n  ]],\n`;

  // Add sorted translations
  for (const [lang, words] of sortedTranslations) {
    newContent += `  ["${lang}", [\n    "${words.join('",\n    "')}"\n  ]],\n`;
  }

  newContent += "]);\n";

  // Write back to file
  const filePath = path.join(__dirname, "../../data/profane-words.ts");
  fs.writeFileSync(filePath, newContent);
  console.log("\nTranslation complete! Updated profane-words.ts");
}

main().catch(console.error);
