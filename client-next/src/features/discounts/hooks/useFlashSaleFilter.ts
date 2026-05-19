"use client";

import { useState, useMemo, useEffect } from "react";
import { getSessionStatus } from "../utils/flashSaleUtils";
import { FLASH_SALE_CONSTANTS, FLASH_SALE_MESSAGES, FLASH_SALE_SORT_OPTIONS } from "@/features/discounts/constants";

export function useFlashSaleFilter(sessions: any[]) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);  
  const [filterCat, setFilterCat] = useState<string>(FLASH_SALE_MESSAGES.ALL_CATEGORIES);
  const [sortBy, setSortBy] = useState<string>(FLASH_SALE_SORT_OPTIONS.MOST_DISCOUNT);

  const sortedSessions = useMemo(() => {
    if (!Array.isArray(sessions)) return [];
    return [...sessions].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }, [sessions]);

  useEffect(() => {
    if (sortedSessions.length > 0 && !activeSessionId) {
      const live = sortedSessions.find(
        (s) => getSessionStatus(s.startDate, s.endDate) === FLASH_SALE_CONSTANTS.STATUS.LIVE
      );
      if (live) setActiveSessionId(live.id);
      else setActiveSessionId(sortedSessions[0].id);
    }
  }, [sortedSessions, activeSessionId]);

  const activeSession = useMemo(() => 
    sortedSessions.find((s) => s.id === activeSessionId) || sortedSessions[0],
    [sortedSessions, activeSessionId]
  );

  const products = activeSession?.products || [];

  const filteredProducts = useMemo(() => {
    let list = [...products].filter(
      (p: any) => filterCat === FLASH_SALE_MESSAGES.ALL_CATEGORIES || p.category?.name === filterCat
    );
    
    if (sortBy === FLASH_SALE_SORT_OPTIONS.MOST_DISCOUNT) {
      list.sort((a: any, b: any) => (b.percentage ?? 0) - (a.percentage ?? 0));
    } else if (sortBy === FLASH_SALE_SORT_OPTIONS.LOWEST_PRICE) {
      list.sort(
        (a: any, b: any) =>
          (a.fixedAmount ?? a.basePrice) - (b.fixedAmount ?? b.basePrice)
      );
    } else if (sortBy === FLASH_SALE_SORT_OPTIONS.BEST_SELLERS) {
      list.sort((a: any, b: any) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
    }
    
    return list;
  }, [products, filterCat, sortBy]);

  const categories = useMemo(() => {
    const cats = products
      .map((p: any) => p.category?.name)
      .filter((name: string) => !!name);
    return Array.from(new Set(cats));
  }, [products]);

  const nextSession = useMemo(() => {
    return sortedSessions.find(
      (s) => getSessionStatus(s.startDate, s.endDate) === FLASH_SALE_CONSTANTS.STATUS.SOON
    );
  }, [sortedSessions]);

  return {
    activeSessionId,
    setActiveSessionId,
    activeSession,
    sortedSessions,
    filteredProducts,
    categories,
    filterCat,
    setFilterCat,
    sortBy,
    setSortBy,
    nextSession,
    products
  };
}
