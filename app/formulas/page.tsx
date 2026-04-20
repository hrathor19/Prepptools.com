import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Formula Cheat Sheets — Finance, Math & Health | PreppTools",
  description: "Quick reference formulas for EMI, GST, SIP, BMI, compound interest, percentage, and more. Free printable cheat sheets.",
  alternates: { canonical: "https://www.prepptools.com/formulas" },
};

type Formula = { name: string; formula: string; variables?: string[]; example?: string };
type Sheet = { id: string; title: string; color: string; bg: string; border: string; formulas: Formula[]; toolLink?: string; toolName?: string };

const sheets: Sheet[] = [
  {
    id: "finance",
    title: "Finance Formulas",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-700",
    toolLink: "/tools/loan-calculator",
    toolName: "EMI Calculator",
    formulas: [
      {
        name: "EMI (Loan)",
        formula: "EMI = [P × r × (1+r)ⁿ] / [(1+r)ⁿ − 1]",
        variables: ["P = Principal loan amount", "r = Monthly interest rate (annual rate ÷ 12 ÷ 100)", "n = Loan tenure in months"],
        example: "₹10L loan, 8.5% p.a., 20 years → EMI ≈ ₹8,678/month",
      },
      {
        name: "SIP Maturity Value",
        formula: "M = P × [(1 + r)ⁿ − 1] / r × (1 + r)",
        variables: ["P = Monthly SIP amount", "r = Monthly return rate (annual ÷ 12 ÷ 100)", "n = Number of months"],
        example: "₹5,000/month for 10 years @ 12% p.a. → ≈ ₹11.6L",
      },
      {
        name: "Compound Interest",
        formula: "A = P × (1 + r/n)^(n×t)",
        variables: ["P = Principal", "r = Annual interest rate (decimal)", "n = Compounding frequency per year", "t = Time in years"],
        example: "₹1L @ 8% compounded monthly for 5 years → ₹1,48,978",
      },
      {
        name: "Simple Interest",
        formula: "SI = (P × R × T) / 100",
        variables: ["P = Principal", "R = Annual rate (%)", "T = Time in years"],
      },
      {
        name: "FD Maturity (Quarterly Compounding)",
        formula: "M = P × (1 + r/4)^(4×t)",
        variables: ["P = Deposit amount", "r = Annual rate (decimal)", "t = Time in years"],
      },
    ],
  },
  {
    id: "tax",
    title: "Tax Formulas (India)",
    color: "text-green-700 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-700",
    toolLink: "/tools/gst-calculator",
    toolName: "GST Calculator",
    formulas: [
      {
        name: "GST Inclusive Price → Base Price",
        formula: "Base Price = Inclusive Price / (1 + GST rate/100)",
        example: "Price ₹118 with 18% GST → Base = 118/1.18 = ₹100",
      },
      {
        name: "GST Exclusive Price → Total Price",
        formula: "Total = Base Price × (1 + GST rate/100)",
        example: "₹100 + 18% GST = ₹100 × 1.18 = ₹118",
      },
      {
        name: "GST Amount",
        formula: "GST = Base Price × GST rate / 100",
      },
      {
        name: "Income Tax (New Regime FY 2025-26)",
        formula: "Slab rates: 0–4L: 0% | 4–8L: 5% | 8–12L: 10% | 12–16L: 15% | 16–20L: 20% | 20–24L: 25% | >24L: 30%",
        variables: ["Add 4% cess on tax", "87A rebate up to ₹25,000 if income ≤ ₹12L"],
      },
      {
        name: "TDS on Salary",
        formula: "TDS = (Estimated Annual Tax) / 12",
        variables: ["Employer deducts this monthly from salary"],
      },
    ],
  },
  {
    id: "math",
    title: "Math & Percentage",
    color: "text-purple-700 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-700",
    toolLink: "/tools/percentage-calculator",
    toolName: "Percentage Calculator",
    formulas: [
      {
        name: "Percentage of a Number",
        formula: "Result = (Percentage / 100) × Number",
        example: "15% of 200 = (15/100) × 200 = 30",
      },
      {
        name: "What % is X of Y?",
        formula: "% = (X / Y) × 100",
        example: "30 is what % of 200? = (30/200) × 100 = 15%",
      },
      {
        name: "Percentage Increase",
        formula: "% Increase = [(New − Old) / Old] × 100",
        example: "Price went from ₹80 to ₹100 → (20/80) × 100 = 25% increase",
      },
      {
        name: "Percentage Decrease",
        formula: "% Decrease = [(Old − New) / Old] × 100",
      },
      {
        name: "Discount Price",
        formula: "Final Price = Original × (1 − Discount% / 100)",
        example: "₹500 with 20% off = 500 × 0.80 = ₹400",
      },
      {
        name: "Profit / Loss %",
        formula: "Profit% = [(SP − CP) / CP] × 100",
        variables: ["SP = Selling Price", "CP = Cost Price"],
      },
    ],
  },
  {
    id: "health",
    title: "Health & Fitness",
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-200 dark:border-rose-700",
    toolLink: "/tools/bmi-calculator",
    toolName: "BMI Calculator",
    formulas: [
      {
        name: "BMI",
        formula: "BMI = Weight (kg) / Height² (m²)",
        variables: ["<18.5: Underweight", "18.5–24.9: Normal", "25–29.9: Overweight", "≥30: Obese"],
        example: "70 kg, 1.75 m → BMI = 70 / (1.75²) = 22.9 (Normal)",
      },
      {
        name: "BMR (Mifflin-St Jeor)",
        formula: "Men: BMR = 10W + 6.25H − 5A + 5\nWomen: BMR = 10W + 6.25H − 5A − 161",
        variables: ["W = Weight (kg)", "H = Height (cm)", "A = Age (years)"],
      },
      {
        name: "TDEE (Total Daily Energy Expenditure)",
        formula: "TDEE = BMR × Activity Factor",
        variables: ["Sedentary: × 1.2", "Light active: × 1.375", "Moderate: × 1.55", "Very active: × 1.725"],
      },
      {
        name: "Max Heart Rate",
        formula: "Max HR = 220 − Age",
        example: "Age 30 → Max HR = 190 bpm",
      },
      {
        name: "Ideal Body Weight (Devine Formula)",
        formula: "Men: 50 + 2.3 × (height in inches − 60)\nWomen: 45.5 + 2.3 × (height in inches − 60)",
      },
      {
        name: "Daily Water Intake",
        formula: "Water (litres) = Weight (kg) × 0.033",
        example: "70 kg → 70 × 0.033 = 2.3 litres/day",
      },
    ],
  },
];

