"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, ShoppingBag, Heart, Bookmark, Bell, UserCircle } from "lucide-react";
import Image from "next/image";
import ToolsDropdown from "./ToolsDropdown";
import { useAuth } from "./AuthProvider";

const navLinks = [
  { href: "/interview-prep", label: "Interview Prep" },
  { href: "/resume-builder", label: "Resume Builder" },
  { href: "/courses", label: "Courses" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isToolsActive = pathname.startsWith("/tools");
  const { user, loading, unreadCount, signOut } = useAuth();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo → About Us */}
          <Link href="/about" className="flex items-center shrink-0" title="About PreppTools">
            <Image src="/logo.png" alt="PreppTools — About Us" width={150} height={0} priority className="w-[150px] h-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Home
            </Link>

            <ToolsDropdown isActive={isToolsActive} />

            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="ml-2 flex items-center gap-2">
              {!loading && (
                user ? (
                  <div className="flex items-center gap-1">
                    {/* User Avatar + Dropdown */}
                    <div className="relative" ref={userMenuRef}>
                      <button
                        onClick={() => setUserMenuOpen((v) => !v)}
                        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        {user.user_metadata?.avatar_url ? (
                          <Image
                            src={user.user_metadata.avatar_url}
                            alt={user.user_metadata?.full_name ?? "User"}
                            width={28}
                            height={28}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            {(user.user_metadata?.full_name ?? user.email ?? "U")[0].toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                          {user.user_metadata?.full_name?.split(" ")[0] ?? "Account"}
                        </span>
                      </button>

                      {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-50">
                          <Link href="/account/profile" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <UserCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">My Profile</span>
                          </Link>

                          <Link href="/account/notifications" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <span className="flex items-center gap-2"><Bell className="w-4 h-4" />Notifications</span>
                            {unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {unreadCount > 9 ? "9+" : unreadCount}
                              </span>
                            )}
                          </Link>

                          <Link href="/account/wishlist" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Heart className="w-4 h-4 fill-red-400 text-red-400" />My Wishlist
                          </Link>

                          <Link href="/account/favourites" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Heart className="w-4 h-4" />Favourite Tools
                          </Link>

                          <Link href="/account/saved-blogs" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Bookmark className="w-4 h-4" />Saved Blogs
                          </Link>

                          <Link href="/purchases" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <ShoppingBag className="w-4 h-4" />My Purchases
                          </Link>

                          <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                          <button
                            onClick={() => { signOut(); setUserMenuOpen(false); }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <LogOut className="w-4 h-4" />Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link href="/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: "#34555a" }}>
                    Sign In
                  </Link>
                )
              )}
            </div>
          </nav>

          {/* Mobile right side */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 space-y-1">
          {[{ href: "/", label: "Home" }, { href: "/tools", label: "All Tools" }, ...navLinks].map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-1">
            {!loading && (
              user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2.5 mb-1">
                    {user.user_metadata?.avatar_url ? (
                      <Image src={user.user_metadata.avatar_url} alt="User" width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        {(user.user_metadata?.full_name ?? user.email ?? "U")[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {user.user_metadata?.full_name ?? "User"}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[180px]">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/account/notifications" onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <span className="flex items-center gap-2"><Bell className="w-4 h-4" />Notifications</span>
                    {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                  </Link>
                  <Link href="/account/wishlist" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Heart className="w-4 h-4 fill-red-400 text-red-400" />My Wishlist
                  </Link>
                  <Link href="/account/favourites" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Heart className="w-4 h-4" />Favourite Tools
                  </Link>
                  <Link href="/account/saved-blogs" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Bookmark className="w-4 h-4" />Saved Blogs
                  </Link>
                  <Link href="/purchases" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <ShoppingBag className="w-4 h-4" />My Purchases
                  </Link>
                  <button onClick={() => { signOut(); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <LogOut className="w-4 h-4" />Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white text-center hover:bg-blue-700">
                  Sign In with Google
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
