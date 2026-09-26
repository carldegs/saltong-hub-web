// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";

import { createArticleEditor } from "./article-editor";

describe("article editor Markdown", () => {
  const editors: Array<{ destroy: () => void }> = [];

  afterEach(() => {
    editors.splice(0).forEach((editor) => editor.destroy());
  });

  it("round-trips GFM tables and validated play-games directives", () => {
    const editor = createArticleEditor(
      [
        "## What changed",
        "",
        "| Mode | Update |",
        "| --- | --- |",
        "| Classic | Faster loads |",
        "",
        ':::play-games{games="classic mini"}',
      ].join("\n")
    );
    editors.push(editor);

    expect(editor.getMarkdown()).toContain("| Mode | Update |");
    expect(editor.getMarkdown()).toContain(
      ':::play-games{games="classic mini"}'
    );
  });

  it("rejects invalid game IDs instead of serializing a directive", () => {
    expect(() =>
      createArticleEditor(':::play-games{games="classic unknown"}')
    ).toThrow("Choose at least one valid game");
  });
});
