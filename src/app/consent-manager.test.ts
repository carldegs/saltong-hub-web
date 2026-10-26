import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import { ConsentManager } from "./consent-manager";

it("renders application children through the offline consent provider", () => {
  const html = renderToString(
    createElement(
      ConsentManager,
      null,
      createElement("main", null, "Game content")
    )
  );
  expect(html).toContain("<main>Game content</main>");
});
