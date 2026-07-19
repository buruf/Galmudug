import type { ReactNode } from "react";
import "./globals.css";

// The real <html lang> is set in [locale]/layout.tsx; this root layout only
// exists for global CSS and top-level error/not-found boundaries.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
