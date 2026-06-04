import * as crypto from "node:crypto";
import seedrandom from "seedrandom";
import { Pos } from "./types";
import { getBlockFromPos, getIdxFromPos } from "./utils";

type SearchState = {
  nodesVisited: number;
  hitNodeLimit: boolean;
};
type RemovalRange = readonly [min: number, max: number];
type GenerateOptions =
  | { seed: string; removals: number }
  | { seed: string; removalRange: RemovalRange };

export class Grid {
  private static readonly MAX_SOLVER_NODES = 50_000;
  private grid: number[];
  private gridSize: number;
  private blockSize: number;

  constructor({
    gridSize = 9,
    initGrid,
  }: {
    gridSize?: number;
    initGrid?: number[];
  } = {}) {
    const blockSize = Math.sqrt(gridSize);

    if (!Number.isInteger(blockSize)) {
      throw new Error("Grid size must have an integer square root");
    }

    this.gridSize = gridSize;
    this.blockSize = blockSize;

    if (initGrid) {
      if (initGrid.length !== gridSize * gridSize) {
        throw new Error("Initial Grid doesn't match grid size");
      }

      this.grid = [...initGrid];
    } else {
      this.grid = new Array(gridSize * gridSize).fill(0);
    }
  }

  private range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  private createPrng(seed: string) {
    const hash = crypto.createHash("sha256").update(seed).digest("hex");
    return seedrandom(hash);
  }

  private createScopedPrng(seed: string, scope: string) {
    return this.createPrng(`${seed}:${scope}`);
  }

  public getIdx(pos: Pos) {
    return getIdxFromPos(pos, this.gridSize);
  }

  private getCell(pos: Pos) {
    return this.grid[this.getIdx(pos)];
  }

  private setCell(pos: Pos, value: number) {
    this.grid[this.getIdx(pos)] = value;
  }

  private isCellEmpty(pos: Pos) {
    return this.getCell(pos) === 0;
  }

  public getNumEmptyCells() {
    return this.grid.filter((value) => value === 0).length;
  }

  private getRowNeighbors(row: number) {
    return this.range(0, this.gridSize - 1).map((col) =>
      this.getCell({ row, col })
    );
  }

  private getColNeighbors(col: number) {
    return this.range(0, this.gridSize - 1).map((row) =>
      this.getCell({ row, col })
    );
  }

  private getBlock(pos: Pos) {
    return getBlockFromPos(pos, this.gridSize);
  }

  private getBlockNeighbors(block: number): number[] {
    const startRow = Math.floor(block / this.blockSize) * this.blockSize;
    const startCol = (block % this.blockSize) * this.blockSize;

    const values: number[] = [];

    for (let r = 0; r < this.blockSize; r++) {
      for (let c = 0; c < this.blockSize; c++) {
        values.push(
          this.getCell({
            row: startRow + r,
            col: startCol + c,
          })
        );
      }
    }

    return values;
  }

  public isValueValid(value: number, pos: Pos) {
    if (value < 1 || value > this.gridSize) return false;
    if (!this.isCellEmpty(pos)) return false;

    const rowNeighbors = this.getRowNeighbors(pos.row);
    const colNeighbors = this.getColNeighbors(pos.col);
    const blockNeighbors = this.getBlockNeighbors(this.getBlock(pos));

    return ![...rowNeighbors, ...colNeighbors, ...blockNeighbors].includes(
      value
    );
  }

  public isValidGrid() {
    const isValidGroup = (values: number[]) => {
      const filledValues = values.filter((value) => value !== 0);
      const uniqueValues = new Set(filledValues);

      return (
        filledValues.length === uniqueValues.size &&
        filledValues.every((value) => value >= 1 && value <= this.gridSize)
      );
    };

    for (let i = 0; i < this.gridSize; i++) {
      if (!isValidGroup(this.getRowNeighbors(i))) return false;
      if (!isValidGroup(this.getColNeighbors(i))) return false;
      if (!isValidGroup(this.getBlockNeighbors(i))) return false;
    }

    return true;
  }

  public fillGrid(seed: string) {
    const prng = this.createPrng(seed);

    const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => prng() - 0.5);

    const pattern = (row: number, col: number) =>
      (this.blockSize * (row % this.blockSize) +
        Math.floor(row / this.blockSize) +
        col) %
      this.gridSize;

    const base = this.range(0, this.blockSize - 1);

    const rows = shuffle(base).flatMap((group) =>
      shuffle(base).map((row) => group * this.blockSize + row)
    );

