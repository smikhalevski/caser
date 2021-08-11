export type Maybe<T> = T | null | undefined;

export function createMap<T>(): Record<string, T> {
  return Object.create(null);
}
