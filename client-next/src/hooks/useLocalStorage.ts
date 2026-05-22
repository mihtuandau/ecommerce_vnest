"use client";

import { useCallback, useEffect, useState } from "react";

type SetValue<T> = T | ((prevValue: T) => T);

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      setStoredValue(initialValue);
    }
  }, [initialValue, key]);

  const setValue = useCallback(
    (value: SetValue<T>) => {
      setStoredValue((prevValue) => {
        const nextValue =
          value instanceof Function ? value(prevValue) : value;

        window.localStorage.setItem(key, JSON.stringify(nextValue));
        return nextValue;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    window.localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [initialValue, key]);

  return [storedValue, setValue, removeValue] as const;
}
