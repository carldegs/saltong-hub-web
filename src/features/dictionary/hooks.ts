import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { MAX_DICT_WORD_LENGTH, MIN_DICT_WORD_LENGTH } from "./constants";
import { getDictionary } from "./api";

export const DEFAULT_LENGTHS = Array.from(
  { length: MAX_DICT_WORD_LENGTH - MIN_DICT_WORD_LENGTH + 1 },
  (_, i) => i + MIN_DICT_WORD_LENGTH
);

export const useReadDictionary = () => {
  return useLocalStorage<Record<number, string[]>>(
    "saltong/dict",
    {},
    {
      initializeWithValue: false,
    }
  );
};

type UseDictionaryResponse<W extends number | number[]> = {
  dict: W extends number ? string[] : Record<number, string[]>;
  isLoading: boolean;
};

export const useDictionary = <W extends number | number[] = number[]>(
  wordLen: W = DEFAULT_LENGTHS as W
): UseDictionaryResponse<W> => {
  const [cache, setCache] = useReadDictionary();
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const hasFetchedRef = useRef(false);

  const isLoading = useMemo(() => status === "loading", [status]);

  useEffect(() => {
    // Only run on the client
    if (typeof window === "undefined") return;

    const requested = (Array.isArray(wordLen) ? wordLen : [wordLen])
      .filter((len): len is number => typeof len === "number")
      .filter(
        (len) => len >= MIN_DICT_WORD_LENGTH && len <= MAX_DICT_WORD_LENGTH
      );

    if (!requested.length) return;

    // Step 1: Read localStorage directly to avoid fetching if data already exists
    let lsData: Record<number, string[]> = {};
    try {
      const raw = localStorage.getItem("saltong/dict");
      if (raw) {
        lsData = JSON.parse(raw);
      }
    } catch (e) {
      // If parsing fails, ignore and treat as empty
      console.warn("Failed to parse localStorage for dictionary:", e);
    }

    // Sync localStorage data into hook cache if cache is empty or missing keys
    if (Object.keys(lsData).length) {
      setCache((prev) => ({ ...lsData, ...prev }));
    }

    const source: Record<number, string[]> = {
      ...lsData,
      ...cache,
    };

    // Determine which lengths are missing locally
    const toFetch = requested.filter(
      (len) => !source[len] || source[len]?.length === 0
    );

    if (!toFetch.length) return;

    // Avoid duplicating fetches for the same run
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    let cancelled = false;
    const run = async () => {
      setStatus("loading");
      try {
        const results = await Promise.all(
          toFetch.map((len) => getDictionary(len))
        );
        const merged: Record<number, string[]> = { ...source };
        toFetch.forEach((len, idx) => {
          merged[len] = results[idx];
        });
        if (!cancelled) {
          setCache(merged);
          setStatus("success");
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setStatus("error");
      }
    };

    run();

    return () => {
      cancelled = true;
      hasFetchedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordLen, setCache]);

  if (typeof wordLen === "number") {
    return {
      dict: cache[wordLen] ?? [],
      isLoading,
    } as UseDictionaryResponse<W>;
  }

  const filteredCache = wordLen.reduce(
    (acc, len) => {
      const c = cache[len];

      if (!c) {
        return acc;
      }

      return { ...acc, [len]: cache[len] };
    },
    {} as Record<number, string[]>
  );

  return {
    dict: filteredCache,
    isLoading,
  } as UseDictionaryResponse<W>;
};
