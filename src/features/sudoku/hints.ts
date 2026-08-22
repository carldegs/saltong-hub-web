import { Pos, SudokuCellState } from "./types";
import { getIdxFromPos } from "./utils";

export type SudokuHint = {
  message: string;
  pos?: Pos;
};

const SUDOKU_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const getCandidateValuesForCell = (
  grid: SudokuCellState[],
  pos: Pos,
  gridSize = Math.sqrt(grid.length)
) => {
  const usedValues = new Set<number>();
  const blockSize = Math.sqrt(gridSize);
  const blockRowStart = Math.floor(pos.row / blockSize) * blockSize;
  const blockColStart = Math.floor(pos.col / blockSize) * blockSize;

  for (let i = 0; i < gridSize; i++) {
    const rowValue =
      grid[getIdxFromPos({ row: pos.row, col: i }, gridSize)].value;
    const colValue =
      grid[getIdxFromPos({ row: i, col: pos.col }, gridSize)].value;

    if (rowValue !== 0) {
      usedValues.add(rowValue);
    }

    if (colValue !== 0) {
      usedValues.add(colValue);
    }
  }

  for (let rowOffset = 0; rowOffset < blockSize; rowOffset++) {
    for (let colOffset = 0; colOffset < blockSize; colOffset++) {
      const value =
        grid[
          getIdxFromPos(
            {
              row: blockRowStart + rowOffset,
              col: blockColStart + colOffset,
            },
            gridSize
          )
        ].value;

      if (value !== 0) {
        usedValues.add(value);
      }
    }
  }

  return SUDOKU_VALUES.filter((value) => !usedValues.has(value));
};

const getUnitName = (unit: "row" | "column" | "box") => {
  if (unit === "row") {
    return "This row";
  }

  if (unit === "column") {
    return "This column";
  }

  return "This box";
};

const getUnitIndexes = (
  unit: "row" | "column" | "box",
  pos: Pos,
  gridSize: number
) => {
  if (unit === "row") {
    return Array.from({ length: gridSize }, (_, col) =>
      getIdxFromPos({ row: pos.row, col }, gridSize)
    );
  }

  if (unit === "column") {
    return Array.from({ length: gridSize }, (_, row) =>
      getIdxFromPos({ row, col: pos.col }, gridSize)
    );
  }

  const blockSize = Math.sqrt(gridSize);
  const blockRowStart = Math.floor(pos.row / blockSize) * blockSize;
  const blockColStart = Math.floor(pos.col / blockSize) * blockSize;
  const indexes: number[] = [];

  for (let rowOffset = 0; rowOffset < blockSize; rowOffset++) {
    for (let colOffset = 0; colOffset < blockSize; colOffset++) {
      indexes.push(
        getIdxFromPos(
          {
            row: blockRowStart + rowOffset,
            col: blockColStart + colOffset,
          },
          gridSize
        )
      );
    }
  }

  return indexes;
};

const getCandidateMap = (grid: SudokuCellState[], gridSize: number) =>
  new Map(
    grid.map((cell, index) => [
      index,
      cell.value === 0 && !cell.isGiven
        ? getCandidateValuesForCell(grid, cell.pos, gridSize)
        : [],
    ])
  );

export const getSudokuHint = (
  grid: SudokuCellState[],
  solution: number[]
): SudokuHint => {
  const gridSize = Math.sqrt(grid.length);
  const mistakeIndex = grid.findIndex(
    (cell, index) =>
      !cell.isGiven && cell.value !== 0 && cell.value !== solution[index]
  );

  if (mistakeIndex >= 0) {
    const cell = grid[mistakeIndex];

    return {
      message: `This ${cell.value} is not correct. Clear it before looking for the next move.`,
      pos: cell.pos,
    };
  }

  const candidateMap = getCandidateMap(grid, gridSize);
  const singleCandidateEntry = Array.from(candidateMap.entries()).find(
    ([, candidates]) => candidates.length === 1
  );

  if (singleCandidateEntry) {
    const [index, [candidate]] = singleCandidateEntry;
    const cell = grid[index];

    return {
      message: `This cell can only be ${candidate}. That number is the only one not blocked by its row, column, or box.`,
      pos: cell.pos,
    };
  }

  for (const unit of ["row", "column", "box"] as const) {
    for (const cell of grid) {
      if (cell.value !== 0) {
        continue;
      }

      const indexes = getUnitIndexes(unit, cell.pos, gridSize);

      for (const value of SUDOKU_VALUES) {
        const matchingIndexes = indexes.filter((index) =>
          candidateMap.get(index)?.includes(value)
        );

        if (matchingIndexes.length !== 1) {
          continue;
        }

        const targetCell = grid[matchingIndexes[0]];

        return {
          message: `${getUnitName(unit)} needs a ${value}, and this is the only cell that can take it.`,
          pos: targetCell.pos,
        };
      }
    }
  }

  return {
    message:
      "No simple hint found right now. Look for pairs, pointing, claiming, or box-line interactions.",
  };
};
