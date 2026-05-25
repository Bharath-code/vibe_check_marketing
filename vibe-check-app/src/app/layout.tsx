import type { Metadata } from "next";
import { Instrument_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AI Vibe Check — Pre-publish Tone QA for Indian Brands",
  description: "Does your brand copy pass the Gen Z feed test? Catch the cringe, get structured feedback, and access brand-safe edits in 10 seconds.",
  openGraph: {
    title: "AI Vibe Check",
    description: "Catch the cringe before it goes live. Pre-publish tone QA for Indian brands targeting Gen Z.",
    type: "website",
  }
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-vc-bg text-vc-text font-sans">
        {children}
        {modal}
      </body>
    </html>
  );
}
