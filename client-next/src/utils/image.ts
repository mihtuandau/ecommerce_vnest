import { env } from "@/config/env";

/**
 * Normalizes an image path by:
 * 1. Handling null/undefined (returns placeholder)
 * 2. Keeping full URLs (http/https) as-is
 * 3. Converting backslashes to forward slashes
 * 4. Prefixing relative paths with the backend base URL
 * 
 * @param path The raw path string from the API
 * @returns A full URL or local asset path
 */
export function getImageUrl(input?: any): string {
  const placeholder = "https://placehold.co/600x400/f8fafc/64748b?text=LUXE";
  
  if (!input) return placeholder;

  let path: any = null;

  // 1. Handle case where input is a string
  if (typeof input === "string") {
    // If it looks like a JSON string of an array (common backend quirk), try to parse it
    if (input.startsWith("[") && input.endsWith("]")) {
      try {
        const parsed = JSON.parse(input);
        return getImageUrl(parsed);
      } catch (e) {
        // Fallback to treat it as a literal string
        path = input;
      }
    } else {
      path = input;
    }
  } 
  // 2. Handle case where input is an object (not null)
  else if (typeof input === "object" && input !== null) {
    // If it's an array, take the first element and recurse
    if (Array.isArray(input)) {
      if (input.length === 0) return placeholder;
      return getImageUrl(input[0]);
    }
    // If it's a ProductImage object { url: '...' }
    if (input.url) {
      path = input.url;
    }
  }

  // 3. Final check: If path is not a valid non-empty string
  if (!path || typeof path !== "string" || path.trim() === "") {
    return placeholder;
  }

  // 4. Handle full URLs and data URLs
  if (path.startsWith("http") || path.startsWith("data:")) {
    return path;
  }

  // 5. Build full URL for relative paths
  const cleanPath = path.replace(/\\/g, "/").replace(/^\//, "");
  const apiUrl = env.NEXT_PUBLIC_API_URL || "";
  const baseUrl = apiUrl.replace(/\/api$/, "");
  
  return `${baseUrl}/${cleanPath}`;
}

