import type { Metadata } from "next";
import ResumeTemplatesClient from "@/components/ResumeTemplatesClient";

export const metadata: Metadata = {
  title: "Free ATS-Friendly Resume Templates — Download PDF | PreppTools",
  description: "Download 12 free ATS-friendly resume templates as PDF. Role-specific templates for Software Engineer, Data Analyst, Product Manager, and more. No sign-up needed.",
  keywords: ["ATS resume template", "free resume template", "ATS-friendly resume", "resume download PDF", "software engineer resume", "data analyst resume"],
  alternates: { canonical: "https://www.prepptools.com/resume-templates" },
  openGraph: {
    title: "Free ATS-Friendly Resume Templates — Download PDF | PreppTools",
    description: "12 free ATS-friendly resume templates. Role-specific for SWE, Data Analyst, PM, and more. Download instantly as PDF.",
    url: "https://www.prepptools.com/resume-templates",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Free ATS-Friendly Resume Templates | PreppTools",
    description: "12 free ATS-friendly resume templates. Download instantly as PDF. No sign-up needed.",
  },
};

export default function ResumeTemplatesPage() {
  return <ResumeTemplatesClient />;
}
