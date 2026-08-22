import { Children, isValidElement, ReactElement, ReactNode } from "react";
import { describe, expect, it } from "vitest";
import PlayMoreCard from "./play-more-card";

function getItemTitleParts(item: ReactElement) {
  const content = Children.toArray(item.props.children).find(
    (child) => isValidElement(child) && child.type.name === "ItemContent"
  ) as ReactElement;
  const title = Children.toArray(content.props.children).find(
    (child) => isValidElement(child) && child.type.name === "ItemTitle"
  ) as ReactElement;

  return Children.toArray(title.props.children);
}

function getItemLabel(item: ReactElement) {
  return getItemTitleParts(item)
    .filter((child): child is string => typeof child === "string")
    .join("");
}

function getPlayMoreItems(mode: "classic" | "mini" | "max") {
  const card = PlayMoreCard({ mode });
  const description = Children.toArray(card.props.children).find(
    (child) => isValidElement(child) && child.type.name === "CardDescription"
  ) as ReactElement;
  const list = description.props.children as ReactElement<{
    children: ReactNode;
  }>;

  return Children.toArray(list.props.children) as ReactElement[];
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

    expect(badges.every(isValidElement)).toBe(true);
    expect(
      badges.map((badge) => (badge as ReactElement).props.className)
    ).toEqual(["ml-1", "ml-1"]);
  });
});
