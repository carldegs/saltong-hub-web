import { useCallback, useReducer } from "react";
import { getBlockFromPos, getIdxFromPos, getPosFromIdx } from "../utils";
import {
  Pos,
  SudokuCellState,
  SudokuCellVisualState,
  SudokuInputMode,
  SudokuUserCheckState,
} from "../types";

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

const getCellHighlightState = ({
  isSelected,
  isSameValue,
  isRelated,
}: {
  isSelected: boolean;
  isSameValue: boolean;
  isRelated: boolean;
}): SudokuCellVisualState["highlight"] => {
  if (isSelected) {
    return "selected";
  }

  if (isSameValue) {
    return "same-value";
  }

  if (isRelated) {
    return "related";
  }

  return "idle";
};

const getCellAnswerState = ({
  isGivenError,
  isUserError,
  userCheckState,
}: {
  isGivenError: boolean;
  isUserError: boolean;
  userCheckState: SudokuUserCheckState;
}): SudokuCellVisualState["answer"] => {
  if (isGivenError) {
    return "given-error";
  }

  if (isUserError || userCheckState === "incorrect") {
    return "user-error";
  }

  if (userCheckState === "correct") {
    return "correct";
  }

  return "none";
};

const getCellVisualState = ({
  isGivenError,
  isUserError,
  userCheckState,
  isSelected,
  isSameValue,
  isRelated,
}: {
  isGivenError: boolean;
  isUserError: boolean;
  userCheckState: SudokuUserCheckState;
  isSelected: boolean;
  isSameValue: boolean;
  isRelated: boolean;
}): SudokuCellVisualState => ({
  highlight: getCellHighlightState({
    isSelected,
    isSameValue,
    isRelated,
  }),
  answer: getCellAnswerState({
    isGivenError,
    isUserError,
    userCheckState,
  }),
});

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
    const isRelated = selectedPos
      ? cell.pos.row === selectedPos.row ||
        cell.pos.col === selectedPos.col ||
        getBlockFromPos(cell.pos, gridSize) === selectedBlock
      : false;
    const isSameValue =
      selectedCell?.value !== 0 && cell.value === selectedCell?.value;
    const isUserError = isConflicting && !cell.isGiven;
    const isGivenError = isConflicting && cell.isGiven;

    return {
      ...cell,
      visualState: getCellVisualState({
        isGivenError,
        isUserError,
        userCheckState: cell.userCheckState,
        isSelected,
        isSameValue,
        isRelated,
      }),
    };
  });
};

type SudokuSnapshot = Array<
  Pick<
    SudokuCellState,
    "value" | "candidates" | "isCorrectUserEntry" | "userCheckState"
  >
>;

type SudokuState = {
  grid: SudokuCellState[];
  history: SudokuSnapshot[];
  solution: number[];
  inputMode: SudokuInputMode;
  autoCandidates: boolean;
  autoCheck: boolean;
  selectedPos?: Pos;
};

type SudokuAction =
  | { type: "select-cell"; pos: Pos }
  | { type: "set-input-mode"; inputMode: SudokuInputMode }
  | { type: "set-auto-candidates"; autoCandidates: boolean }
  | { type: "set-auto-check"; autoCheck: boolean }
  | { type: "enter-value"; value: number; pos?: Pos }
  | { type: "clear-cell"; pos?: Pos }
  | { type: "fill-cell-candidates"; pos?: Pos }
  | { type: "fill-all-candidates" }
  | { type: "check-cell"; pos?: Pos }
  | { type: "check-grid" }
  | { type: "delete-candidates" }
  | { type: "clear-grid" }
  | { type: "undo" };

const MAX_HISTORY_LENGTH = 100;

const snapshotGrid = (grid: SudokuCellState[]): SudokuSnapshot =>
  grid.map(({ value, candidates, isCorrectUserEntry, userCheckState }) => ({
    value,
    candidates: [...candidates],
    isCorrectUserEntry,
    userCheckState,
  }));

