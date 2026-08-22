import * as crypto from "node:crypto";
import seedrandom from "seedrandom";

export class Generator {
  protected range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  protected createPrng(seed: string) {
    const hash = crypto.createHash("sha256").update(seed).digest("hex");
    return seedrandom(hash);
  }

  protected createScopedPrng(seed: string, scope: string) {
    return this.createPrng(`${seed}:${scope}`);
  }
}