    const cols = shuffle(base).flatMap((group) =>
      shuffle(base).map((col) => group * this.blockSize + col)
    );

    const digits = shuffle(this.range(1, this.gridSize));

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        this.setCell({ row, col }, digits[pattern(rows[row], cols[col])]);
      }
    }
  }

  public generate(options: GenerateOptions) {
    const { seed } = options;
    this.fillGrid(seed);

    const solution = [...this.grid];
    const targetRemovals =
      "removals" in options
        ? options.removals
        : this.getRemovalCount({
            seed,
            range: options.removalRange,
          });

    const removed = this.removeCells({
      count: targetRemovals,
      seed,
    });

    return {
      puzzle: [...this.grid],
      solution,
      removed,
      targetRemovals,
      clues: this.gridSize * this.gridSize - removed,
      reachedLimit: removed === targetRemovals,
    };
  }

  private getRemovalCount({
    seed,
    range,
  }: {
    seed: string;
    range: RemovalRange;
  }) {
    const [min, max] = range;

    if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
      throw new Error("Removal range must be an ascending integer tuple");
    }

    if (min === max) {
      return min;
    }

    const prng = this.createScopedPrng(seed, "removals");
    return Math.floor(prng() * (max - min + 1)) + min;
  }

  private removeCells({ count, seed }: { count: number; seed: string }) {
    const prng = this.createScopedPrng(seed, "remove");

    const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => prng() - 0.5);

    const positions = shuffle(
      this.range(0, this.gridSize * this.gridSize - 1).map((idx) => ({
        row: Math.floor(idx / this.gridSize),
        col: idx % this.gridSize,
      }))
    );

    let removed = 0;

    for (const pos of positions) {
      if (removed >= count) break;

      const oldValue = this.getCell(pos);

      this.setCell(pos, 0);

      const searchState: SearchState = {
        nodesVisited: 0,
        hitNodeLimit: false,
      };

      if (
        this.countSolutions(2, Grid.MAX_SOLVER_NODES, searchState) === 1 &&
        !searchState.hitNodeLimit
      ) {
        removed++;
      } else {
        this.setCell(pos, oldValue);
      }
    }

    return removed;
  }

  private countSolutions(
    limit = 2,
    maxNodes = Number.POSITIVE_INFINITY,
    state: SearchState = {
      nodesVisited: 0,
      hitNodeLimit: false,
    }
  ): number {
    if (state.nodesVisited >= maxNodes) {
      state.hitNodeLimit = true;
      return 0;
    }

    const empty = this.findBestEmptyCell();

    if (!empty) return 1;

    state.nodesVisited++;

    let total = 0;

    for (const value of empty.candidates) {
      this.setCell(empty.pos, value);

      total += this.countSolutions(limit, maxNodes, state);

      this.setCell(empty.pos, 0);

      if (state.hitNodeLimit || total >= limit) {
        return total;
      }
    }

    return total;
  }

  private findBestEmptyCell(): { candidates: number[]; pos: Pos } | null {
    let bestPos: Pos | null = null;
    let bestCandidates: number[] | null = null;

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const pos = { row, col };

        if (this.getCell(pos) !== 0) {
          continue;
        }

        const candidates = this.getCandidates(pos);

        if (candidates.length === 0) {
          return { pos, candidates };
        }

        if (!bestCandidates || candidates.length < bestCandidates.length) {
          bestPos = pos;
          bestCandidates = candidates;

          if (candidates.length === 1) {
            return { pos, candidates };
          }
        }
      }
    }

    if (!bestPos || !bestCandidates) {
      return null;
    }

    return { pos: bestPos, candidates: bestCandidates };
  }

  private getCandidates(pos: Pos) {
    const candidates: number[] = [];

    for (let value = 1; value <= this.gridSize; value++) {
      if (this.canPlace(value, pos)) {
        candidates.push(value);
      }
    }

    return candidates;
  }

  private canPlace(value: number, pos: Pos) {
    if (value < 1 || value > this.gridSize) {
      return false;
    }

    const currentValue = this.getCell(pos);

    this.setCell(pos, 0);

    const isValid =
      !this.getRowNeighbors(pos.row).includes(value) &&
      !this.getColNeighbors(pos.col).includes(value) &&
      !this.getBlockNeighbors(this.getBlock(pos)).includes(value);

    this.setCell(pos, currentValue);

    return isValid;
  }
}
