import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/tools-data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-3">
              <Image src="/logo.png" alt="PreppTools" width={150} height={0} className="w-[150px] h-auto" />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Free, fast, and privacy-friendly tools for everyday tasks.
              No sign-up. No ads. Just tools that work.
            </p>
          </div>

          {/* Categories col 1 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.slice(0, Math.ceil(categories.length / 2)).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/tools?category=${cat.id}`}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories col 2 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide opacity-0 select-none">
              &nbsp;
            </h3>
            <ul className="space-y-2">
              {categories.slice(Math.ceil(categories.length / 2)).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/tools?category=${cat.id}`}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
              More
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/tools", label: "All Tools" },
                { href: "/blog", label: "Blog" },
                { href: "/qa", label: "Q&A" },
                { href: "/about", label: "About Us" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {currentYear} PreppTools. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Free forever · No sign-up required · Privacy friendly
          </p>
        </div>
      </div>
    </footer>
  );
}
