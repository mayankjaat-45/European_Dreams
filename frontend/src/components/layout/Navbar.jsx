"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Universities", href: "/universities" },
  { name: "Courses", href: "/courses" },
  { name: "Blogs", href: "/blogs" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function MenuIcon({ open }) {
  return (
    <div className="relative h-6 w-6">
      {/* Hamburger */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
          open
            ? "rotate-90 scale-75 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      >
        <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
      </svg>

      {/* Close */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
          open
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-75 opacity-0"
        }`}
      >
        <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
      </svg>
    </div>
  );
}

function ThemeIcon() {
  return (
    <>
      {/* Sun */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="hidden h-5 w-5 transition-transform duration-500 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          strokeLinecap="round"
          d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
        />
      </svg>

      {/* Moon */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 transition-transform duration-500 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 15.2A9 9 0 1 1 8.8 3 7 7 0 0 0 21 15.2Z"
        />
      </svg>
    </>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [themeAnimating, setThemeAnimating] = useState(false);

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const toggleTheme = () => {
    setThemeAnimating(true);

    const nextTheme = !document.documentElement.classList.contains("dark");

    document.documentElement.classList.toggle("dark", nextTheme);

    localStorage.setItem("theme", nextTheme ? "dark" : "light");

    setTimeout(() => {
      setThemeAnimating(false);
    }, 500);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 shadow-sm backdrop-blur-xl transition-colors duration-300">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-20 max-w-300 items-center justify-between px-5 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="European Dreams home"
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div className="relative transition-transform duration-300 ease-out group-hover:-rotate-3 group-hover:scale-105">
            <Image
              src="/images/european-dreams-logo.png"
              alt="European Dreams logo"
              width={52}
              height={52}
              priority
              className="h-11 w-11 object-contain sm:h-12 sm:w-12"
            />
          </div>

          <span className="flex items-center text-xl font-extrabold tracking-tight sm:text-2xl">
            <span className="text-primary transition-colors duration-300">
              European
            </span>

            <span className="ml-1 text-secondary transition-colors duration-300">
              Dreams
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                  active ? "text-primary" : "text-muted hover:text-primary"
                }`}
              >
                {item.name}

                {/* Animated underline */}
                <span
                  className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ${
                    active ? "w-6" : "w-0 group-hover:w-6"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className={`group grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card-hover hover:text-primary hover:shadow-md ${
              themeAnimating ? "rotate-180 scale-90" : "rotate-0"
            }`}
          >
            <div className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              <ThemeIcon />
            </div>
          </button>

          {/* Consultation */}
          <Link
            href="/contact"
            className="group relative hidden overflow-hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/20 sm:inline-flex"
          >
            {/* Shine animation */}
            <span className="absolute inset-y-0 -left-12 w-8 rotate-12 bg-white/20 blur-md transition-all duration-700 group-hover:left-[120%]" />

            <span className="relative">Free Consultation</span>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className={`grid h-10 w-10 place-items-center rounded-lg text-foreground transition-all duration-300 hover:bg-card-hover hover:text-primary lg:hidden ${
              menuOpen ? "bg-card-hover text-primary" : ""
            }`}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      <div
        id="mobile-navigation"
        className={`grid overflow-hidden border-border bg-background transition-all duration-500 ease-in-out lg:hidden ${
          menuOpen
            ? "grid-rows-[1fr] border-t opacity-100"
            : "grid-rows-[0fr] border-t-0 opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-5 py-5 shadow-xl">
            <div className="grid">
              {navigation.map((item, index) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      transitionDelay: menuOpen ? `${index * 45}ms` : "0ms",
                    }}
                    className={`relative rounded-lg px-3 py-3 text-base font-medium transition-all duration-300 ${
                      menuOpen
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-4 opacity-0"
                    } ${
                      active
                        ? "bg-primary-light text-primary"
                        : "text-muted hover:translate-x-1 hover:bg-card-hover hover:text-primary"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {item.name}

                      {active && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className={`mt-3 inline-flex w-full justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-lg shadow-primary/15 transition-all duration-500 hover:bg-primary-hover sm:hidden ${
                menuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0"
              }`}
            >
              Book Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
