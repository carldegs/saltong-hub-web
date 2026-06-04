import { useCallback, useState } from "react";
import { getBlockFromPos, getIdxFromPos, getPosFromIdx } from "../utils";
import { Pos, SudokuCellState } from "../types";

const isSamePos = (a: Pos, b: Pos) => a.col === b.col && a.row === b.row;

const getConflictingCellIndexes = (grid: SudokuCellState[]) => {
  const gridSize = Math.sqrt(grid.length);
  const blockSize = Math.sqrt(gridSize);
  const conflictingIndexes = new Set<number>();

  const markConflicts = (indexes: number[]) => {
    const indexesByValue = new Map<number, number[]>();

    for (const index of indexes) {
      const value = grid[index].value;

      if (value === 0) {
        continue;
      }

      const valueIndexes = indexesByValue.get(value) ?? [];
      valueIndexes.push(index);
      indexesByValue.set(value, valueIndexes);
    }

    for (const valueIndexes of indexesByValue.values()) {
      if (valueIndexes.length < 2) {
        continue;
      }

      valueIndexes.forEach((index) => conflictingIndexes.add(index));
    }
  };

  for (let row = 0; row < gridSize; row++) {
    markConflicts(
      Array.from({ length: gridSize }, (_, col) =>
        getIdxFromPos({ row, col }, gridSize)
      )
    );
  }

  for (let col = 0; col < gridSize; col++) {
    markConflicts(
      Array.from({ length: gridSize }, (_, row) =>
        getIdxFromPos({ row, col }, gridSize)
      )
    );
  }

  for (let blockRow = 0; blockRow < blockSize; blockRow++) {
    for (let blockCol = 0; blockCol < blockSize; blockCol++) {
      const blockIndexes: number[] = [];

      for (let rowOffset = 0; rowOffset < blockSize; rowOffset++) {
        for (let colOffset = 0; colOffset < blockSize; colOffset++) {
          blockIndexes.push(
            getIdxFromPos(
              {
                row: blockRow * blockSize + rowOffset,
                col: blockCol * blockSize + colOffset,
              },
              gridSize
            )
          );
        }
      }

      markConflicts(blockIndexes);
    }
  }

  return conflictingIndexes;
};

const applyDerivedState = (
  grid: SudokuCellState[],
  selectedPos?: Pos
): SudokuCellState[] => {
  const gridSize = Math.sqrt(grid.length);
  const selectedCell = selectedPos
    ? grid[getIdxFromPos(selectedPos, gridSize)]
    : undefined;
  const selectedBlock = selectedPos
    ? getBlockFromPos(selectedPos, gridSize)
    : undefined;
  const conflictingIndexes = getConflictingCellIndexes(grid);

  return grid.map((cell, index) => {
    const isSelected = selectedPos ? isSamePos(cell.pos, selectedPos) : false;
    const isConflicting = conflictingIndexes.has(index);

    return {
      ...cell,
      isSelected,
      isHighlighted: selectedPos
        ? cell.pos.row === selectedPos.row ||
          cell.pos.col === selectedPos.col ||
          getBlockFromPos(cell.pos, gridSize) === selectedBlock
        : false,
      isHighlightedValue:
        selectedCell?.value !== 0 && cell.value === selectedCell?.value,
      isInvalidUserEntry: isConflicting && !cell.isGiven,
      isInvalidGiven: isConflicting && cell.isGiven,
    };
  });
};

const useSudokuGrid = (initialGrid: number[]) => {
  const [grid, setGrid] = useState(() =>
    applyDerivedState(
      initialGrid.map((value, i) => ({
        value,
        pos: getPosFromIdx(i),
        isGiven: value !== 0,
        isSelected: false,
        isHighlighted: false,
        isHighlightedValue: false,
        isInvalidUserEntry: false,
        isInvalidGiven: false,
      }))
    )
  );

  const selectCell = useCallback((pos: Pos) => {
    setGrid((grid) => {
      return applyDerivedState(grid, pos);
    });
  }, []);

  const setCellValue = useCallback((value: number, pos: Pos) => {
    setGrid((grid) => {
      const gridSize = Math.sqrt(grid.length);
      const selectedPos = grid.find((cell) => cell.isSelected)?.pos;

      if (grid[getIdxFromPos(pos, gridSize)].isGiven) {
        return grid;
      }

      return applyDerivedState(
        grid.map((cell) =>
          isSamePos(cell.pos, pos)
            ? {
                ...cell,
                value,
              }
            : cell
        ),
        selectedPos
      );
    });
  }, []);

  return {
    grid,
    selectCell,
    setCellValue,
  };
};

export default useSudokuGrid;
