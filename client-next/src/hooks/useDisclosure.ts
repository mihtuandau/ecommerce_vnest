"use client";

import { useCallback, useMemo, useState } from "react";

export function useDisclosure(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  return useMemo(
    () => ({
      close,
      isOpen,
      onOpenChange: setIsOpen,
      open,
      toggle,
    }),
    [close, isOpen, open, toggle]
  );
}