const restoreSnapshot = (
  grid: SudokuCellState[],
  snapshot: SudokuSnapshot
): SudokuCellState[] =>
  grid.map((cell, index) => ({
    ...cell,
    value: snapshot[index].value,
    candidates: [...snapshot[index].candidates],
    isCorrectUserEntry: snapshot[index].isCorrectUserEntry,
    userCheckState: snapshot[index].userCheckState,
  }));

const hasGridChanged = (
  currentGrid: SudokuCellState[],
  nextGrid: SudokuCellState[]
) =>
  currentGrid.some((cell, index) => {
    const nextCell = nextGrid[index];

    return (
      cell.value !== nextCell.value ||
      cell.userCheckState !== nextCell.userCheckState ||
      cell.candidates.length !== nextCell.candidates.length ||
      cell.candidates.some(
        (candidate, i) => candidate !== nextCell.candidates[i]
      )
    );
  });

const commitGridChange = (
  state: SudokuState,
  nextGrid: SudokuCellState[],
  selectedPos = state.selectedPos
): SudokuState => {
  if (!hasGridChanged(state.grid, nextGrid)) {
    return state;
  }

  return {
    ...state,
    grid: applyDerivedState(nextGrid, selectedPos),
    history: [snapshotGrid(state.grid), ...state.history].slice(
      0,
      MAX_HISTORY_LENGTH
    ),
    selectedPos,
  };
};

const toggleCandidate = (candidates: number[], value: number) =>
  candidates.includes(value)
    ? candidates.filter((candidate) => candidate !== value)
    : [...candidates, value].sort((a, b) => a - b);

const getActionPos = (state: SudokuState, pos?: Pos) =>
  pos ?? state.selectedPos;

const getCandidateValuesForCell = (
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

  return Array.from({ length: gridSize }, (_, index) => index + 1).filter(
    (value) => !usedValues.has(value)
  );
};

const applyAutoCandidates = (grid: SudokuCellState[]) => {
  const gridSize = Math.sqrt(grid.length);

  return grid.map((cell) =>
    cell.value === 0 && !cell.isGiven
      ? {
          ...cell,
          candidates: getCandidateValuesForCell(grid, cell.pos, gridSize),
        }
      : {
          ...cell,
          candidates: [],
        }
  );
};

const maybeApplyAutoCandidates = (
  grid: SudokuCellState[],
  autoCandidates: boolean
) => (autoCandidates ? applyAutoCandidates(grid) : grid);

const getUserCheckState = (
  value: number,
  solutionValue: number
): SudokuUserCheckState =>
  value === 0 ? null : value === solutionValue ? "correct" : "incorrect";

