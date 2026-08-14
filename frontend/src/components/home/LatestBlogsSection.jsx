"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import BlogCard from "./blogs/BlogCard";
import { getBlogs } from "@/services/blogs.service";


function BlogSkeleton() {
  return (
    <div
      className="
      overflow-hidden
      rounded-3xl
      border
      border-border
      bg-card
      "
    >
      <div className="aspect-video animate-pulse bg-card-hover" />

      <div className="space-y-4 p-5">
        <div className="h-4 w-2/5 animate-pulse rounded bg-card-hover" />

        <div className="h-7 w-4/5 animate-pulse rounded bg-card-hover" />

        <div className="h-16 animate-pulse rounded bg-card-hover" />

        <div className="h-4 w-1/3 animate-pulse rounded bg-card-hover" />
      </div>
    </div>
  );
}

export default function LatestBlogsSection() {
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadLatestBlogs = async () => {
      try {
        const result = await getBlogs({
          page: 1,
          limit: 3,
          sort: "publishedAt",
          order: "desc",
        });

        if (active) {
          setBlogs((result.blogs || []).slice(0, 3));
        }
      } catch (error) {
        console.error("Unable to load latest blogs:", error);

        if (active) {
          setBlogs([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadLatestBlogs();

    return () => {
      active = false;
    };
  }, []);

  if (!loading && blogs.length === 0) {
    return null;
  }

  return (
    <section
      className="
      relative
      overflow-hidden
      bg-card-hover/30
      py-16
      sm:py-20
      lg:py-24
      "
    >
      {/* Background */}

      <div
        className="
        pointer-events-none
        absolute
        -right-32
        bottom-10
        h-72
        w-72
        rounded-full
        bg-secondary/10
        blur-3xl
        "
      />

      <div
        className="
        pointer-events-none
        absolute
        -left-32
        top-10
        h-72
        w-72
        rounded-full
        bg-primary/10
        blur-3xl
        "
      />

      <div
        className="
        relative
        mx-auto
        max-w-300
        px-5
        sm:px-6
        lg:px-8
        "
      >
        {/* Heading */}

        <div
          className="
          flex
          flex-col
          gap-5
          sm:flex-row
          sm:items-end
          sm:justify-between
          "
        >
          <div>
            <p
              className="
              text-sm
              font-bold
              uppercase
              tracking-[0.18em]
              text-secondary
              "
            >
              Study in Italy insights
            </p>

            <h2
              className="
              mt-3
              font-display
              text-3xl
              font-bold
              tracking-tight
              text-foreground
              sm:text-4xl
              "
            >
              Latest Blogs
            </h2>

            <p
              className="
              mt-4
              max-w-2xl
              leading-7
              text-muted
              "
            >
              Explore practical guides on Italian universities, admissions,
              scholarships, pre-enrolment, student visas and life in Italy.
            </p>
          </div>

          <Link
            href="/blogs"
            className="
            group
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-xl
            border
            border-primary/25
            bg-primary-light
            px-5
            py-3
            text-sm
            font-bold
            text-primary
            shadow-sm
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-primary/40
            hover:shadow-lg
            "
          >
            View all blogs
            <span
              aria-hidden="true"
              className="
              transition-transform
              duration-300
              group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>
        </div>

        {/* Blogs */}

        <div
          className="
          mt-10
          grid
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          "
        >
          {loading
            ? Array.from({
                length: 3,
              }).map((_, index) => <BlogSkeleton key={index} />)
            : blogs.map((blog) => (
                <BlogCard key={blog._id || blog.slug} blog={blog} />
              ))}
        </div>
      </div>
    </section>
  );
}
