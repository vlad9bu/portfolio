import type { Metadata } from "next";
import MoveTheKing from "./MoveTheKing";

export const metadata: Metadata = {
  title: "Move The King — A Business Logic Game",
  description:
    "One company, four business decisions, two independent players. Test your judgment against the AI King.",
  alternates: {
    canonical: "/move-the-king",
  },
  openGraph: {
    type: "website",
    title: "Move The King",
    description:
      "A four-move business logic game by Vlad Budko. The board changes after every decision.",
    images: [
      {
        url: "/og-move-the-king.png",
        width: 1734,
        height: 907,
        alt: "Move The King — A Business Logic Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Move The King",
    description:
      "A four-move business logic game by Vlad Budko. The board changes after every decision.",
    images: ["/og-move-the-king.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function MoveTheKingPage() {
  return <MoveTheKing />;
}
