export function buildCacheKey(
  prefix: string,
  query: Record<string, any>,
): string {
  const parts = Object.keys(query)
    .sort()
    .filter(
      (key) =>
        query[key] !== undefined && query[key] !== null && query[key] !== '',
    )
    .map((key) => `${key}=${query[key]}`);

  return parts.length > 0 ? `${prefix}:${parts.join(':')}` : prefix;
}
