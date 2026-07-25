import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "vladbudko.com";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Vlad Budko — Co-founder & CEO, GrowKong Group",
    description:
      "Founder-operator building GrowKong Group, software companies, distribution systems, and the operating infrastructure around them.",
    alternates: {
      canonical: origin,
    },
    icons: {
      icon: "/vlad-budko.jpg",
      apple: "/vlad-budko.jpg",
    },
    openGraph: {
      type: "profile",
      url: origin,
      title: "Vlad Budko — Co-founder & CEO",
      description:
        "I build software companies and the systems around them.",
      images: [
        {
          url: `${origin}/og.png`,
          width: 1731,
          height: 909,
          alt: "Vlad Budko — Co-founder & CEO, GrowKong Group",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Vlad Budko — Co-founder & CEO",
      description:
        "I build software companies and the systems around them.",
      images: [`${origin}/og.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
