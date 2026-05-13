"use client";
import { useEffect, useState } from "react";

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 hidden sm:block mix-blend-screen transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, var(--accent-soft), transparent 40%)`,
      }}
    />
  );
}
