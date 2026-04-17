import { Suspense } from "react";
import ToolsPageContent from "./ToolsPageContent";

export const metadata = {
  title: "All Free Online Tools",
  description:
    "Browse 100+ free online tools — word counter, BMI calculator, PDF merger, unit converter, QR code generator, and more. No sign-up required.",
  alternates: { canonical: "https://www.prepptools.com/tools" },
  openGraph: {
    title: "All Free Online Tools — PreppTools",
    description: "Browse 100+ free online tools. No sign-up required.",
    url: "https://www.prepptools.com/tools",
  },
};

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading...</div>}>
      <ToolsPageContent />
    </Suspense>
  );
}
