"use client";

import dynamic from "next/dynamic";

const SocialProof = dynamic(
  () =>
    import("@/components/marketing/SocialProof").then((mod) => mod.SocialProof),
  { ssr: false }
);

export function CustomerSocialProof() {
  return <SocialProof />;
}
