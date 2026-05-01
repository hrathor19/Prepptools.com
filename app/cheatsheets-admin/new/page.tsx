import CheatsheetForm from "@/components/cheatsheets/CheatsheetForm";

export const metadata = { title: "New Cheatsheet" };

export default function NewCheatsheetPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">New Cheatsheet</h1>
        <p className="text-sm text-gray-400 mt-0.5">Fill in the details and upload a PDF to list your cheatsheet.</p>
      </div>
      <CheatsheetForm />
    </div>
  );
}
