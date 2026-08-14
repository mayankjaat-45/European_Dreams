"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  CircleGauge,
  FileSearch,
  GraduationCap,
  LayoutDashboard,
  MailQuestion,
  MessageSquareQuote,
  Settings,
  University,
  X,
} from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Universities",
    href: "/admin/universities",
    icon: University,
  },
  {
    name: "Courses",
    href: "/admin/courses",
    icon: GraduationCap,
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: BookOpenText,
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  {
    name: "Enquiries",
    href: "/admin/enquiries",
    icon: MailQuestion,
  },
  {
    name: "SEO",
    href: "/admin/seo",
    icon: FileSearch,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  collapsed = false,
  mobileOpen = false,
  onToggleCollapse,
  onCloseMobile,
}) {
  const pathname = usePathname();

  const isActiveRoute = (href) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile overlay */}
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onCloseMobile}
        className={`fixed inset-0 z-40 bg-[#091426]/60 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          border-r border-border bg-card
          shadow-[12px_0_40px_rgba(16,33,61,0.08)]
          transition-[width,transform] duration-300 ease-out
          lg:translate-x-0 lg:shadow-none
          ${collapsed ? "lg:w-23" : "lg:w-70"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          w-70
        `}
      >
        {/* Logo */}
        <div
          className={`flex h-20 shrink-0 items-center border-b border-border ${
            collapsed
              ? "justify-between px-5 lg:justify-center lg:px-3"
              : "justify-between px-5"
          }`}
        >
          <Link
            href="/"
            onClick={onCloseMobile}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
              <GraduationCap size={24} strokeWidth={2.1} />
            </div>

            <div
              className={`min-w-0 transition-opacity duration-200 ${
                collapsed
                  ? "lg:pointer-events-none lg:hidden lg:opacity-0"
                  : "opacity-100"
              }`}
            >
              <p className="truncate font-display text-xl font-bold leading-none tracking-[-0.03em]">
                <span className="text-primary">European</span>{" "}
                <span className="text-secondary">Dreams</span>
              </p>

              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                Administration
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted transition hover:bg-card-hover hover:text-foreground lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
          <div
            className={`mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted ${
              collapsed ? "lg:text-center" : ""
            }`}
          >
            <span className={collapsed ? "lg:hidden" : ""}>Main menu</span>

            {collapsed && (
              <CircleGauge
                size={17}
                className="mx-auto hidden text-muted lg:block"
              />
            )}
          </div>

          <nav className="space-y-1.5" aria-label="Admin navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActiveRoute(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  title={collapsed ? item.name : undefined}
                  aria-current={active ? "page" : undefined}
                  className={`
                    group relative flex min-h-12 items-center rounded-xl
                    px-3.5 py-3 text-sm font-semibold
                    transition-all duration-200
                    ${
                      collapsed
                        ? "lg:justify-center lg:px-2"
                        : "justify-start gap-3"
                    }
                    ${
                      active
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-muted hover:bg-card-hover hover:text-foreground"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.3 : 2}
                    className="shrink-0"
                  />

                  <span
                    className={`truncate ${collapsed ? "lg:hidden" : "block"}`}
                  >
                    {item.name}
                  </span>

                  {active && !collapsed && (
                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-white/80" />
                  )}

                  {/* Tooltip for collapsed desktop sidebar */}
                  {collapsed && (
                    <span
                      className="
                        pointer-events-none absolute left-[calc(100%+14px)]
                        z-50 hidden whitespace-nowrap rounded-lg
                        border border-border bg-card px-3 py-2
                        text-xs font-semibold text-foreground opacity-0
                        shadow-xl transition-opacity
                        group-hover:opacity-100 lg:block
                      "
                    >
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-border p-3">
          <div
            className={`rounded-2xl bg-(--hero-gradient) ${
              collapsed ? "p-2.5 lg:flex lg:justify-center" : "p-4"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-white shadow-md shadow-secondary/20">
                <GraduationCap size={20} />
              </div>

              <div className={collapsed ? "lg:hidden" : "min-w-0"}>
                <p className="truncate text-sm font-bold text-foreground">
                  European Dreams
                </p>

                <p className="mt-0.5 truncate text-xs text-muted">
                  Study abroad platform
                </p>
              </div>
            </div>
          </div>

          {/* Desktop collapse button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`
              mt-3 hidden h-10 w-full items-center rounded-xl
              text-sm font-semibold text-muted transition
              hover:bg-card-hover hover:text-foreground lg:flex
              ${collapsed ? "justify-center" : "justify-center gap-2"}
            `}
          >
            {collapsed ? (
              <ChevronRight size={19} />
            ) : (
              <>
                <ChevronLeft size={19} />
                Collapse sidebar
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
