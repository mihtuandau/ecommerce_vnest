"use client";

import { FlashSalePreview } from "@/features/discounts/components/customer";
import type { FlashSaleSession } from "@/features/discounts/types/discount.types";
import { FlashSaleSkeleton } from "@/features/home/components/customer/skeletons/HomeSkeletons";

interface HomeFlashSaleSectionProps {
  sessions?: FlashSaleSession[] | null;
  isLoading: boolean;
}

function getRelevantFlashSaleSession(sessions: FlashSaleSession[]) {
  const now = new Date();

  return (
    sessions.find((session) => {
      const start = new Date(session.startDate);
      const end = session.endDate ? new Date(session.endDate) : null;

      return start <= now && (!end || end >= now);
    }) || sessions[0]
  );
}

export function HomeFlashSaleSection({
  sessions,
  isLoading,
}: HomeFlashSaleSectionProps) {
  if (isLoading) {
    return (
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
        <FlashSaleSkeleton />
      </section>
    );
  }

  const flashSaleSessions = Array.isArray(sessions) ? sessions : [];
  if (flashSaleSessions.length === 0) return null;

  const activeSession = getRelevantFlashSaleSession(flashSaleSessions);

  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
      <FlashSalePreview
        data={{
          ...activeSession,
          endDate: activeSession.endDate || activeSession.startDate,
        }}
      />
    </section>
  );
}
