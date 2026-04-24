"use client";

import { useState, useCallback } from "react";

export function useOTP(length = 6) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      setOtp((prev) => {
        const next = [...prev];
        next[index] = value.slice(-1);
        return next;
      });
    },
    []
  );

  const reset = useCallback(() => {
    setOtp(Array(length).fill(""));
  }, [length]);

  return {
    otp,
    otpValue: otp.join(""),
    handleChange,
    reset,
    isComplete: otp.every((v) => v !== ""),
  };
}
