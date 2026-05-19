"use client";

import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { MANAGED_ROLES, ROLE_CONFIG } from "../constants";

interface RoleTabsListProps {
  dirtyRoles: Set<string>;
}

export function RoleTabsList({ dirtyRoles }: RoleTabsListProps) {
  return (
    <TabsList className="bg-slate-100 p-1 h-12 rounded-xl mb-6 flex w-full max-w-2xl">
      {MANAGED_ROLES.map((role) => (
        <TabsTrigger
          key={role}
          value={role}
          className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold text-xs uppercase tracking-wider"
        >
          {ROLE_CONFIG[role].label}
          {dirtyRoles.has(role) && (
            <div className="ml-2 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
