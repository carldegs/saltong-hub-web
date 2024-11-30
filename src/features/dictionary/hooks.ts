import { useEffect, useMemo, useState } from "react";
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
  const [isInitialized, setIsInitialized] = useState(false);

  const isLoading = useMemo(() => status === "loading", [status]);

  useEffect(() => {
    const fetchData = async () => {
      const wlen = Array.isArray(wordLen) ? wordLen : [wordLen];

      const wlenToFetch = wlen.filter((len) => !cache[len] && len);

      if (wlenToFetch.length) {
        setStatus("loading");
        try {
          const data = await Promise.all(
            wlenToFetch.map((len) => getDictionary(len))
          );
          const newData = wlenToFetch.reduce(
            (acc, len, idx) => ({ ...acc, [len]: data[idx] }),
            {}
          );
          setCache({ ...cache, ...newData });
          setStatus("success");
        } catch (e) {
          console.error(e);
          setStatus("error");
        }
      }
    };

    if (!isInitialized) {
      setIsInitialized(true);
    } else {
      fetchData();
    }

    return () => {
      setStatus("idle");
    };
  }, [cache, isInitialized, setCache, wordLen]);

  if (typeof wordLen === "number") {
    return { dict: cache[wordLen], isLoading } as UseDictionaryResponse<W>;
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

// export const useDictionary = () => {
//   const [dict, setDict] = useReadDictionary();
//   const [isLoading, setIsLoading] = useState(false);

//   const hasDict = useCallback((wordLen: number) => !!dict[wordLen], [dict]);

//   const fetchDict = useCallback(
//     async (length: number) => {
//       setIsLoading(true);
//       let newData = { ...dict };
//       let shouldUpdate = false;

//       if (!dict[length]) {
//         const data = await getDictionary(length);
//         newData = { ...newData, [length]: data };
//         shouldUpdate = true;
//       } else {
//         console.log(`Dictionary for length ${length} found in localstorage.`);
//       }

//       if (shouldUpdate) {
//         setDict(newData);
//       }

//       setIsLoading(false);
//       return newData[length];
//     },
//     [dict, setDict]
//   );

//   return useMemo(
//     () => ({ dict, isLoading, fetchDict, hasDict }),
//     [dict, fetchDict, hasDict, isLoading]
//   );
// };
