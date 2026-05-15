import React from "react";

export default function PolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <main className="flex-1 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
