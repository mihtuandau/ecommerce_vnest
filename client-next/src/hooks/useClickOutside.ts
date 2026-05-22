"use client";

import { type RefObject, useEffect } from "react";

type EventName = "mousedown" | "mouseup" | "touchstart" | "touchend" | "click";

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  eventName: EventName = "mousedown"
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;

      if (!element || element.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener(eventName, listener);
    return () => document.removeEventListener(eventName, listener);
  }, [eventName, handler, ref]);
}
