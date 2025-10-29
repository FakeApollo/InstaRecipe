import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InstaRecipe",
  description: "Find recipes based on ingredients you have",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" webcrx="">
      <body className="antialiased">{children}</body>
    </html>
  );
}
