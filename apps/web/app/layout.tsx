import type { Metadata } from "next";
import Link from "next/link";
import { SERIES_NAME, SERIES_TAGLINE, NAV } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: SERIES_NAME,
  description: SERIES_TAGLINE,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="nav">
          <Link href="/" className="nav__brand">
            <span className="nav__logo" aria-hidden />
            {SERIES_NAME}
          </Link>
          <nav className="nav__links">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
          </nav>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <span>{SERIES_NAME}</span>
          <span>· building in public ·</span>
        </footer>
      </body>
    </html>
  );
}
