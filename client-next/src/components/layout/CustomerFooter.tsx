"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";
import type { SystemSettings } from "@/features/settings/types";

const Footer = dynamic(
  () => import("@/components/layout/Footer").then((mod) => mod.Footer),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[360px] w-full rounded-none" />,
  }
);

type CustomerFooterProps = {
  initialSettings?: SystemSettings | null;
};

export function CustomerFooter({ initialSettings }: CustomerFooterProps) {
  return <Footer initialSettings={initialSettings} />;
}
