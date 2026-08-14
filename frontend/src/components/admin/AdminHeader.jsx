"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";

import {
  clearAdminSession,
  getStoredAdmin,
} from "@/services/admin-auth.service";

export default function AdminHeader({ onOpenMobile }) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const profileRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    setMounted(true);
    setAdmin(getStoredAdmin());
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    clearAdminSession();

    setProfileOpen(false);
    router.replace("/admin");
    router.refresh();
  };

  const displayName =
    admin?.name || admin?.fullName || admin?.username || "Administrator";

  const displayEmail = admin?.email || "admin@europeandreams.org";

  const displayRole = admin?.role
    ? admin.role
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase())
    : "Administrator";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
        {/* Left side */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobile}
            aria-label="Open navigation menu"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-card text-foreground shadow-sm transition hover:border-primary/30 hover:bg-card-hover lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="min-w-0">
            <p className="truncate text-lg font-bold tracking-[-0.02em] text-foreground sm:text-xl">
              Admin Dashboard
            </p>

            <p className="mt-0.5 hidden text-xs text-muted sm:block">
              Manage the European Dreams website
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Desktop search */}
          <div className="relative hidden xl:block">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="search"
              placeholder="Search dashboard..."
              className="h-11 w-64 rounded-xl border border-border bg-card py-2 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          {/* Mobile search */}
          <button
            type="button"
            aria-label="Search dashboard"
            className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card text-muted shadow-sm transition hover:border-primary/30 hover:bg-card-hover hover:text-primary xl:hidden"
          >
            <Search size={20} />
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={
              mounted
                ? `Switch to ${isDark ? "light" : "dark"} theme`
                : "Toggle theme"
            }
            className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card text-muted shadow-sm transition hover:border-primary/30 hover:bg-card-hover hover:text-primary"
          >
            {!mounted ? (
              <span className="h-5 w-5" />
            ) : isDark ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* Notifications */}
          <button
            type="button"
            aria-label="View notifications"
            className="relative grid h-11 w-11 place-items-center rounded-xl border border-border bg-card text-muted shadow-sm transition hover:border-primary/30 hover:bg-card-hover hover:text-primary"
          >
            <Bell size={20} />

            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-danger" />
          </button>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((current) => !current)}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              className={`flex h-12 items-center gap-3 rounded-xl border bg-card p-1.5 pr-2 shadow-sm transition sm:pr-3 ${
                profileOpen
                  ? "border-primary ring-4 ring-primary/10"
                  : "border-border hover:border-primary/30 hover:bg-card-hover"
              }`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-xs font-bold text-white shadow-sm">
                {initials || "AD"}
              </span>

              <span className="hidden min-w-0 text-left md:block">
                <span className="block max-w-32 truncate text-sm font-bold text-foreground">
                  {displayName}
                </span>

                <span className="mt-0.5 block max-w-32 truncate text-[11px] font-medium text-muted">
                  {displayRole}
                </span>
              </span>

              <ChevronDown
                size={16}
                className={`hidden text-muted transition-transform duration-200 sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile dropdown */}
            <div
              role="menu"
              className={`absolute right-0 top-[calc(100%+12px)] w-70 origin-top-right rounded-2xl border border-border bg-card p-2 shadow-[0_20px_60px_rgba(9,20,38,0.18)] transition-all duration-200 ${
                profileOpen
                  ? "visible translate-y-0 scale-100 opacity-100"
                  : "invisible -translate-y-2 scale-95 opacity-0"
              }`}
            >
              <div className="rounded-xl bg-(--hero-gradient) p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-white shadow-md shadow-primary/20">
                    {initials || "AD"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                      {displayName}
                    </p>

                    <p className="mt-1 truncate text-xs text-muted">
                      {displayEmail}
                    </p>

                    <span className="mt-2 inline-flex rounded-full bg-primary-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {displayRole}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    router.push("/admin/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-muted transition hover:bg-card-hover hover:text-foreground"
                >
                  <UserRound size={18} />
                  My profile
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    router.push("/admin/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-muted transition hover:bg-card-hover hover:text-foreground"
                >
                  <Settings size={18} />
                  Account settings
                </button>
              </div>

              <div className="my-2 border-t border-border" />

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-danger transition hover:bg-danger/10"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
