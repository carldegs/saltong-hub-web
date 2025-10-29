/**
 * Base interface for all game registries.
 */
export interface BaseGameRegistry {
  readonly id: string;
  readonly displayName: string;
}

/**
 * Base configuration for a game or mode.
 */
export interface BaseConfig {
  readonly displayName: string;
  readonly path: string;
  readonly icon: string;
  readonly blurb: string;
  readonly colorScheme: string;
}

/**
 * Configuration for a specific mode.
 * AdditionalConfigs is intersected for extensibility.
 */
export type ModeConfig<
  ModeType extends string = string,
  AdditionalConfigs = Record<string, never>,
> = BaseConfig & { readonly mode: ModeType } & AdditionalConfigs;

/**
 * Game registry for games without modes.
 */
export type GameRegistryWithoutModes<
  AdditionalConfigs = Record<string, never>,
> = Readonly<
  BaseGameRegistry & BaseConfig & AdditionalConfigs & { hasModes: false }
>;

/**
 * Utility type for a record of modes.
 */
export type ModesRecord<
  ModeType extends string,
  AdditionalConfigs = Record<string, never>,
> = Readonly<Record<ModeType, ModeConfig<ModeType, AdditionalConfigs>>>;

/**
 * Game registry for games with modes.
 */
export type GameRegistryWithModes<
  AdditionalConfigs = Record<string, never>,
  ModeType extends string = string,
> = Readonly<
  BaseGameRegistry & {
    hasModes: true;
    modes: ModesRecord<ModeType, AdditionalConfigs>;
  }
>;

/**
 * Union type for any game registry.
 */
export type GameRegistry<
  AdditionalConfigs = Record<string, never>,
  ModeType extends string = string,
> =
  | GameRegistryWithoutModes<AdditionalConfigs>
  | GameRegistryWithModes<AdditionalConfigs, ModeType>;
