import {
  DEFAULT_WISHLIST_COLLECTIONS,
  WISHLIST_ASSIGNMENTS_STORAGE_KEY,
  WISHLIST_COLLECTIONS_STORAGE_KEY,
} from "@/features/wishlist/constants";
import type {
  CustomCollection,
  WishlistItemCollections,
} from "@/features/wishlist/types";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  const value = localStorage.getItem(key);
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(error);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadWishlistCollections() {
  const collections = readJson<CustomCollection[] | null>(
    WISHLIST_COLLECTIONS_STORAGE_KEY,
    null
  );

  if (collections) return collections;

  writeJson(WISHLIST_COLLECTIONS_STORAGE_KEY, DEFAULT_WISHLIST_COLLECTIONS);
  return DEFAULT_WISHLIST_COLLECTIONS;
}

export function saveWishlistCollections(collections: CustomCollection[]) {
  writeJson(WISHLIST_COLLECTIONS_STORAGE_KEY, collections);
}

export function loadWishlistAssignments() {
  return readJson<WishlistItemCollections>(WISHLIST_ASSIGNMENTS_STORAGE_KEY, {});
}

export function saveWishlistAssignments(assignments: WishlistItemCollections) {
  writeJson(WISHLIST_ASSIGNMENTS_STORAGE_KEY, assignments);
}
