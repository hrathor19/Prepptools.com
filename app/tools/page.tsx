import { Suspense } from "react";
import ToolsPageContent from "./ToolsPageContent";

export const metadata = {
  title: "All Tools",
  description:
    "Browse all free online tools — text, math, health, finance, developer tools, and more. No sign-up required.",
};

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading...</div>}>
      <ToolsPageContent />
    </Suspense>
  );
}