export default function FormulasPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Reference</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Formula Cheat Sheets</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          Quick reference formulas for finance, tax, math, and health. Bookmark this page — you&apos;ll use it again.
        </p>
      </div>

      {/* Jump links */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {sheets.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-colors ${s.bg} ${s.border} ${s.color}`}>
            {s.title}
          </a>
        ))}
      </div>

      <div className="space-y-14">
        {sheets.map((sheet) => (
          <section key={sheet.id} id={sheet.id}>
            <div className={`flex items-center justify-between mb-5 pb-3 border-b ${sheet.border}`}>
              <h2 className={`text-xl font-bold ${sheet.color}`}>{sheet.title}</h2>
              {sheet.toolLink && (
                <Link href={sheet.toolLink} className={`text-xs font-semibold ${sheet.color} hover:underline`}>
                  → {sheet.toolName}
                </Link>
              )}
            </div>

            <div className="space-y-5">
              {sheet.formulas.map((f) => (
                <div key={f.name} className={`rounded-2xl border p-5 ${sheet.bg} ${sheet.border}`}>
                  <h3 className={`font-bold text-sm mb-2 ${sheet.color}`}>{f.name}</h3>
                  <code className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm font-mono text-gray-800 dark:text-gray-100 whitespace-pre-wrap mb-3">
                    {f.formula}
                  </code>
                  {f.variables && (
                    <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-0.5 mb-2 ml-2">
                      {f.variables.map((v) => <li key={v}>• {v}</li>)}
                    </ul>
                  )}
                  {f.example && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">Example: {f.example}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4">
        <Link href="/tools" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Browse All Calculators →</Link>
        <Link href="/glossary" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Glossary of Terms →</Link>
      </div>
    </div>
  );
}
