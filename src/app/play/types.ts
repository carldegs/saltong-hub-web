export type GameId = "saltong-main" | "saltong-mini" | "saltong-max" | "hex";
type GameType = "saltong" | "hex";

export interface BaseGameSettings {
  id: GameId;
  name: string;
  type: GameType;
  mode?: string;
  path: string;
  icon: string;
  blurb: string;
  colorScheme: string;
  config?: BaseConfig;
}

export type SaltongGameMode = "main" | "mini" | "max";

export interface BaseConfig {
  startDate: string;
  tableName: string;
}

export interface SaltongConfig extends BaseConfig {
  maxTries: number;
  wordLen: number;
  tableName: `saltong-${SaltongGameMode}-rounds`;
}

export interface SaltongGameSettings extends BaseGameSettings {
  type: "saltong";
  mode: SaltongGameMode;
  config: SaltongConfig;
}

export interface HexRank {
  name: string;
  percentage: number;
  icon: string;
}

export interface HexConfig extends BaseConfig {
  ranks: HexRank[];
}

export interface HexGameSettings extends BaseGameSettings {
  type: "hex";
  config: HexConfig;
}

export type GameSettings = SaltongGameSettings | HexGameSettings;
