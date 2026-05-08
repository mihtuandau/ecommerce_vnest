import React from "react";

export default function PolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
        <main className="flex-1 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
