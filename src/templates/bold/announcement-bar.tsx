"use client";

import { useState, useEffect } from "react";

interface AnnouncementBarProps {
  messages: string[];
}

export function AnnouncementBar({ messages }: AnnouncementBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [messages.length]);

  if (messages.length === 0) return null;

  return (
    <div className="bg-brand-primary text-brand-primary-foreground">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4">
        <p
          className={`text-center text-xs font-medium tracking-wide transition-opacity duration-300 sm:text-sm ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {messages[currentIndex]}
        </p>
      </div>
    </div>
  );
}
