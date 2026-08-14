import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Eye,
  Tag,
  UserRound,
} from "lucide-react";
import { getBlogBySlug, getRelatedBlogs } from "@/services/blogs.service";


function formatDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

const getBlogData = async (slug) => {
  try {
    return await getBlogBySlug(slug);
  } catch (error) {
    if (
      error?.response?.status === 404 ||
      error?.message === "Blog not found"
    ) {
      return null;
    }

    throw error;
  }
};

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const blog = await getBlogData(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | European Dreams",
    };
  }

  return {
    title: blog.seoTitle || `${blog.title} | European Dreams`,

    description: blog.metaDescription || blog.excerpt,

    keywords: blog.keywords?.length ? blog.keywords : blog.tags,

    alternates: blog.canonicalUrl
      ? {
          canonical: blog.canonicalUrl,
        }
      : undefined,

    openGraph: {
      title: blog.seoTitle || blog.title,

      description: blog.metaDescription || blog.excerpt,

      type: "article",

      publishedTime: blog.publishedAt || undefined,

      authors: blog.authorName ? [blog.authorName] : ["European Dreams"],

      images: blog.featuredImage
        ? [
            {
              url: blog.featuredImage,
              alt: blog.featuredImageAlt || blog.title,
            },
          ]
        : [],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;

  const blog = await getBlogData(slug);

  if (!blog) {
    notFound();
  }

  let relatedBlogs = [];

  try {
    relatedBlogs = await getRelatedBlogs({
      category: blog.category,
      excludeSlug: blog.slug,
      limit: 3,
    });
  } catch (error) {
    console.error("Failed to load related blogs:", error);
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero */}

      <section
        className="
        relative
        overflow-hidden
        border-b
        border-[var(--border)]
        bg-[var(--hero-gradient)]
        "
      >
        <div
          className="
          pointer-events-none
          absolute
          -right-32
          -top-24
          h-80
          w-80
          rounded-full
          bg-[var(--primary)]/10
          blur-[120px]
          "
        />

        <div
          className="
          pointer-events-none
          absolute
          -bottom-32
          -left-32
          h-80
          w-80
          rounded-full
          bg-[var(--secondary)]/10
          blur-[120px]
          "
        />

        <div
          className="
          container-custom
          relative
          mx-auto
          px-4
          py-12
          md:py-16
          "
        >
          <Link
            href="/blogs"
            className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-[var(--primary)]
            transition
            hover:opacity-80
            "
          >
            <ArrowLeft size={17} />
            Back to blogs
          </Link>

          <div className="mt-8 max-w-4xl">
            {blog.category && (
              <Link
                href={`/blogs?category=${encodeURIComponent(blog.category)}`}
                className="
                inline-flex
                rounded-full
                bg-[var(--secondary)]/10
                px-4
                py-2
                text-xs
                font-bold
                uppercase
                tracking-[0.13em]
                text-[var(--secondary)]
                "
              >
                {blog.category}
              </Link>
            )}

            <h1
              className="
              mt-5
              text-4xl
              font-bold
              leading-tight
              tracking-tight
              text-[var(--foreground)]
              md:text-5xl
              lg:text-6xl
              "
            >
              {blog.title}
            </h1>

            <p
              className="
              mt-5
              max-w-3xl
              text-base
              leading-8
              text-[var(--muted)]
              md:text-lg
              "
            >
              {blog.excerpt}
            </p>

            {/* Meta */}

            <div
              className="
              mt-7
              flex
              flex-wrap
              gap-x-5
              gap-y-3
              text-sm
              text-[var(--muted)]
              "
            >
              <span className="inline-flex items-center gap-1.5">
                <UserRound size={16} />

                {blog.authorName || "European Dreams"}
              </span>

              {blog.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={16} />

                  {formatDate(blog.publishedAt)}
                </span>
              )}

              {blog.readTime && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={16} />

                  {blog.readTime}
                </span>
              )}

              {Number(blog.views) > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Eye size={16} />
                  {blog.views} views
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured image */}

      {blog.featuredImage && (
        <section className="container-custom mx-auto px-4 pt-10">
          <div
            className="
            relative
            aspect-[16/8]
            overflow-hidden
            rounded-[28px]
            border
            border-[var(--border)]
            bg-[var(--card)]
            shadow-xl
            "
          >
            <Image
              src={blog.featuredImage}
              alt={blog.featuredImageAlt || blog.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1180px"
              className="object-cover"
            />
          </div>
        </section>
      )}

      {/* Article */}

      <section
        className="
        container-custom
        mx-auto
        grid
        gap-10
        px-4
        py-12
        lg:grid-cols-[minmax(0,1fr)_300px]
        lg:py-16
        "
      >
        <article
          className="
          min-w-0
          rounded-[28px]
          border
          border-[var(--border)]
          bg-[var(--card)]
          p-6
          shadow-sm
          md:p-8
          lg:p-10
          "
        >
          <BlogContent content={blog.content} />

          {/* Tags */}

          {blog.tags?.length > 0 && (
            <div
              className="
              mt-10
              border-t
              border-[var(--border)]
              pt-6
              "
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="
                  mr-1
                  inline-flex
                  items-center
                  gap-1.5
                  text-sm
                  font-semibold
                  text-[var(--foreground)]
                  "
                >
                  <Tag size={15} />
                  Tags
                </span>

                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blogs?search=${encodeURIComponent(tag)}`}
                    className="
                    rounded-full
                    border
                    border-[var(--border)]
                    bg-[var(--background)]
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-[var(--muted)]
                    transition
                    hover:border-[var(--primary)]/30
                    hover:text-[var(--primary)]
                    "
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}

        <aside className="space-y-6">
          <div
            className="
            rounded-[24px]
            border
            border-[var(--border)]
            bg-[var(--card)]
            p-6
            shadow-sm
            "
          >
            <p
              className="
              text-xs
              font-bold
              uppercase
              tracking-[0.15em]
              text-[var(--secondary)]
              "
            >
              Need guidance?
            </p>

            <h2
              className="
              mt-3
              text-xl
              font-bold
              leading-7
              text-[var(--foreground)]
              "
            >
              Planning to study in Italy?
            </h2>

            <p
              className="
              mt-3
              text-sm
              leading-6
              text-[var(--muted)]
              "
            >
              Get help with university selection, applications, scholarships,
              pre-enrolment and student visa preparation.
            </p>

            <Link
              href="/contact"
              className="
              group
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[var(--primary)]
              px-5
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:bg-[var(--primary-hover)]
              "
            >
              Book Free Consultation
              <ArrowRight
                size={16}
                className="
                transition
                group-hover:translate-x-1
                "
              />
            </Link>
          </div>

          {/* Blog information */}

          <div
            className="
            rounded-[24px]
            border
            border-[var(--border)]
            bg-[var(--card)]
            p-6
            "
          >
            <h3
              className="
              font-bold
              text-[var(--foreground)]
              "
            >
              Article information
            </h3>

            <div className="mt-5 space-y-4">
              <InfoRow label="Category" value={blog.category} />

              <InfoRow
                label="Author"
                value={blog.authorName || "European Dreams"}
              />

              {blog.readTime && (
                <InfoRow label="Read time" value={blog.readTime} />
              )}

              {blog.publishedAt && (
                <InfoRow
                  label="Published"
                  value={formatDate(blog.publishedAt)}
                />
              )}
            </div>
          </div>
        </aside>
      </section>

      {/* Related blogs */}

      {relatedBlogs.length > 0 && (
        <section
          className="
          border-t
          border-[var(--border)]
          bg-[var(--card-hover)]/40
          py-14
          md:py-20
          "
        >
          <div className="container-custom mx-auto px-4">
            <div
              className="
              flex
              flex-col
              gap-4
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
                  tracking-[0.15em]
                  text-[var(--secondary)]
                  "
                >
                  Keep exploring
                </p>

                <h2
                  className="
                  mt-2
                  text-3xl
                  font-bold
                  text-[var(--foreground)]
                  "
                >
                  Related articles
                </h2>
              </div>

              <Link
                href="/blogs"
                className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-bold
                text-[var(--primary)]
                "
              >
                View all blogs
                <ArrowRight size={16} />
              </Link>
            </div>

            <div
              className="
              mt-8
              grid
              gap-6
              md:grid-cols-2
              lg:grid-cols-3
              "
            >
              {relatedBlogs.map((relatedBlog) => (
                <RelatedBlogCard key={relatedBlog._id} blog={relatedBlog} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

/*
 * Supports plain text content from MongoDB.
 *
 * Paragraphs are separated by blank lines.
 * Lines starting with:
 *
 * ## = H2
 * ### = H3
 * - = bullet
 */
function BlogContent({ content = "" }) {
  const blocks = String(content).replace(/\r/g, "").split("\n");

  const output = [];

  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;

    output.push(
      <p
        key={`paragraph-${output.length}`}
        className="
        my-5
        text-[16px]
        leading-8
        text-[var(--muted)]
        "
      >
        {paragraph.join(" ")}
      </p>,
    );

    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;

    output.push(
      <ul
        key={`list-${output.length}`}
        className="
        my-6
        space-y-3
        pl-2
        "
      >
        {list.map((item, index) => (
          <li
            key={index}
            className="
              flex
              items-start
              gap-3
              leading-7
              text-[var(--muted)]
              "
          >
            <span
              className="
                mt-2.5
                h-1.5
                w-1.5
                shrink-0
                rounded-full
                bg-[var(--primary)]
                "
            />

            <span>{item}</span>
          </li>
        ))}
      </ul>,
    );

    list = [];
  };

  blocks.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();

      return;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();

      output.push(
        <h3
          key={`h3-${output.length}`}
          className="
          mb-3
          mt-8
          text-xl
          font-bold
          text-[var(--foreground)]
          md:text-2xl
          "
        >
          {trimmed.slice(4)}
        </h3>,
      );

      return;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();

      output.push(
        <h2
          key={`h2-${output.length}`}
          className="
          mb-4
          mt-10
          text-2xl
          font-bold
          text-[var(--foreground)]
          md:text-3xl
          "
        >
          {trimmed.slice(3)}
        </h2>,
      );

      return;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();

      list.push(trimmed.slice(2));

      return;
    }

    flushList();

    paragraph.push(trimmed);
  });

  flushParagraph();
  flushList();

  return output;
}

function InfoRow({ label, value }) {
  if (!value) return null;

  return (
    <div
      className="
      border-b
      border-[var(--border)]
      pb-3
      last:border-0
      last:pb-0
      "
    >
      <p
        className="
        text-xs
        font-medium
        text-[var(--muted)]
        "
      >
        {label}
      </p>

      <p
        className="
        mt-1
        text-sm
        font-semibold
        text-[var(--foreground)]
        "
      >
        {value}
      </p>
    </div>
  );
}

function RelatedBlogCard({ blog }) {
  return (
    <article
      className="
      group
      overflow-hidden
      rounded-[22px]
      border
      border-[var(--border)]
      bg-[var(--card)]
      shadow-sm
      transition
      hover:-translate-y-1
      hover:border-[var(--primary)]/30
      hover:shadow-xl
      "
    >
      <Link href={`/blogs/${blog.slug}`}>
        <div
          className="
          relative
          aspect-[16/9]
          overflow-hidden
          bg-[var(--background)]
          "
        >
          {blog.featuredImage ? (
            <Image
              src={blog.featuredImage}
              alt={blog.featuredImageAlt || blog.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="
              object-cover
              transition
              duration-500
              group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
              flex
              h-full
              items-center
              justify-center
              bg-[var(--primary)]/10
              text-sm
              font-bold
              text-[var(--primary)]
              "
            >
              European Dreams
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <p
          className="
          text-xs
          font-bold
          uppercase
          tracking-[0.12em]
          text-[var(--secondary)]
          "
        >
          {blog.category}
        </p>

        <Link href={`/blogs/${blog.slug}`}>
          <h3
            className="
            mt-2
            line-clamp-2
            text-lg
            font-bold
            leading-6
            text-[var(--foreground)]
            transition
            group-hover:text-[var(--primary)]
            "
          >
            {blog.title}
          </h3>
        </Link>

        {blog.publishedAt && (
          <p
            className="
            mt-3
            text-xs
            text-[var(--muted)]
            "
          >
            {formatDate(blog.publishedAt)}
          </p>
        )}
      </div>
    </article>
  );
}
