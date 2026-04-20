import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Glossary — Finance, Tech & Health Terms Explained | PreppTools",
  description: "Plain-English definitions of common finance, tech, health, and PDF terms. No jargon.",
  alternates: { canonical: "https://www.prepptools.com/glossary" },
};

type GlossaryEntry = { term: string; def: string; toolLink?: string; toolName?: string };

const entries: GlossaryEntry[] = [
  // Finance
  { term: "AUM", def: "Assets Under Management — the total market value of investments a fund or financial institution manages on behalf of clients." },
  { term: "CAGR", def: "Compound Annual Growth Rate — the mean annual growth rate of an investment over a time period, assuming profits are reinvested each year.", toolLink: "/tools/compound-interest", toolName: "Compound Interest Calculator" },
  { term: "CTC", def: "Cost to Company — the total amount an employer spends on an employee annually, including salary, PF, gratuity, and benefits.", toolLink: "/tools/salary-calculator", toolName: "Salary / CTC Calculator" },
  { term: "ELSS", def: "Equity Linked Savings Scheme — a type of mutual fund that qualifies for tax deduction under Section 80C of the Income Tax Act." },
  { term: "EMI", def: "Equated Monthly Instalment — a fixed monthly payment made to repay a loan, comprising both principal and interest.", toolLink: "/tools/loan-calculator", toolName: "EMI Calculator" },
  { term: "FD", def: "Fixed Deposit — a financial instrument where money is deposited at a bank for a fixed period at a guaranteed interest rate.", toolLink: "/tools/fd-calculator", toolName: "FD Calculator" },
  { term: "GST", def: "Goods and Services Tax — an indirect tax levied on the supply of goods and services in India.", toolLink: "/tools/gst-calculator", toolName: "GST Calculator" },
  { term: "HRA", def: "House Rent Allowance — a component of salary provided by employers to cover rental expenses. It is partially or fully tax-exempt." },
  { term: "NAV", def: "Net Asset Value — the per-unit value of a mutual fund, calculated as total assets minus liabilities divided by the number of units." },
  { term: "NPS", def: "National Pension System — a voluntary, long-term retirement savings scheme regulated by the Pension Fund Regulatory and Development Authority (PFRDA)." },
  { term: "PF / EPF", def: "Provident Fund / Employees' Provident Fund — a retirement savings scheme where both employee and employer contribute 12% of basic salary each month." },
  { term: "SIP", def: "Systematic Investment Plan — investing a fixed amount regularly (monthly) in a mutual fund. It averages the purchase cost and benefits from compounding.", toolLink: "/tools/sip-calculator", toolName: "SIP Calculator" },
  { term: "TDS", def: "Tax Deducted at Source — tax collected at the point of income generation (salary, interest, rent) and remitted to the government by the payer." },
  { term: "XIRR", def: "Extended Internal Rate of Return — a method to calculate return on investments with irregular cash flows, used for mutual funds with variable SIP amounts." },

  // Tech & Developer
  { term: "API", def: "Application Programming Interface — a set of rules that allows different software applications to communicate with each other." },
  { term: "ATS", def: "Applicant Tracking System — software used by companies to manage job applications, scan resumes for keywords, and rank candidates.", toolLink: "/tools/ats-score", toolName: "ATS Resume Scorer" },
  { term: "Base64", def: "An encoding scheme that converts binary data (like files or images) into a text string using 64 printable ASCII characters.", toolLink: "/tools/base64", toolName: "Base64 Encoder/Decoder" },
  { term: "CDN", def: "Content Delivery Network — a network of servers distributed geographically to deliver web content faster to users based on their location." },
  { term: "DNS", def: "Domain Name System — the internet's phone book, translating human-readable domain names (like google.com) into IP addresses." },
  { term: "Epoch / Unix Timestamp", def: "A system of time that counts the number of seconds elapsed since 1 January 1970, 00:00:00 UTC. Used in programming to represent time.", toolLink: "/tools/epoch-converter", toolName: "Epoch Converter" },
  { term: "JWT", def: "JSON Web Token — a compact, URL-safe token used to securely transmit information between parties. Used for authentication in web apps.", toolLink: "/tools/jwt-decoder", toolName: "JWT Decoder" },
  { term: "Minification", def: "The process of removing all unnecessary characters (spaces, comments, newlines) from source code to reduce file size without changing functionality.", toolLink: "/tools/css-minifier", toolName: "CSS Minifier" },
  { term: "QR Code", def: "Quick Response Code — a machine-readable optical label containing information, readable by smartphone cameras.", toolLink: "/tools/qr-code-generator", toolName: "QR Code Generator" },
  { term: "Regex", def: "Regular Expression — a sequence of characters that defines a search pattern. Used to find, validate, or replace text.", toolLink: "/tools/regex-tester", toolName: "Regex Tester" },
  { term: "UUID", def: "Universally Unique Identifier — a 128-bit identifier used to uniquely identify information in software systems.", toolLink: "/tools/uuid-generator", toolName: "UUID Generator" },

  // Health
  { term: "BMI", def: "Body Mass Index — a value calculated from a person's weight and height. BMI = weight (kg) / height² (m). A screening tool for weight category.", toolLink: "/tools/bmi-calculator", toolName: "BMI Calculator" },
  { term: "TDEE", def: "Total Daily Energy Expenditure — the total number of calories your body burns in a day, accounting for activity level and metabolism.", toolLink: "/tools/calorie-calculator", toolName: "Calorie Calculator" },
  { term: "RMR / BMR", def: "Resting/Basal Metabolic Rate — the number of calories your body needs at complete rest to maintain basic functions like breathing and circulation." },
  { term: "Systolic / Diastolic", def: "Blood pressure values. Systolic (top number) is the pressure when your heart beats. Diastolic (bottom number) is the pressure between beats. Normal: 120/80 mmHg." },
  { term: "Sleep Cycles", def: "The brain cycles through four stages of sleep roughly every 90 minutes. Waking mid-cycle causes grogginess; waking at the end feels refreshing.", toolLink: "/tools/sleep-calculator", toolName: "Sleep Calculator" },

  // PDF & Documents
  { term: "Flatten PDF", def: "Converting interactive elements (form fields, annotations) in a PDF into static, uneditable content.", toolLink: "/tools/flatten-pdf", toolName: "Flatten PDF" },
  { term: "OCR", def: "Optical Character Recognition — technology that converts images of text (scanned documents, photos) into machine-readable text." },
  { term: "PDF/A", def: "A subset of the PDF format designed for long-term archiving, ensuring the document remains viewable without external dependencies." },
  { term: "Lossless vs Lossy Compression", def: "Lossless preserves all original data (PNG, ZIP). Lossy discards some data for smaller file sizes (JPEG, MP3). Lossy is smaller but irreversible.", toolLink: "/tools/compress-image", toolName: "Image Compressor" },
  { term: "Watermark", def: "A text or image overlay applied to documents or images to indicate ownership, confidentiality, or draft status.", toolLink: "/tools/watermark-pdf", toolName: "Watermark PDF" },
];