const sudokuGridReducer = (
  state: SudokuState,
  action: SudokuAction
): SudokuState => {
  switch (action.type) {
    case "select-cell":
      return {
        ...state,
        grid: applyDerivedState(state.grid, action.pos),
        selectedPos: action.pos,
      };
    case "set-input-mode":
      return {
        ...state,
        inputMode: action.inputMode,
      };
    case "set-auto-candidates": {
      if (state.autoCandidates === action.autoCandidates) {
        return state;
      }

      const nextGrid = action.autoCandidates
        ? applyAutoCandidates(state.grid)
        : state.grid;

      return {
        ...state,
        autoCandidates: action.autoCandidates,
        grid: applyDerivedState(nextGrid, state.selectedPos),
      };
    }
    case "set-auto-check": {
      if (state.autoCheck === action.autoCheck) {
        return state;
      }

      return {
        ...state,
        autoCheck: action.autoCheck,
        grid: applyDerivedState(state.grid, state.selectedPos),
      };
    }
    case "enter-value": {
      const pos = getActionPos(state, action.pos);

      if (!pos) {
        return state;
      }

      if (action.value === 0) {
        return sudokuGridReducer(state, { type: "clear-cell", pos });
      }

      const gridSize = Math.sqrt(state.grid.length);
      const index = getIdxFromPos(pos, gridSize);
      const targetCell = state.grid[index];

      if (targetCell.isGiven) {
        return state;
      }

      if (state.inputMode === "candidates") {
        if (targetCell.value !== 0) {
          return state;
        }

        return commitGridChange(
          state,
          state.grid.map((cell, i) =>
            i === index
              ? {
                  ...cell,
                  candidates: toggleCandidate(cell.candidates, action.value),
                  userCheckState: null,
                  isCorrectUserEntry: false,
                }
              : cell
          ),
          pos
        );
      }

      return commitGridChange(
        state,
        maybeApplyAutoCandidates(
          state.grid.map((cell, i) =>
            i === index
              ? {
                  ...cell,
                  value: action.value,
                  userCheckState: state.autoCheck
                    ? getUserCheckState(action.value, state.solution[index])
                    : null,
                  isCorrectUserEntry:
                    state.autoCheck && action.value === state.solution[index],
                }
              : cell
          ),
          state.autoCandidates
        ),
        pos
      );
    }
    case "clear-cell": {
      const pos = getActionPos(state, action.pos);

      if (!pos) {
        return state;
      }

      const gridSize = Math.sqrt(state.grid.length);
      const index = getIdxFromPos(pos, gridSize);
      const targetCell = state.grid[index];

      if (targetCell.isGiven) {
        return state;
      }

      return commitGridChange(
        state,
        maybeApplyAutoCandidates(
          state.grid.map((cell, i) =>
            i === index
              ? {
                  ...cell,
                  value: 0,
                  candidates: targetCell.value === 0 ? [] : cell.candidates,
                  userCheckState: null,
                  isCorrectUserEntry: false,
                }
              : cell
          ),
          state.autoCandidates
        ),
        pos
      );
    }
    case "fill-cell-candidates": {
      const pos = getActionPos(state, action.pos);

      if (!pos) {
        return state;
      }

      const gridSize = Math.sqrt(state.grid.length);
      const index = getIdxFromPos(pos, gridSize);
      const targetCell = state.grid[index];

      if (targetCell.isGiven || targetCell.value !== 0) {
        return state;
      }

      return commitGridChange(
        state,
        state.grid.map((cell, i) =>
          i === index
            ? {
                ...cell,
                candidates: getCandidateValuesForCell(
                  state.grid,
                  pos,
                  gridSize
                ),
                userCheckState: null,
                isCorrectUserEntry: false,
              }
            : cell
        ),
        pos
      );
    }
    case "fill-all-candidates":
      return commitGridChange(
        state,
        applyAutoCandidates(state.grid),
        state.selectedPos
      );
    case "check-cell": {
      const pos = getActionPos(state, action.pos);

      if (!pos) {
        return state;
      }

      const gridSize = Math.sqrt(state.grid.length);
      const index = getIdxFromPos(pos, gridSize);
      const targetCell = state.grid[index];

      if (
        targetCell.isGiven ||
        targetCell.value === 0 ||
        targetCell.candidates.length > 0
      ) {
        return state;
      }

      const userCheckState = getUserCheckState(
        targetCell.value,
        state.solution[index]
      );

      return commitGridChange(
        state,
        state.grid.map((cell, i) =>
          i === index
            ? {
                ...cell,
                userCheckState,
                isCorrectUserEntry: userCheckState === "correct",
              }
            : cell
        ),
        pos
      );
    }
    case "check-grid":
      return commitGridChange(
        state,
        state.grid.map((cell, index) => {
          if (cell.isGiven || cell.value === 0) {
            return cell;
          }

          const userCheckState = getUserCheckState(
            cell.value,
            state.solution[index]
          );

          return {
            ...cell,
            userCheckState,
            isCorrectUserEntry: userCheckState === "correct",
          };
        }),
        state.selectedPos
      );
    case "delete-candidates":
      return commitGridChange(
        state,
        state.grid.map((cell) =>
          cell.candidates.length > 0
            ? {
                ...cell,
                candidates: [],
                userCheckState: cell.value === 0 ? null : cell.userCheckState,
              }
            : cell
        ),
        state.selectedPos
      );
    case "clear-grid":
      return commitGridChange(
        state,
        state.grid.map((cell) =>
          cell.isGiven
            ? cell
            : {
                ...cell,
                value: 0,
                candidates: [],
                userCheckState: null,
                isCorrectUserEntry: false,
              }
        ),
        state.selectedPos
      );
    case "undo": {
      const [lastSnapshot, ...history] = state.history;

      if (!lastSnapshot) {
        return state;
      }

      return {
        ...state,
        grid: applyDerivedState(
          restoreSnapshot(state.grid, lastSnapshot),
          state.selectedPos
        ),
        history,
      };
    }
  }
};

