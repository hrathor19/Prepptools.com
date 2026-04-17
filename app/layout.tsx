import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

const BASE_URL = "https://www.prepptools.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  title: {
    default: "PreppTools — Free Online Tools for Everyone",
    template: "%s | PreppTools",
  },
  description:
    "PreppTools — Free, fast online tools for text, math, health, finance, PDF, and more. No sign-up, no ads, no cost. Just tools that work.",
  keywords: [
    "free online tools", "word counter", "BMI calculator", "unit converter",
    "password generator", "JSON formatter", "merge PDF", "compress image",
    "ATS score checker", "QR code generator", "PreppTools",
  ],
  authors: [{ name: "PreppTools", url: BASE_URL }],
  creator: "PreppTools",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "PreppTools",
    title: "PreppTools — Free Online Tools for Everyone",
    description:
      "Free, fast online tools for text, math, health, finance, PDF, and more. No sign-up required.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "PreppTools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PreppTools — Free Online Tools for Everyone",
    description:
      "Free, fast online tools for text, math, health, finance, PDF, and more. No sign-up required.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  alternates: { canonical: BASE_URL },
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
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2650947460011910" crossOrigin="anonymous" />
        {/* Microsoft Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","wd07x3k632");`,
          }}
        />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GC16LZSHH1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-GC16LZSHH1');`,
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
