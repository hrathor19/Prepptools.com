"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PenSquare, LogOut, ExternalLink, MessageCircle, BookMarked, Plus, Menu, X, Tag } from "lucide-react";
import { useState } from "react";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-orange-400 text-sm tracking-wide uppercase shrink-0">
              PreppTools Admin
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <NavLink href="/admin" label="Dashboard" icon={<LayoutDashboard className="w-3.5 h-3.5" />} active={pathname === "/admin"} />
              <NavLink href="/admin/posts" label="Blog Posts" icon={<PenSquare className="w-3.5 h-3.5" />} active={isActive("/admin/posts")} />
              <NavLink href="/admin/cheatsheets" label="Courses" icon={<BookMarked className="w-3.5 h-3.5" />} active={isActive("/admin/cheatsheets") && !isActive("/admin/categories")} />
              <NavLink href="/admin/categories" label="Categories" icon={<Tag className="w-3.5 h-3.5" />} active={isActive("/admin/categories")} />
              <NavLink href="/admin/qa" label="Q&A" icon={<MessageCircle className="w-3.5 h-3.5" />} active={isActive("/admin/qa")} />
            </nav>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick Add dropdown */}
            <div className="relative hidden md:block">
              <button onClick={() => setNewOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors">
                <Plus className="w-3.5 h-3.5" /> New
              </button>
              {newOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNewOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    <Link href="/admin/posts/new" onClick={() => setNewOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <PenSquare className="w-4 h-4 text-orange-500" /> Blog Post
                    </Link>
                    <Link href="/admin/cheatsheets/new" onClick={() => setNewOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100 transition-colors">
                      <BookMarked className="w-4 h-4 text-emerald-500" /> Course
                    </Link>
                  </div>
                </>
              )}
            </div>
            <Link href="/" target="_blank"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> View Site
            </Link>
            <button onClick={logout}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
            <button onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-800 space-y-0.5">
            <MobileLink href="/admin" label="Dashboard" icon={<LayoutDashboard className="w-4 h-4" />} active={pathname === "/admin"} close={() => setMobileOpen(false)} />
            <MobileLink href="/admin/posts" label="Blog Posts" icon={<PenSquare className="w-4 h-4" />} active={isActive("/admin/posts")} close={() => setMobileOpen(false)} />
            <MobileLink href="/admin/posts/new" label="↳ New Post" icon={<Plus className="w-4 h-4" />} active={false} close={() => setMobileOpen(false)} indent />
            <MobileLink href="/admin/cheatsheets" label="Courses" icon={<BookMarked className="w-4 h-4" />} active={isActive("/admin/cheatsheets") && !isActive("/admin/categories")} close={() => setMobileOpen(false)} />
            <MobileLink href="/admin/cheatsheets/new" label="↳ New Course" icon={<Plus className="w-4 h-4" />} active={false} close={() => setMobileOpen(false)} indent />
            <MobileLink href="/admin/categories" label="Categories" icon={<Tag className="w-4 h-4" />} active={isActive("/admin/categories")} close={() => setMobileOpen(false)} />
            <MobileLink href="/admin/qa" label="Q&A" icon={<MessageCircle className="w-4 h-4" />} active={isActive("/admin/qa")} close={() => setMobileOpen(false)} />
            <div className="flex items-center gap-2 pt-3 mt-2 border-t border-gray-800">
              <Link href="/" target="_blank" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <ExternalLink className="w-4 h-4" /> View Site
              </Link>
              <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active: boolean }) {
  return (
    <Link href={href}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        active ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}>
      {icon} {label}
    </Link>
  );
}

function MobileLink({ href, label, icon, active, close, indent }: {
  href: string; label: string; icon: React.ReactNode; active: boolean; close: () => void; indent?: boolean;
}) {
  return (
    <Link href={href} onClick={close}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${indent ? "ml-5 text-xs" : ""} ${
        active ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}>
      {icon} {label}
    </Link>
  );
}
