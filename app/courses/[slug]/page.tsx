import { getAdminClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import BuyButton from "@/components/cheatsheets/BuyButton";
import WishlistButton from "@/components/cheatsheets/WishlistButton";
import CourseRow from "@/components/cheatsheets/CourseRow";
import {
  ChevronRight, FileText, Tag, Download, BookOpen, Globe, BadgeCheck,
  FileEdit, MessageSquare, ArrowRight,
} from "lucide-react";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const admin = getAdminClient();
  const { data } = await admin
    .from("cheatsheets")
    .select("title, description")
    .eq("slug", slug)
    .single();
  return { title: data?.title ?? "Course | PreppTools", description: data?.description };
}

export default async function CheatsheetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = getAdminClient();

  const { data: sheet } = await admin
    .from("cheatsheets")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!sheet) notFound();

  const { data: relatedRaw } = await admin
    .from("cheatsheets")
    .select("id, slug, title, description, price, original_price, is_free, category, pages, preview_image_url")
    .eq("category", sheet.category)
    .eq("is_published", true)
    .neq("slug", slug)
    .limit(12);

  const relatedCourses = (relatedRaw ?? []).map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description ?? "",
    price: c.price ?? 0,
    originalPrice: c.original_price ?? null,
    isFree: c.is_free,
    category: c.category,
    pages: c.pages ?? 0,
    previewImageUrl: c.preview_image_url ?? null,
  }));

  const priceDisplay = sheet.price
    ? (sheet.price / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : "0";
  const originalPriceDisplay = sheet.original_price && sheet.original_price > sheet.price
    ? (sheet.original_price / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : null;

  return (
    <div className="bg-gray-50">
      {/* ─────────── DARK HERO ─────────── */}
      <section className="bg-gray-950 lg:min-h-[300px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="lg:max-w-[calc(100%-370px)]">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-xs text-gray-400 mb-6 flex-wrap">
              <Link href="/courses" className="hover:text-purple-400 transition-colors">
                Courses
              </Link>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span>{sheet.category}</span>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-gray-300 line-clamp-1">{sheet.title}</span>
            </nav>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
              {sheet.title}
            </h1>

            {/* Description */}
            {sheet.description && (
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                {sheet.description}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {sheet.is_free ? (
                <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-sm">
                  Free
                </span>
              ) : (
                <>
                  <span className="text-xs font-bold border border-yellow-400 text-yellow-300 bg-yellow-950/50 px-2.5 py-1">
                    Bestseller
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-white px-2.5 py-1 rounded-sm" style={{ backgroundColor: "#03adc5" }}>
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Premium
                  </span>
                </>
              )}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-gray-400">
              {sheet.pages > 0 && (
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  {sheet.pages} pages
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 shrink-0" />
                {sheet.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 shrink-0" />
                English
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 shrink-0" />
                Instant Download
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────── CONTENT + SIDEBAR ─────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_330px] lg:gap-10 lg:items-stretch">

          {/* ── Left: course content ── */}
          <div className="py-8">

            {/* Mobile purchase card */}
            <div className="lg:hidden mb-8 bg-white border border-gray-200 shadow-lg overflow-hidden">
              <div className="relative w-full aspect-video bg-gray-100">
                {sheet.preview_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sheet.preview_image_url}
                    alt={sheet.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                    <FileText className="w-14 h-14 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="p-5 bg-white">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <p className="text-3xl font-bold text-gray-900">
                    {sheet.is_free ? "Free" : `₹${priceDisplay}`}
                  </p>
                  {!sheet.is_free && originalPriceDisplay && (
                    <p className="text-lg text-gray-400 line-through">₹{originalPriceDisplay}</p>
                  )}
                </div>
                {!sheet.is_free && (
                  <p className="text-xs text-gray-500 mb-4">One-time purchase · Lifetime access</p>
                )}
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <BuyButton
                      cheatsheetId={sheet.id}
                      slug={sheet.slug}
                      title={sheet.title}
                      price={sheet.price}
                      isFree={sheet.is_free}
                    />
                  </div>
                  <WishlistButton cheatsheetId={sheet.id} />
                </div>
              </div>
            </div>

            {/* Course content */}
            {sheet.long_description && (
              <div className="bg-white border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What you&apos;ll learn</h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {sheet.long_description}
                </p>
              </div>
            )}
          </div>

          {/* ── Right: sticky purchase card (desktop) ── */}
          <div className="hidden lg:block relative">
            <div className="-mt-[260px] sticky top-4">
              <div className="bg-white border border-gray-200 shadow-2xl overflow-hidden">

                {/* Preview image */}
                <div className="relative w-full aspect-video bg-gray-100">
                  {sheet.preview_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sheet.preview_image_url}
                      alt={sheet.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                      <FileText className="w-14 h-14 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Price + CTA */}
                <div className="p-5">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <p className="text-3xl font-bold text-gray-900">
                      {sheet.is_free ? "Free" : `₹${priceDisplay}`}
                    </p>
                    {!sheet.is_free && originalPriceDisplay && (
                      <p className="text-lg text-gray-400 line-through">₹{originalPriceDisplay}</p>
                    )}
                  </div>
                  {!sheet.is_free && (
                    <p className="text-xs text-gray-500 mb-4">
                      One-time purchase · Lifetime access
                    </p>
                  )}
                  <div className={`flex gap-2 items-start ${sheet.is_free ? "mb-4" : ""}`}>
                    <div className="flex-1">
                      <BuyButton
                        cheatsheetId={sheet.id}
                        slug={sheet.slug}
                        title={sheet.title}
                        price={sheet.price}
                        isFree={sheet.is_free}
                      />
                    </div>
                    <WishlistButton cheatsheetId={sheet.id} />
                  </div>

                  {/* This course includes */}
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-3">
                      This course includes
                    </p>
                    <ul className="space-y-2.5">
                      {[
                        {
                          Icon: FileText,
                          text: sheet.pages > 0 ? `${sheet.pages} pages of content` : "Complete content",
                        },
                        { Icon: Download, text: "Instant PDF download" },
                        { Icon: BookOpen, text: "Full lifetime access" },
                        { Icon: Tag,      text: sheet.category },
                      ].map(({ Icon, text }) => (
                        <li key={text} className="flex items-center gap-2.5 text-sm text-gray-600">
                          <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─────────── RELATED COURSES + PROMO ─────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* Explore related topics */}
        {relatedCourses.length > 0 && (
          <div className="mt-2">
            <CourseRow
              title="Explore related topics"
              subtitle={`More ${sheet.category} courses you might like`}
              courses={relatedCourses}
            />
          </div>
        )}

        {/* Resume Builder + Interview Prep promo */}
        <section className="mt-8 py-7 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Level up your career</h2>
          <p className="text-sm text-gray-500 mb-5">Free tools to help you land your next job</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Resume Builder */}
            <Link
              href="/resume-builder"
              className="group flex items-start gap-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all p-5"
            >
              <div className="shrink-0 w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <FileEdit className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    Resume Builder
                  </h3>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0 transition-colors" />
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Build an ATS-friendly resume with live preview. Download as .docx instantly — no sign-up needed.
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                  Free
                </span>
              </div>
            </Link>

            {/* Interview Prep */}
            <Link
              href="/interview-prep"
              className="group flex items-start gap-4 bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all p-5"
            >
              <div className="shrink-0 w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                    Interview Prep Hub
                  </h3>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 shrink-0 transition-colors" />
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  60+ role-specific questions, STAR answer builder, and salary negotiation scripts — all free.
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                  Free
                </span>
              </div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
