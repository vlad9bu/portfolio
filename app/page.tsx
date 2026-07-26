import type { Metadata } from "next";
import MinimalFocusEdition from "./minimal-v2/page";

export const metadata: Metadata = {
  title: "Vlad Budko — Co-founder & CEO, GrowKong Group",
  description:
    "Founder-operator building GrowKong Group, software companies, distribution systems, and the operating infrastructure around them.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    title: "Vlad Budko — Co-founder & CEO, GrowKong Group",
    description:
      "Founder-operator building GrowKong Group and the systems around it.",
    images: [
      {
        url: "/og-minimal.png",
        width: 1734,
        height: 907,
        alt: "Vlad Budko — Founder / Operator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vlad Budko — Co-founder & CEO, GrowKong Group",
    description:
      "Founder-operator building GrowKong Group and the systems around it.",
    images: ["/og-minimal.png"],
  },
};

export default function Home() {
  return <MinimalFocusEdition />;
}
