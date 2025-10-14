import type { Metadata } from "next";
import ThemeProvider from "./ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Chronos - AI Text Reconstruction",
  description:
    "Advanced AI-powered text fragment reconstruction using Gemini and semantic search.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
