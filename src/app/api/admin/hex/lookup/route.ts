import { NextRequest, NextResponse } from "next/server";
import {
  getCharSet,
  isPangramCandidate,
  buildCharsetMask,
} from "@/features/hex/utils";
import { getDictionary } from "@/features/dictionary/api";
import { createClient } from "@/lib/supabase/server";
import { HEX_CONFIG } from "@/features/hex/config";
import { isAllowedAdmin } from "../../utils/is-allowed-admin";
import type {
  HexWordBankItem,
  HexLookupTableItem,
  HexLookupTableMetadata,
} from "@/features/hex/types";

const DEFAULT_LENGTHS = Array.from(
  {
    length: HEX_CONFIG.maxWordListLetters - HEX_CONFIG.minWordListLetters + 1,
  },
  (_, i) => i + HEX_CONFIG.minWordListLetters
);

const ADMIN_BUCKET = "admin";
const LOOKUP_TABLE_FILE = "hex-lookup-table.csv";
const METADATA_FILE = "hex-lookup-table-meta.json";

async function getDictionaryWithRetry(
  length: number,
  maxRetries = 3
): Promise<string[]> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.info(
        `Fetching dictionary for length ${length} (attempt ${attempt}/${maxRetries})`
      );
      const dict = await getDictionary(length);
      console.info(
        `Successfully fetched dictionary for length ${length}: ${dict.length} words`
      );
      return dict;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(
        `Failed to fetch dictionary for length ${length} (attempt ${attempt}/${maxRetries}):`,
        lastError.message
      );

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.info(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `Failed to fetch dictionary for length ${length} after ${maxRetries} attempts: ${lastError?.message}`
  );
}

async function getAllDictionaries(
  lengths: number[] = DEFAULT_LENGTHS
): Promise<string[]> {
  console.info(`Fetching ${lengths.length} dictionaries...`);

  const results: string[] = [];

  for (let i = 0; i < lengths.length; i++) {
    const length = lengths[i];
    try {
      const dict = await getDictionaryWithRetry(length);
      results.push(...dict);

      if ((i + 1) % 5 === 0) {
        console.info(
          `Progress: ${i + 1}/${lengths.length} dictionaries fetched`
        );
      }
    } catch (error) {
      console.error(`Skipping dictionary for length ${length}:`, error);
    }
  }

  console.info(`Total words fetched: ${results.length}`);
  return results;
}

function getWordBank(word: string): HexWordBankItem {
  return {
    word,
    wordMask: buildCharsetMask(word),
    isPangram: isPangramCandidate(word),
  };
}

function getCharsetLookupItems(
  charSet: string,
  wordId: number,
  wordBank: HexWordBankItem[]
): HexLookupTableItem[] {
  const lookupMap: Record<
    string,
    { numWords: number; numPangrams: number; rootWord: string | null }
  > = {};

  for (const letter of charSet) {
    lookupMap[letter] = {
      numWords: 0,
      numPangrams: 0,
      rootWord: null,
    };
  }

  for (const item of wordBank) {
    const { word, wordMask, isPangram: isPangramCandidate } = item;

    if ((wordMask | wordId) !== wordId) continue;

    const isActualPangram = isPangramCandidate && wordMask === wordId;

    for (const letter of charSet) {
      const centerMask = buildCharsetMask(letter);

      if ((wordMask & centerMask) === 0) continue;

      const entry = lookupMap[letter];
      entry.numWords += 1;
      if (isActualPangram) {
        entry.numPangrams += 1;
        if (entry.rootWord === null || word < entry.rootWord) {
          entry.rootWord = word;
        }
      }
    }
  }

  const numLetters = charSet.length;
  return Object.entries(lookupMap).map(([letter, data]) => ({
    wordId,
    centerLetter: letter,
    numWords: data.numWords,
    numPangrams: data.numPangrams,
    rootWord: data.rootWord ?? "",
    numLetters,
  }));
}

function getHexLookupTable(dict: string[]): HexLookupTableItem[] {
  const pangramCharSets = new Map<number, string>(); // mask -> charset string
  const wordBank: HexWordBankItem[] = [];
  const lookupTable: HexLookupTableItem[] = [];

  for (const word of dict) {
    const wordBankItem = getWordBank(word);

    if (wordBankItem.isPangram) {
      // Store the charset string for this mask if we haven't seen it
      if (!pangramCharSets.has(wordBankItem.wordMask)) {
        const charSet = getCharSet(word).sort().join("");
        pangramCharSets.set(wordBankItem.wordMask, charSet);
      }
    }

    wordBank.push(wordBankItem);
  }

  const pangramCharSetList = Array.from(pangramCharSets.entries()).sort(
    (a, b) => a[1].localeCompare(b[1])
  );

  console.info(
    `Processing ${pangramCharSetList.length} pangram charsets with ${wordBank.length} words in word bank`
  );

  for (let i = 0; i < pangramCharSetList.length; i++) {
    const [mask, charSet] = pangramCharSetList[i];
    const lookupItems = getCharsetLookupItems(charSet, mask, wordBank);
    lookupTable.push(...lookupItems);

    // info every 100th iteration
    if ((i + 1) % 100 === 0) {
      console.info(
        `Processed ${i + 1}/${pangramCharSetList.length} charsets (${Math.round(((i + 1) / pangramCharSetList.length) * 100)}%)`
      );
    }
  }

  console.info(
    `Completed processing all ${pangramCharSetList.length} charsets. Generated ${lookupTable.length} lookup items.`
  );

  return lookupTable;
}

