import pako from "pako";

export async function getDictionary(length: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DICT_FILE_PATH}/dict_${length}.txt.gz`
  );
  const buffer = await response.arrayBuffer();
  const uncompressedData = pako.ungzip(buffer, { to: "string" });
  const parsedData = uncompressedData.split(",");

  return parsedData;
}
