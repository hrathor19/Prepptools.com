import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "LifeTools — Free Online Tools for Everyone",
    template: "%s | LifeTools",
  },
  description:
    "Free, fast online tools for text, math, health, finance, and more. No sign-up, no ads, no cost. Just tools that work.",
  keywords: [
    "free online tools",
    "word counter",
    "BMI calculator",
    "unit converter",
    "password generator",
    "JSON formatter",
    "life tools",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script runs before paint — prevents flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-900 antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
