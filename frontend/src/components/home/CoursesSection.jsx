"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getCourses } from "@/services/courses.service";
import CourseCard from "./courses/CoursesCard";

export default function CoursesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCourses({ featured: true, limit: 6, sort: "displayOrder", order: "asc" })
      .then((result) => {
        if (active) setCourses(result.courses);
      })
      .catch((error) =>
        console.error("Unable to load featured courses:", error),
      )
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!loading && courses.length === 0) return null;

  return (
    <section
      data-reveal
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="motion-float-slow pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="motion-float pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      <div className="relative mx-auto max-w-300 px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div data-reveal="left">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
              Popular programmes
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured courses in Europe
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted">
              Discover career-focused courses at leading European universities.
            </p>
          </div>
          <div data-reveal="right">
            <Link
              href="/courses"
              className="group inline-flex w-fit items-center gap-2 rounded-xl border border-primary/25 bg-primary-light px-5 py-3 text-sm font-bold text-primary transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
            >
              View all courses
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="h-96 animate-pulse rounded-[1.75rem] border border-border bg-card-hover"
                />
              ))
            : courses.slice(0, 6).map((course, index) => (
                <div
                  key={course._id || course.slug}
                  data-reveal="scale"
                  data-delay={(index % 3) + 1}
                  className="h-full"
                >
                  <CourseCard course={course} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
