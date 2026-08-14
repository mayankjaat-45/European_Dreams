"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getUniversities } from "@/services/universities.service";
import UniversityCard from "./universities/UniversityCard";

function UniversityCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[1.75rem] border border-border bg-card">
      <div className="h-52 bg-card-hover" />

      <div className="space-y-4 p-6">
        <div className="h-4 w-1/3 rounded bg-card-hover" />
        <div className="h-7 w-4/5 rounded bg-card-hover" />
        <div className="h-4 w-1/2 rounded bg-card-hover" />
        <div className="h-16 rounded bg-card-hover" />

        <div className="h-10 border-t border-border pt-5">
          <div className="h-4 w-2/5 rounded bg-card-hover" />
        </div>
      </div>
    </div>
  );
}

export default function UniversitiesSection() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadUniversities() {
      try {
        const result = await getUniversities({
          page: 1,
          limit: 6,
          isFeatured: true,
          sort: "displayOrder",
          order: "asc",
        });

        if (isActive) {
          setUniversities(result?.universities || []);
        }
      } catch (error) {
        console.error("Unable to load featured universities:", error);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadUniversities();

    return () => {
      isActive = false;
    };
  }, []);

  if (!loading && universities.length === 0) {
    return null;
  }

  return (
    <section
      data-reveal="scale"
      className="relative overflow-hidden bg-card-hover/40 py-16 sm:py-20 lg:py-24"
    >
      {/* Decorative background */}
      <div className="motion-float-slow pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="motion-float pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto max-w-300 px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div data-reveal="left">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
              Our university network
            </p>

            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Top universities in our network
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-muted">
              Explore trusted European universities offering quality education,
              career-focused programmes and opportunities for international
              students.
            </p>
          </div>

          <div data-reveal="right">
            <Link
              href="/universities"
              className="group inline-flex w-fit items-center gap-2 rounded-xl border border-primary/25 bg-primary-light px-5 py-3 text-sm font-bold text-primary transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            >
              View all universities
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>

        {/* University cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }, (_, index) => (
                <UniversityCardSkeleton key={index} />
              ))
            : universities.map((university, index) => (
                <div
                  key={university._id || university.slug}
                  data-reveal="scale"
                  data-delay={(index % 3) + 1}
                >
                  <UniversityCard university={university} />
                </div>
              ))}
        </div>

        {/* Mobile action */}
        {!loading && universities.length > 0 && (
          <div
            data-reveal
            data-delay="4"
            className="mt-10 flex justify-center sm:hidden"
          >
            <Link
              href="/universities"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20"
            >
              Explore all universities
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