const useSudokuGrid = ({
  puzzle,
  solution,
}: {
  puzzle: number[];
  solution: number[];
}) => {
  const [state, dispatch] = useReducer(
    sudokuGridReducer,
    { puzzle, solution },
    ({ puzzle, solution }): SudokuState => ({
      grid: applyDerivedState(
        puzzle.map((value, i) => ({
          value,
          candidates: [],
          pos: getPosFromIdx(i),
          isGiven: value !== 0,
          isCorrectUserEntry: false,
          userCheckState: null,
          visualState: {
            highlight: "idle",
            answer: "none",
          },
        }))
      ),
      history: [],
      solution,
      inputMode: "solution",
      autoCandidates: false,
      autoCheck: false,
    })
  );

  const selectCell = useCallback((pos: Pos) => {
    dispatch({ type: "select-cell", pos });
  }, []);

  const setInputMode = useCallback((inputMode: SudokuInputMode) => {
    dispatch({ type: "set-input-mode", inputMode });
  }, []);

  const setAutoCandidates = useCallback((autoCandidates: boolean) => {
    dispatch({ type: "set-auto-candidates", autoCandidates });
  }, []);

  const setAutoCheck = useCallback((autoCheck: boolean) => {
    dispatch({ type: "set-auto-check", autoCheck });
  }, []);

  const enterValue = useCallback((value: number, pos?: Pos) => {
    dispatch({ type: "enter-value", value, pos });
  }, []);

  const clearCell = useCallback((pos?: Pos) => {
    dispatch({ type: "clear-cell", pos });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: "undo" });
  }, []);

  const fillAllCandidates = useCallback(() => {
    dispatch({ type: "fill-all-candidates" });
  }, []);

  const fillCellCandidates = useCallback((pos?: Pos) => {
    dispatch({ type: "fill-cell-candidates", pos });
  }, []);

  const checkCell = useCallback((pos?: Pos) => {
    dispatch({ type: "check-cell", pos });
  }, []);

  const checkGrid = useCallback(() => {
    dispatch({ type: "check-grid" });
  }, []);

  const deleteCandidates = useCallback(() => {
    dispatch({ type: "delete-candidates" });
  }, []);

  const clearGrid = useCallback(() => {
    dispatch({ type: "clear-grid" });
  }, []);

  return {
    grid: state.grid,
    inputMode: state.inputMode,
    autoCandidates: state.autoCandidates,
    autoCheck: state.autoCheck,
    isComplete: state.grid.every(
      (cell, index) => cell.value !== 0 && cell.value === state.solution[index]
    ),
    selectedCell: state.selectedPos
      ? state.grid[
          getIdxFromPos(state.selectedPos, Math.sqrt(state.grid.length))
        ]
      : undefined,
    canUndo: state.history.length > 0,
    selectCell,
    setInputMode,
    setAutoCandidates,
    setAutoCheck,
    enterValue,
    clearCell,
    undo,
    fillAllCandidates,
    fillCellCandidates,
    checkCell,
    checkGrid,
    deleteCandidates,
    clearGrid,
  };
};

export default useSudokuGrid;