// Group alphabetically
const grouped = entries.reduce<Record<string, GlossaryEntry[]>>((acc, entry) => {
  const letter = entry.term[0].toUpperCase();
  if (!acc[letter]) acc[letter] = [];
  acc[letter].push(entry);
  return acc;
}, {});

const letters = Object.keys(grouped).sort();

export default function GlossaryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Reference</p>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Glossary</h1>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
          Plain-English definitions of finance, tech, health, and PDF terms — no jargon.
        </p>
      </div>

      {/* Jump links */}
      <div className="flex flex-wrap gap-2 mb-10">
        {letters.map((l) => (
          <a key={l} href={`#${l}`} className="w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {l}
          </a>
        ))}
      </div>

      {/* Entries */}
      <div className="space-y-10">
        {letters.map((letter) => (
          <section key={letter} id={letter}>
            <h2 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
              {letter}
            </h2>
            <dl className="space-y-5">
              {grouped[letter].map((entry) => (
                <div key={entry.term}>
                  <dt className="font-bold text-gray-900 dark:text-white text-base">{entry.term}</dt>
                  <dd className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{entry.def}</dd>
                  {entry.toolLink && (
                    <Link href={entry.toolLink} className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1">
                      → {entry.toolName}
                    </Link>
                  )}
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-700">
        <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
