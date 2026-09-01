import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const appDirectory = join(process.cwd(), "src/app");
const apexHost = ["https://", "saltong.com"].join("");

function publicSourceFiles() {
  return readdirSync(appDirectory, { encoding: "utf8", recursive: true })
    .filter((entry) => /\.(ts|tsx|md|mdx)$/.test(entry))
    .filter((entry) => !/\.test\.(ts|tsx)$/.test(entry))
    .map((entry) => join(appDirectory, entry));
}

describe("public host signals", () => {
  it("does not emit first-party URLs on the apex host", () => {
    const offendingFiles = publicSourceFiles()
      .filter((path) => readFileSync(path, "utf8").includes(apexHost))
      .map((path) => relative(process.cwd(), path));

    expect(offendingFiles).toEqual([]);
  });
});
