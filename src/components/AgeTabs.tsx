"use client";

import { AGE_GROUPS } from "@/lib/supabase";

type AgeTabsProps = {
  value: string;
  onChange: (value: string) => void;
};

export function AgeTabs({ value, onChange }: AgeTabsProps) {
  return (
    <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {AGE_GROUPS.map((group) => {
        const active = group.key === value;

        return (
          <button
            key={group.key}
            type="button"
            onClick={() => onChange(group.key)}
            className={`tap-active shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-moss text-white shadow-lg shadow-moss/20"
                : "bg-white text-stone-600 shadow-sm"
            }`}
          >
            {group.label}
          </button>
        );
      })}
    </div>
  );
}
