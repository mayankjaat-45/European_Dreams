"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  Clock3,
  GraduationCap,
  MailQuestion,
  MessageSquareQuote,
  Plus,
  RefreshCw,
  University,
  UsersRound,
} from "lucide-react";

import API from "@/lib/api";

const statCards = [
  {
    key: "universities",
    label: "Universities",
    icon: University,
    href: "/admin/universities",
    color: "text-violet-600",
    background: "bg-violet-500/10",
  },
  {
    key: "courses",
    label: "Courses",
    icon: GraduationCap,
    href: "/admin/courses",
    color: "text-emerald-600",
    background: "bg-emerald-500/10",
  },
  {
    key: "blogs",
    label: "Published Blogs",
    icon: BookOpenText,
    href: "/admin/blogs",
    color: "text-amber-600",
    background: "bg-amber-500/10",
  },
  {
    key: "enquiries",
    label: "Total Enquiries",
    icon: MailQuestion,
    href: "/admin/enquiries",
    color: "text-rose-600",
    background: "bg-rose-500/10",
  },
];

const quickActions = [
  {
    label: "Add university",
    href: "/admin/universities/create",
    icon: University,
  },
  {
    label: "Add course",
    href: "/admin/courses/create",
    icon: GraduationCap,
  },
  {
    label: "Write blog",
    href: "/admin/blogs/create",
    icon: BookOpenText,
  },
  {
    label: "Add testimonial",
    href: "/admin/testimonials/create",
    icon: MessageSquareQuote,
  },
];

const initialDashboard = {
  overview: {
    universities: {
      total: 0,
      active: 0,
      featured: 0,
    },
    courses: {
      total: 0,
      active: 0,
      featured: 0,
    },
    blogs: {
      total: 0,
      published: 0,
      draft: 0,
      featured: 0,
    },
    enquiries: {
      total: 0,
      today: 0,
      new: 0,
      contacted: 0,
      followUp: 0,
      qualified: 0,
      converted: 0,
      closed: 0,
    },
  },
  performance: {
    responseRate: 0,
    conversionRate: 0,
  },
  recentEnquiries: [],
};

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getStatusClasses = (status = "") => {
  const normalizedStatus = status.toLowerCase();

  if (
    ["resolved", "converted", "completed", "closed"].includes(normalizedStatus)
  ) {
    return "bg-success/10 text-success";
  }

  if (
    ["contacted", "in_progress", "follow_up", "qualified"].includes(
      normalizedStatus,
    )
  ) {
    return "bg-primary/10 text-primary";
  }

  return "bg-secondary/10 text-secondary";
};

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async ({ refresh = false } = {}) => {
    try {
      setError("");

      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await API.get("/api/dashboard/stats");
      const data = response.data?.data || {};

      setDashboard({
        overview: {
          ...initialDashboard.overview,
          ...(data.overview || {}),
        },
        performance: {
          ...initialDashboard.performance,
          ...(data.performance || {}),
        },
        recentEnquiries: data.recentEnquiries || [],
      });
    } catch (requestError) {
      console.error("Dashboard request failed:", requestError);

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load dashboard information.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">
            Overview
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
            Welcome to European Dreams
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            Monitor enquiries and manage all website content from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadDashboard({ refresh: true })}
          disabled={refreshing}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/30 hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-60 md:self-auto"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />

          {refreshing ? "Refreshing..." : "Refresh data"}
        </button>
      </section>

      {/* Error message */}
      {error && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 px-5 py-4 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;

          const value =
            item.key === "blogs"
              ? (dashboard.overview?.blogs?.published ?? 0)
              : (dashboard.overview?.[item.key]?.total ?? 0);

          return (
            <Link
              key={item.key}
              href={item.href}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`grid h-12 w-12 place-items-center rounded-xl ${item.background} ${item.color}`}
                >
                  <Icon size={23} />
                </div>

                <ArrowRight
                  size={18}
                  className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>

              <p className="mt-5 text-3xl font-bold tracking-[-0.03em] text-foreground">
                {loading ? (
                  <span className="block h-9 w-16 animate-pulse rounded-lg bg-card-hover" />
                ) : (
                  Number(value).toLocaleString("en-IN")
                )}
              </p>

              <p className="mt-1 text-sm font-medium text-muted">
                {item.label}
              </p>
            </Link>
          );
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
        {/* Recent enquiries */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Recent enquiries
              </h2>

              <p className="mt-1 text-sm text-muted">
                Latest consultation and contact requests.
              </p>
            </div>

            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:text-primary-hover"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-4 px-5 py-5 sm:px-6"
                >
                  <div className="h-11 w-11 rounded-xl bg-card-hover" />

                  <div className="flex-1">
                    <div className="h-4 w-36 rounded bg-card-hover" />
                    <div className="mt-2 h-3 w-52 rounded bg-card-hover" />
                  </div>
                </div>
              ))
            ) : dashboard.recentEnquiries.length > 0 ? (
              dashboard.recentEnquiries.map((enquiry) => {
                const enquiryId = enquiry._id || enquiry.id;

                return (
                  <Link
                    key={enquiryId}
                    href={`/admin/enquiries/${enquiryId}`}
                    className="flex flex-col gap-4 px-5 py-5 transition hover:bg-card-hover sm:flex-row sm:items-center sm:px-6"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <UsersRound size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-foreground">
                          {enquiry.name || "Website visitor"}
                        </p>

                        <p className="mt-1 truncate text-sm text-muted">
                          {enquiry.email ||
                            enquiry.phone ||
                            "No contact information"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusClasses(
                          enquiry.status,
                        )}`}
                      >
                        {(enquiry.status || "new").replaceAll("_", " ")}
                      </span>

                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-muted">
                        <Clock3 size={14} />
                        {formatDate(enquiry.createdAt)}
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <MailQuestion size={25} />
                </div>

                <h3 className="mt-4 font-bold text-foreground">
                  No enquiries yet
                </h3>

                <p className="mt-2 text-sm text-muted">
                  New website enquiries will appear here.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Quick actions */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Quick actions</h2>

            <p className="mt-1 text-sm text-muted">
              Create and manage website content.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={19} />
                  </div>

                  <span className="flex-1 text-sm font-bold text-foreground">
                    {action.label}
                  </span>

                  <Plus
                    size={18}
                    className="text-muted transition group-hover:rotate-90 group-hover:text-primary"
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
