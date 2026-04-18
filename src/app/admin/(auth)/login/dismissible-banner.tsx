"use client";

import { useEffect, useState } from "react";

/**
 * Auto-dismissing error banner pinned to the top of the viewport.
 * Renders via fixed positioning so it appears above the auth card.
 * Hides after 4 seconds or when the user clicks the × button.
 */
export function DismissibleBanner({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center p-4">
      <div
        className="flex items-center gap-3 rounded-lg bg-red-50 px-5 py-3 text-sm text-red-700 shadow-md"
        role="alert"
      >
        <span>{message}</span>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-red-500 hover:text-red-800"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
}
