import { Children, isValidElement, ReactElement, ReactNode } from "react";
import { describe, expect, it } from "vitest";
import PlayMoreCard from "./play-more-card";

function findChildByComponentName(
  children: ReactNode,
  componentName: string
): ReactElement<{ children: ReactNode }> {
  const child = Children.toArray(children).find(
    (candidate): candidate is ReactElement<{ children: ReactNode }> =>
      isValidElement<{ children: ReactNode }>(candidate) &&
      typeof candidate.type === "function" &&
      candidate.type.name === componentName
  );

  if (!child) {
    throw new Error(`Expected ${componentName} to be present`);
  }

  return child;
}

function getItemTitleParts(item: ReactElement<{ children: ReactNode }>) {
  const content = findChildByComponentName(item.props.children, "ItemContent");
  const title = findChildByComponentName(content.props.children, "ItemTitle");

  return Children.toArray(title.props.children);
}

function getItemLabel(item: ReactElement<{ children: ReactNode }>) {
  return getItemTitleParts(item)
    .filter((child): child is string => typeof child === "string")
    .join("");
}

function getPlayMoreItems(mode: "classic" | "mini" | "max") {
  const card = PlayMoreCard({ mode });
  const description = findChildByComponentName(
    card.props.children,
    "CardDescription"
  );
  const list = description.props.children as ReactElement<{
    children: ReactNode;
  }>;

  return Children.toArray(list.props.children) as ReactElement<{
    children: ReactNode;
  }>[];
}

describe("Saltong PlayMoreCard", () => {
  it("places the new games directly after the vault", () => {
    const titles = getPlayMoreItems("classic").map(getItemLabel);

    expect(titles).toEqual([
      "Saltong Classic Vault",
      "Sudoku",
      "Mathinik",
      "Saltong Mini",
      "Saltong Max",
      "Saltong Hex",
    ]);
  });

  it("shows a new badge beside Sudoku and Mathinik", () => {
    const badges = getPlayMoreItems("classic")
      .filter((item) => ["Sudoku", "Mathinik"].includes(getItemLabel(item)))
      .map((item) => getItemTitleParts(item)[1]);

    const badgeElements = badges.filter(
      (badge): badge is ReactElement<{ className: string }> =>
        isValidElement<{ className: string }>(badge)
    );

    expect(badgeElements.map((badge) => badge.props.className)).toEqual([
      "ml-1",
      "ml-1",
    ]);
  });
});
