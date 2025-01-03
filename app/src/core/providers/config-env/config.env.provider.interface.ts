export interface ConfigEnvProviderInterface {
  /**
   * Gets a configuration value by name of type generic.
   * @param key Key name of env
   * @param defaultValue Default value if the key does not exist.
   */
  get<T = string>(key: string, defaultValue?: T): T;

  /**
   * Gets a configuration value by name of type string.
   * @param key Key name of env
   * @param defaultValue Default value if the key does not exist.
   */
  getString(key: string, defaultValue?: string): string;

  /**
   * Gets a configuration value by name of type number.
   * @param key Key name of env
   * @param defaultValue Default value if the key does not exist.
   */
  getNumber(key: string, defaultValue?: number): number;

  /**
   * Gets a configuration value by name of type boolean.
   * @param key Key name of env
   * @param defaultValue Default value if the key does not exist.
   */
  getBoolean(key: string, defaultValue?: boolean): boolean;
}
