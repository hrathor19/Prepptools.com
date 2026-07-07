export type CheatsheetInput = {
  title: string;
  description: string;
  longDescription: string;
  price: number; // paise
  originalPrice: number | null; // paise
  category: string;
  tags: string[];
  previewImageUrl: string | null;
  pdfPath: string;
  pages: number;
  isPublished: boolean;
  isFree: boolean;
};

type ParseResult = { ok: true; data: CheatsheetInput } | { ok: false; error: string };

export function parseCheatsheetInput(body: Record<string, unknown>): ParseResult {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return { ok: false, error: "Title is required" };

  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (!description) return { ok: false, error: "Description is required" };

  const pdfPath = typeof body.pdfPath === "string" ? body.pdfPath.trim() : "";
  if (!pdfPath) return { ok: false, error: "A PDF must be uploaded before saving" };

  const isFree = !!body.isFree;

  let price = 0;
  if (!isFree) {
    const rupees = Number(body.price);
    if (!Number.isFinite(rupees) || rupees < 1) {
      return { ok: false, error: "Price must be at least ₹1 for a paid course" };
    }
    price = Math.round(rupees * 100);
  }

  let originalPrice: number | null = null;
  if (body.originalPrice !== undefined && body.originalPrice !== null && body.originalPrice !== "") {
    const rupees = Number(body.originalPrice);
    if (!Number.isFinite(rupees) || rupees < 0) {
      return { ok: false, error: "Original price is invalid" };
    }
    originalPrice = Math.round(rupees * 100);
  }

  let pages = 0;
  if (body.pages !== undefined && body.pages !== null && body.pages !== "") {
    const parsed = Number(body.pages);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return { ok: false, error: "Pages must be a non-negative number" };
    }
    pages = parsed;
  }

  return {
    ok: true,
    data: {
      title,
      description,
      longDescription: typeof body.longDescription === "string" ? body.longDescription : "",
      price,
      originalPrice,
      category: typeof body.category === "string" && body.category.trim() ? body.category.trim() : "General",
      tags: Array.isArray(body.tags) ? body.tags : [],
      previewImageUrl: typeof body.previewImageUrl === "string" ? body.previewImageUrl : null,
      pdfPath,
      pages,
      isPublished: !!body.isPublished,
      isFree,
    },
  };
}
