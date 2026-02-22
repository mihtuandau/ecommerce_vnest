/**
 * Build a deterministic cache key from a prefix and query object.
 * 
 * Unlike JSON.stringify, this sorts keys alphabetically so that
 * {page:1, limit:10} and {limit:10, page:1} produce the same key.
 * Undefined/null values are omitted to avoid unnecessary cache misses.
 * 
 * @example
 * buildCacheKey('products', { page: 1, limit: 10, search: 'shirt' })
 * // => "products:limit=10:page=1:search=shirt"
 */
export function buildCacheKey(prefix: string, query: Record<string, any>): string {
  const parts = Object.keys(query)
    .sort()
    .filter((key) => query[key] !== undefined && query[key] !== null && query[key] !== '')
    .map((key) => `${key}=${query[key]}`);

  return parts.length > 0 ? `${prefix}:${parts.join(':')}` : prefix;
}