function toCSV(rows: HexLookupTableItem[]): string {
  const header = [
    "wordId",
    "centerLetter",
    "numWords",
    "numPangrams",
    "rootWord",
    "numLetters",
  ].join(",");

  const body = rows
    .map((r) =>
      [
        String(r.wordId),
        r.centerLetter,
        String(r.numWords),
        String(r.numPangrams),
        r.rootWord,
        String(r.numLetters),
      ].join(",")
    )
    .join("\n");

  return `${header}\n${body}`;
}

function parseCSV(text: string): HexLookupTableItem[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return [];
  const header = lines[0].split(",");
  const idx = {
    wordId: header.indexOf("wordId"),
    centerLetter: header.indexOf("centerLetter"),
    numWords: header.indexOf("numWords"),
    numPangrams: header.indexOf("numPangrams"),
    rootWord: header.indexOf("rootWord"),
    numLetters: header.indexOf("numLetters"),
  };

  const items: HexLookupTableItem[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = line.split(",");
    items.push({
      wordId: parseInt(cols[idx.wordId], 10),
      centerLetter: cols[idx.centerLetter],
      numWords: parseInt(cols[idx.numWords], 10),
      numPangrams: parseInt(cols[idx.numPangrams], 10),
      rootWord: cols[idx.rootWord] || "",
      numLetters: parseInt(cols[idx.numLetters], 10),
    });
  }
  return items;
}

async function uploadToStorage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  filename: string,
  data: object | string,
  contentType: string
) {
  const blob =
    typeof data === "string"
      ? new Blob([data], { type: contentType })
      : new Blob([JSON.stringify(data, null, 2)], {
          type: contentType || "application/json",
        });

  const { error } = await supabase.storage
    .from(ADMIN_BUCKET)
    .upload(filename, blob, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload ${filename}: ${error.message}`);
  }
}

async function generateLookupTableInBackground(
  lengths: number[] = DEFAULT_LENGTHS
) {
  const supabase = await createClient();
  const startedAt = new Date().toISOString();

  try {
    // Verify user is authenticated
    const { data, error: authError } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;

    if (authError || !userId || !isAllowedAdmin(userId)) {
      throw new Error("User not authorized");
    }

    // Write initial metadata with "generating" status
    const initialMetadata: HexLookupTableMetadata = {
      status: "generating",
      startedAt,
      lastUpdatedAt: startedAt,
    };

    await uploadToStorage(
      supabase,
      METADATA_FILE,
      initialMetadata,
      "application/json"
    );

    // Generate lookup table
    const dictionary = await getAllDictionaries(lengths);
    const lookupTable = getHexLookupTable(dictionary);
    // Only save rows with numWords <= HEX_CONFIG.numWordsLimit
    const filteredLookupTable = lookupTable.filter(
      (row) => row.numWords <= HEX_CONFIG.numWordsLimit
    );
    const csv = toCSV(filteredLookupTable);

    // Upload lookup table (CSV)
    await uploadToStorage(supabase, LOOKUP_TABLE_FILE, csv, "text/csv");

    // Update metadata with "completed" status
    const completedAt = new Date().toISOString();
    const completedMetadata: HexLookupTableMetadata = {
      status: "completed",
      startedAt,
      completedAt,
      lastUpdatedAt: completedAt,
      recordCount: filteredLookupTable.length,
    };

    await uploadToStorage(
      supabase,
      METADATA_FILE,
      completedMetadata,
      "application/json"
    );

    console.info(
      `Hex lookup table generated successfully: ${lookupTable.length} records`
    );
  } catch (error) {
    console.error("Error generating hex lookup table:", error);

    // Update metadata with error status
    const errorCompletedAt = new Date().toISOString();
    const errorMetadata: HexLookupTableMetadata = {
      status: "error",
      startedAt,
      completedAt: errorCompletedAt,
      lastUpdatedAt: errorCompletedAt,
      error: error instanceof Error ? error.message : "Unknown error",
    };

    try {
      await uploadToStorage(
        supabase,
        METADATA_FILE,
        errorMetadata,
        "application/json"
      );
    } catch (uploadError) {
      console.error("Failed to upload error metadata:", uploadError);
    }
  }
}

// GET endpoint - Fetch the lookup table from storage
export async function GET() {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: authData, error: authError } =
      await supabase.auth.getClaims();
    const userId = authData?.claims?.sub;

    if (authError || !userId || !isAllowedAdmin(userId)) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase.storage
      .from(ADMIN_BUCKET)
      .download(LOOKUP_TABLE_FILE);

    if (error) {
      return NextResponse.json(
        { error: "Lookup table not found. Please regenerate it." },
        { status: 404 }
      );
    }

    const text = await data.text();
    const lookupTable = parseCSV(text);

    return NextResponse.json({ lookupTable });
  } catch (error) {
    console.error("Error fetching hex lookup table:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch hex lookup table",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST endpoint - Trigger async generation
export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated before starting generation
    const supabase = await createClient();
    const { data: authData, error: authError } =
      await supabase.auth.getClaims();
    const userId = authData?.claims?.sub;

    if (authError || !userId || !isAllowedAdmin(userId)) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { lengths = DEFAULT_LENGTHS } = body;

    // Start background generation without waiting
    generateLookupTableInBackground(lengths).catch((error) => {
      console.error("Background generation failed:", error);
    });

    return NextResponse.json(
      {
        message: "Lookup table generation started",
        status: "generating",
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Error starting lookup table generation:", error);

    return NextResponse.json(
      {
        error: "Failed to start lookup table generation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
