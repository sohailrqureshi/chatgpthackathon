import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://interimpop-sg-hackathon.impressivecob.chatgpt.site"),
  title: "InterimPop — Space for what’s next",
  description:
    "A temporary land activation co-pilot for Singapore. Hackathon demo.",
  openGraph: {
    title: "InterimPop — Space for what’s next",
    description: "Find temporary spaces. Bring ideas to life.",
    type: "website",
    images: [{ url: "/interimpop-project-preview.png", width: 1672, height: 941, alt: "InterimPop Singapore map and AI co-pilot project preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "InterimPop — Space for what’s next",
    description: "Find temporary spaces. Bring ideas to life.",
    images: ["/interimpop-project-preview.png"],
  },
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
