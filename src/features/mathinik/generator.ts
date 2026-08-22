import { Generator } from "@/utils/generator";
import { MathinikRound } from "./type";

type MathinikGeneratorOptions = {
  seed: string;
};

const SMALL_NUM_OPTIONS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
];
const LARGE_NUM_OPTIONS = [25, 50, 75, 100];

const LARGE_NUM_DECK_SIZE_OPTIONS = [0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 4];

export class MathinikGenerator extends Generator {
  private readonly MAX_GENERATE_RETRIES = 5;
  private readonly MAX_TARGET_ATTEMPTS = 100;

  private solve(
    numbers: number[],
    target: number
  ): {
    value: number;
    expression: string;
    difference: number;
    isExact: boolean;
  } | null {
    type Node = {
      value: number;
      expression: string;
    };

    let best: {
      value: number;
      expression: string;
      difference: number;
      isExact: boolean;
    } | null = null;

    const updateBest = (node: Node) => {
      const difference = Math.abs(target - node.value);

      if (
        !best ||
        difference < best.difference ||
        (difference === best.difference &&
          node.expression.length < best.expression.length)
      ) {
        best = {
          value: node.value,
          expression: node.expression,
          difference,
          isExact: difference === 0,
        };
      }
    };

    const search = (nodes: Node[]) => {
      for (const node of nodes) {
        updateBest(node);

        if (best?.isExact) return;
      }

      if (nodes.length < 2) return;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const remaining = nodes.filter(
            (_, index) => index !== i && index !== j
          );

          const candidates: Node[] = [
            {
              value: a.value + b.value,
              expression: `(${a.expression}+${b.expression})`,
            },
            {
              value: a.value * b.value,
              expression: `(${a.expression}*${b.expression})`,
            },
          ];

          if (a.value > b.value) {
            candidates.push({
              value: a.value - b.value,
              expression: `(${a.expression}-${b.expression})`,
            });
          }

          if (b.value > a.value) {
            candidates.push({
              value: b.value - a.value,
              expression: `(${b.expression}-${a.expression})`,
            });
          }

          if (b.value !== 0 && a.value % b.value === 0) {
            candidates.push({
              value: a.value / b.value,
              expression: `(${a.expression}/${b.expression})`,
            });
          }

          if (a.value !== 0 && b.value % a.value === 0) {
            candidates.push({
              value: b.value / a.value,
              expression: `(${b.expression}/${a.expression})`,
            });
          }

          for (const candidate of candidates) {
            if (candidate.value <= 0) continue;

            search([...remaining, candidate]);

            if (best?.isExact) return;
          }
        }
      }
    };

    search(
      numbers.map((n) => ({
        value: n,
        expression: String(n),
      }))
    );

    return best;
  }

  private isSolvableByOneEquation(numbers: number[], target: number) {
    for (let i = 0; i < numbers.length; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        const a = numbers[i];
        const b = numbers[j];

        if (a + b === target) return true;
        if (a * b === target) return true;
        if (a - b === target) return true;
        if (b - a === target) return true;
        if (b !== 0 && a % b === 0 && a / b === target) return true;
        if (a !== 0 && b % a === 0 && b / a === target) return true;
      }
    }

    return false;
  }

  private generateCandidate(seed: string): MathinikRound {
    const prng = this.createPrng(seed);

    const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => prng() - 0.5);

    const getRandomInt = (min: number, max: number) =>
      Math.floor(prng() * (max - min + 1)) + min;

    const largeNumDeckSize = shuffle(LARGE_NUM_DECK_SIZE_OPTIONS)[0];

    const largeNumDeck = shuffle(LARGE_NUM_OPTIONS).slice(0, largeNumDeckSize);

    const smallNumDeck = shuffle(SMALL_NUM_OPTIONS).slice(
      0,
      6 - largeNumDeckSize
    );

    const deck = [...largeNumDeck, ...smallNumDeck].sort((a, b) => a - b);

    let bestResult: {
      target: number;
      value: number;
      expression: string;
      difference: number;
      isExact: boolean;
    } | null = null;

    for (let attempt = 0; attempt < this.MAX_TARGET_ATTEMPTS; attempt++) {
      const target = getRandomInt(101, 999);
      const result = this.solve(deck, target);

      if (!result) continue;

      const candidate = {
        target,
        value: result.value,
        expression: result.expression,
        difference: result.difference,
        isExact: result.isExact,
      };

      if (candidate.isExact) {
        bestResult = candidate;
        break;
      }

      if (
        !bestResult ||
        candidate.difference < bestResult.difference ||
        (candidate.difference === bestResult.difference &&
          candidate.expression.length < bestResult.expression.length)
      ) {
        bestResult = candidate;
      }
    }

    if (!bestResult) {
      throw new Error("Failed to generate Mathinik puzzle.");
    }

    return {
      largeNumDeckSize,
      deck,
      target: bestResult.target,
      solution: {
        value: bestResult.value,
        expression: bestResult.expression,
        difference: bestResult.difference,
        isExact: bestResult.isExact,
      },
    };
  }

  public generate({ seed }: MathinikGeneratorOptions): MathinikRound {
    let fallbackRound: MathinikRound | null = null;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.MAX_GENERATE_RETRIES; attempt++) {
      try {
        const attemptSeed = attempt === 0 ? seed : `${seed}:retry:${attempt}`;
        const round = this.generateCandidate(attemptSeed);

        fallbackRound = round;

        if (this.isSolvableByOneEquation(round.deck, round.target)) {
          continue;
        }

        return round;
      } catch (error) {
        lastError =
          error instanceof Error
            ? error
            : new Error("Failed to generate Mathinik puzzle.");
      }
    }

    if (fallbackRound) return fallbackRound;

    throw lastError ?? new Error("Failed to generate Mathinik puzzle.");
  }
}
