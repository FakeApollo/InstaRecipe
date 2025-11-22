import type { Metadata } from "next";
import "./globals.css";
import BackToTop from "../components/BackToTop";

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
    <html lang="en" crxlauncher="">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased bg-black"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
