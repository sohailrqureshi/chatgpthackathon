import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "InterimPop — Space for what’s next",
  description:
    "A temporary land activation co-pilot for Singapore. Hackathon demo.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
