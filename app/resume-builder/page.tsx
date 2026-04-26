import type { Metadata } from "next";
import ResumeBuilderClient from "@/components/ResumeBuilderClient";

export const metadata: Metadata = {
  title: "Free Resume Builder — ATS-Friendly | PreppTools",
  description: "Build your resume online with a live preview. Fill in each section and download an ATS-friendly .docx file instantly. No sign-up needed.",
  keywords: ["resume builder", "free resume builder", "ATS resume builder", "online resume maker", "resume builder India", "resume download docx"],
  alternates: { canonical: "https://www.prepptools.com/resume-builder" },
  openGraph: {
    title: "Free Resume Builder — ATS-Friendly | PreppTools",
    description: "Build your ATS-friendly resume online with live preview. Download as .docx instantly. No sign-up needed.",
    url: "https://www.prepptools.com/resume-builder",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Free Resume Builder | PreppTools",
    description: "Build your ATS-friendly resume with live preview. Download as .docx. Free, no sign-up.",
  },
};

export default function ResumeBuilderPage() {
  return <ResumeBuilderClient />;
}
